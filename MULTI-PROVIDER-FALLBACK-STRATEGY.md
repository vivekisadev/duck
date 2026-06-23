# Multi-Provider AI Fallback Strategy

## Why one provider isn't enough

Even with the Tier 0/1/2 cost-cutting from `AI-CALL-BUDGET-STRATEGY.md`, a single free-tier provider can still run dry on a heavy day — and free-tier model catalogs occasionally change without notice (a provider can quietly retire a model your config points to). duck should never just fail when that happens; it should quietly move to the next provider in line.

## Token Estimate Recap (from the core commit flow)

| Diff size | Tokens per combined draft+ambiguity call |
|---|---|
| Small (1 file, ~20 lines) | ~550–850 |
| Medium (few files, ~100 lines) | ~1,250–2,450 |
| Large (refactor, 300+ lines) | ~4,450+ |

Use ~1,200 tokens/call as the planning average for a mixed day of commits.

## Provider Rotation Order (default priority)

Ranked by a mix of quality, speed, and how much daily headroom they give a single developer. Verify exact current numbers at each provider's docs before build — free tiers change often.

| Priority | Provider | Model | RPM | RPD | TPD | Notes |
|---|---|---|---|---|---|---|
| 1 | Groq | `llama-3.3-70b-versatile` | 30 | 1,000 | ~100,000 | Best quality/speed balance; ~80 calls/day at planning-average diff size |
| 2 | Groq | `llama-3.1-8b-instant` | 30 | 14,400 | ~500,000 | Same provider, same key — automatic same-account fallback, ~400 calls/day |
| 3 | Cerebras | (fast open-weight model, check current catalog) | ~30 | ~14,400 | ~1,000,000 | Highest daily token ceiling of any free tier — biggest safety net |
| 4 | Google AI Studio | Gemini 2.5 Flash | ~10–15 | ~1,500 | — | Strong quality, large context window; lower request volume post-2025 free-tier cuts |
| 5 | OpenRouter | any `:free`-tagged model | ~20/model | — | — | ~30 free models pooled behind one key — useful breadth when everything else is dry |
| 6 | Mistral | any Mistral model | 2 | — | ~33M/mo (1B/month) | Huge monthly budget but very slow rate — reserve for non-interactive commands (`onboard`, `changelog`), not commit-time flow |

**Setup requirement:** the developer only needs to add keys for the providers they want in rotation — even just Groq alone still works, it just has less headroom. More keys = more daily capacity, not required.

## Rotation & Failover Logic

### Local usage tracking
Keep a small local file, `~/.duck/usage.json`, tracking calls/tokens spent per provider per UTC day:
```json
{
  "date": "2026-07-18",
  "groq-70b": { "requests": 42, "tokens": 51000 },
  "groq-8b": { "requests": 0, "tokens": 0 },
  "cerebras": { "requests": 0, "tokens": 0 }
}
```
Reset automatically when the UTC date rolls over.

### Selection algorithm (runs before every AI call)
1. Walk the priority list in order
2. Skip any provider with no configured key
3. Skip any provider whose local usage counter is already within ~10% of its known daily cap (proactive — don't wait for a 429 to find out)
4. Use the first provider that passes both checks
5. If the API call itself returns a 429 or quota error anyway (limits can shift, or local tracking can drift), immediately retry once against the *next* provider in line before giving up
6. If every configured provider is exhausted, fall back to the Tier 1 template/heuristic path (a rougher commit message) rather than blocking the commit entirely — never let AI exhaustion stop a developer from committing

### Model catalog resilience
Before the first call of each day (or on a fresh install), duck should do a lightweight check that the configured model name is still valid for that provider (a cheap models-list call, not a full completion). If a model has been retired, log a clear one-line notice and skip to the next provider in rotation rather than erroring out on every subsequent call.

## Config Schema Update

```json
// .duckrc
{
  "providers": [
    { "name": "groq", "model": "llama-3.3-70b-versatile", "apiKeyEnvVar": "DUCK_GROQ_KEY" },
    { "name": "groq", "model": "llama-3.1-8b-instant", "apiKeyEnvVar": "DUCK_GROQ_KEY" },
    { "name": "cerebras", "model": "<check current catalog>", "apiKeyEnvVar": "DUCK_CEREBRAS_KEY" },
    { "name": "gemini", "model": "gemini-2.5-flash", "apiKeyEnvVar": "DUCK_GEMINI_KEY" },
    { "name": "openrouter", "model": "<any :free model>", "apiKeyEnvVar": "DUCK_OPENROUTER_KEY" },
    { "name": "mistral", "model": "mistral-small", "apiKeyEnvVar": "DUCK_MISTRAL_KEY", "reserveFor": ["onboard", "changelog"] }
  ]
}
```

Note the `reserveFor` field on Mistral — since its 2 RPM cap makes it unusable for the interactive commit flow (the developer would sit waiting), but its huge monthly budget makes it a good fit for one-off, non-blocking commands like `duck onboard`.

## Setup Wizard Update

On first run, instead of asking for one key, ask: *"Paste any free API keys you have (Groq, Cerebras, Gemini, OpenRouter, Mistral) — press enter to skip any. More keys = more daily headroom, but even one is enough to start."* Store whichever are provided; rotation automatically uses only the ones configured.

## One Honest Note on Free Tiers

Several providers' free tiers use submitted prompts for model training/improvement by default (this varies by provider and can change — check each one's current data-use policy before relying on it for private/proprietary code). Since duck sends real diffs to whichever provider is active, this is worth surfacing to the developer once during setup — not to block usage, just so it's an informed choice, especially for anyone working in a private or client codebase.

## Folder Structure Addition

```
src/
├── ai/
│   ├── provider.js          # now selects across the rotation list, not a single provider
│   ├── providers/
│   │   ├── groq.js
│   │   ├── cerebras.js
│   │   ├── gemini.js
│   │   ├── openrouter.js
│   │   └── mistral.js
│   ├── usageTracker.js      # reads/writes ~/.duck/usage.json, resets daily
│   └── prompts.js
```

`provider.js`'s `getCompletion()` signature stays the same as before — callers don't need to know rotation is happening underneath. This keeps every command built so far (draft message, standup, blame-explain, etc.) unaffected by this change.
