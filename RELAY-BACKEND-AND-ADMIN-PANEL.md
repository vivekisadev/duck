# Relay Backend, Admin Panel & Key Fallback Flow

## The Core Shift

Instead of the CLI calling Groq/Cerebras/Gemini/etc. directly with keys embedded in the npm package (extractable, unsafe, ties every user's traffic to your personal account limits in an uncontrolled way), the CLI calls **one endpoint on your own backend**. Your backend holds all the provider keys server-side, does the rotation from `MULTI-PROVIDER-FALLBACK-STRATEGY.md`, and is the only thing that ever talks to Groq/Cerebras/etc. directly.

```
duck (CLI, on user's machine)
   │
   │  POST /v1/complete  { prompt, promptType, installId }
   ▼
your relay backend (serverless function)
   │
   │  rotates across Groq → Cerebras → Gemini → OpenRouter → Mistral
   │  using YOUR keys, held server-side, never shipped to any user
   ▼
whichever provider is next in line and has headroom
```

This is genuinely lightweight to run for free:
- **Cloudflare Workers** (or Vercel serverless functions) — generous free tier, easily enough for early-stage traffic
- **A small KV store or free-tier Postgres** (e.g. Supabase/Neon free tier) for usage logging — this is what powers the admin panel

---

## The Full Flow (Default → Exhausted → User Key → Recovery)

### State 1 — Default: relay pool handles everything
Every `duck` command that needs AI calls your relay endpoint. The user never sees a key prompt, never configures anything. This is the zero-friction default experience.

### State 2 — Relay pool exhausted
If your backend has rotated through every provider in `MULTI-PROVIDER-FALLBACK-STRATEGY.md` and all are out of daily headroom, it returns a specific response (e.g. `{ "status": "exhausted" }`) instead of an error. Only then does the CLI show a prompt — not before, not proactively, not as a setup step:

```
$ git commit
✓ Reading staged diff
⚠ Our free AI capacity is used up for today.

  You can add your own free API key (Groq, Gemini, etc. — takes
  2 minutes, no card needed) to keep duck working at full speed.
  It'll be saved locally and used automatically from now on.

  Add a key now? [Y/n]
> y
  Paste your key: ________
✓ Saved. Using your key for future requests.
```

If they say no, duck falls back to the Tier 1 template/heuristic path (from `AI-CALL-BUDGET-STRATEGY.md`) for that commit rather than blocking it — same "never block a commit" rule as everywhere else in the design.

### State 3 — User key mode (once they've added one)
From this point on, **the user's own key is used first for every request** — this is both what they asked for and it's the considerate default, since it takes load off your shared pool for everyone else.

```
$ git commit
✓ Reading staged diff
✓ Drafting commit message (using your Groq key)
```

### State 4 — User's own key fails
If their personal key hits its own rate limit, is invalid, or the request errors, duck falls back to the relay pool **for that request only** — not a permanent switch back:

```
$ git commit
⚠ Your API key hit a rate limit — falling back to shared capacity
  for this request.
✓ Drafting commit message
```

This gives exactly the behavior you described: relay pool by default → prompt only when truly exhausted → user's own key becomes primary once added → relay pool as a safety net if their key ever fails, not a full switch-back.

---

## CLI-Side Implementation

### Local storage
- `~/.duck/config.json` — stores the user's own key (if they've added one), file permissions restricted to the current user (`chmod 600`) as the MVP approach; an OS keychain integration (e.g. via `keytar`) is a reasonable stretch goal for later, not required for launch
- `~/.duck/install-id` — a random UUID generated once on first run, used only to let your backend distinguish installs for usage counting (Section below) — not tied to any personal info, no email/account required

### Request logic (`provider.js`)
```
async function getCompletion(prompt) {
  if (localConfig.hasUserKey) {
    try {
      return await callDirectly(localConfig.userKey, prompt);
    } catch (err) {
      // fall through to relay as a safety net
    }
  }
  const relayResult = await callRelay(prompt, installId);
  if (relayResult.status === "exhausted" && !localConfig.hasUserKey) {
    const wantsToAddKey = await promptForKey(); // only fires here, never earlier
    if (wantsToAddKey) {
      saveUserKey(wantsToAddKey);
      return await callDirectly(wantsToAddKey, prompt);
    }
    return null; // caller falls back to Tier 1 template path
  }
  return relayResult;
}
```

---

## Admin Panel — What to Show on Your Website

Since your backend is now the single point every install talks to, logging is straightforward and gives you real insight without needing anything from the user:

| Metric | Why it's useful |
|---|---|
| Requests today, per provider | See which provider is carrying the load, spot when one's about to run dry |
| Estimated remaining daily headroom per provider | Computed from known caps (Section in `MULTI-PROVIDER-FALLBACK-STRATEGY.md`) minus today's usage — lets you glance and know if you need to add a provider |
| Active installs (unique `install-id`s seen in last 7/30 days) | Real usage signal, no accounts needed |
| Fallback-to-user-key rate | How often installs hit "exhausted" and had to add their own key — your best signal for when to add more providers to the pool |
| Most-used commands | Which duck commands are actually getting used — informs what to build next |
| Error rate by provider | Catches a provider silently degrading or retiring a model before users complain |

None of this requires storing prompt content or diff content on your backend — log only metadata (timestamp, provider, model, success/fail, install-id, command name). Keeping actual code diffs out of your own logs is both a privacy good-practice and one less thing to secure.

---

## Abuse Mitigation (worth building in from day one)

A public relay endpoint with no protection can be hit by anyone, not just duck users, and would burn through your pooled capacity faster than real usage would. Minimum viable protection:
- Require the `install-id` header on every request (generated locally, not user-editable in normal use) — not real auth, but raises the bar past a casual script
- Rate-limit per `install-id` server-side (e.g. no more than X requests/hour per install) so one runaway install can't eat the whole day's pool
- Consider a simple shared secret baked into the published npm package as a minimum bar — not real security, but filters out completely unrelated traffic hitting your endpoint by accident or automated scanning

---

## Summary of What Changes From the Earlier Design

- `provider.js` now calls your relay endpoint by default, not Groq/Cerebras/etc. directly
- The rotation logic from `MULTI-PROVIDER-FALLBACK-STRATEGY.md` moves **server-side**, into the relay backend, not the CLI
- The CLI only ever prompts for a personal key once the relay reports full exhaustion — never on install, never proactively
- Once a user adds their own key, it becomes primary for them, with the relay as their personal safety net
- Your website gains a genuinely useful admin panel almost for free, since the relay is already the single chokepoint for every install's traffic
