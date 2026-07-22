import fs from 'fs/promises';
import path from 'path';
import os from 'os';

const defaultConfig = {
  provider: 'groq',
  model: 'llama3-8b-8192',
  apiKeyEnvVar: 'DUCK_GROQ_API_KEY',
  style: 'conventional-commits',
  duckPersonality: 'neutral',
  maxQuestions: 1
};

export async function loadConfig() {
  let config = { ...defaultConfig };

  // Load from ~/.duckrc (global)
  try {
    const globalConfigPath = path.join(os.homedir(), '.duckrc');
    const globalConfigData = await fs.readFile(globalConfigPath, 'utf8');
    const globalConfig = JSON.parse(globalConfigData);
    config = { ...config, ...globalConfig };
  } catch (err) {
    // Ignore if not found or invalid
  }

  // Load from ./.duckrc (local)
  try {
    const localConfigPath = path.join(process.cwd(), '.duckrc');
    const localConfigData = await fs.readFile(localConfigPath, 'utf8');
    const localConfig = JSON.parse(localConfigData);
    config = { ...config, ...localConfig };
  } catch (err) {
    // Ignore if not found or invalid
  }

  return config;
}
