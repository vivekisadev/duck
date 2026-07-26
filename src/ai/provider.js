import fs from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';
import readline from 'readline';
import { callGroq } from './groq.js';
import { callOllama } from './ollama.js';

const DUCK_DIR = path.join(os.homedir(), '.duck');
const CONFIG_PATH = path.join(DUCK_DIR, 'config.json');
const INSTALL_ID_PATH = path.join(DUCK_DIR, 'install-id');
const RELAY_URL = process.env.DUCK_RELAY_URL || 'https://relay.duck-cli.workers.dev';

function getInstallId() {
  if (!fs.existsSync(DUCK_DIR)) fs.mkdirSync(DUCK_DIR, { recursive: true });
  if (fs.existsSync(INSTALL_ID_PATH)) {
    return fs.readFileSync(INSTALL_ID_PATH, 'utf8').trim();
  }
  const newId = crypto.randomUUID();
  fs.writeFileSync(INSTALL_ID_PATH, newId, { mode: 0o600 });
  return newId;
}

function getLocalConfig() {
  if (fs.existsSync(CONFIG_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
    } catch(e) {}
  }
  return {};
}

function saveLocalConfig(config) {
  if (!fs.existsSync(DUCK_DIR)) fs.mkdirSync(DUCK_DIR, { recursive: true });
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), { mode: 0o600 });
}

async function promptForKey() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('\n🦆 Oh no, the global flock is out of free tokens today! (Pool exhausted)');
  console.log('\n  You can add your own free API key (Groq, Gemini, etc.) to keep');
  console.log('  duck flying at full speed. It takes 2 minutes and no card is needed!\n');

  return new Promise((resolve) => {
    rl.question('  Add a key now? [Y/n] ', (answer) => {
      if (answer.toLowerCase() === 'n') {
        rl.close();
        resolve(null);
      } else {
        rl.question('  Paste your key: ', (key) => {
          rl.close();
          console.log('\n✓ Quack-tastic! Saved. Using your key for future requests.\n');
          resolve(key.trim());
        });
      }
    });
  });
}

async function callRelay(prompt, systemPrompt, installId) {
  try {
    const res = await fetch(RELAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-install-id': installId
      },
      body: JSON.stringify({ prompt, systemPrompt })
    });
    
    if (res.status === 429) return { status: 'exhausted' };
    if (!res.ok) throw new Error(`Relay error: ${res.status}`);
    
    const data = await res.json();
    return data;
  } catch (err) {
    return { status: 'error', message: err.message };
  }
}

export async function getCompletion(prompt, systemPrompt = '', config = {}) {
  const localConfig = getLocalConfig();
  const installId = getInstallId();

  // 1. User Key Mode (Primary if configured)
  const envKey = process.env[config.apiKeyEnvVar || 'DUCK_GROQ_API_KEY'];
  if (localConfig.userKey || envKey) {
    console.log('🦆 *waddling to your personal API provider*');
    try {
      if (localConfig.userKey) {
        process.env.DUCK_GROQ_API_KEY = localConfig.userKey;
      }
      return await callGroq(prompt, systemPrompt, config);
    } catch (err) {
      console.log('⚠ Your personal API key hit a limit or failed — falling back to shared flock capacity for this request.');
      // Fall through to relay
    }
  }

  // 2. Relay Pool Mode (Default)
  if (!localConfig.userKey) {
    console.log('🦆 *waddling to shared Relay servers...*');
  }
  
  const relayResult = await callRelay(prompt, systemPrompt, installId);

  // 3. Exhausted or Error Mode
  if ((relayResult.status === 'exhausted' || relayResult.status === 'error') && !localConfig.hasUserKey) {
    if (relayResult.status === 'error') {
      console.log('⚠ Could not reach the shared Duck Relay (it might be offline).');
    }
    const wantsToAddKey = await promptForKey();
    if (wantsToAddKey) {
      localConfig.userKey = wantsToAddKey;
      localConfig.hasUserKey = true;
      saveLocalConfig(localConfig);
      process.env.DUCK_GROQ_API_KEY = wantsToAddKey;
      return await callGroq(prompt, systemPrompt, config);
    }
    // Fallback to Tier 1 Heuristic if they say no
    return heuristicFallback();
  }

  if (relayResult.status === 'success') {
    return relayResult.content;
  }

  // Absolute fallback
  return heuristicFallback();
}

function heuristicFallback() {
  return 'chore: update files\n\n(Generated via offline heuristic fallback)';
}
