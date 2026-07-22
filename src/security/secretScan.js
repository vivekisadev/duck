const secretPatterns = [
  { name: 'AWS Access Key', pattern: /AKIA[0-9A-Z]{16}/ },
  { name: 'Google Cloud API Key', pattern: /AIza[0-9A-Za-z_-]{35}/ },
  { name: 'Generic Secret', pattern: /(?:secret|password|token|api[_-]?key)[ =:]+['"]?[0-9a-zA-Z]{16,}['"]?/i }
];

export function scanForSecrets(diff) {
  const foundSecrets = [];
  
  for (const { name, pattern } of secretPatterns) {
    if (pattern.test(diff)) {
      foundSecrets.push(name);
    }
  }

  return foundSecrets;
}
