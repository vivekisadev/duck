import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

export async function getCachedDraft(diff) {
  try {
    const cachePath = path.join(process.cwd(), '.git', 'duck-cache.json');
    const hash = crypto.createHash('sha256').update(diff).digest('hex');
    const cacheData = await fs.readFile(cachePath, 'utf8');
    const cache = JSON.parse(cacheData);

    if (cache.hash === hash) {
      return cache.draft;
    }
  } catch (err) {
    // Cache miss or error
  }
  return null;
}

export async function setCachedDraft(diff, draft) {
  try {
    const cachePath = path.join(process.cwd(), '.git', 'duck-cache.json');
    const hash = crypto.createHash('sha256').update(diff).digest('hex');
    await fs.writeFile(cachePath, JSON.stringify({ hash, draft }), 'utf8');
  } catch (err) {
    // Ignore cache write errors
  }
}
