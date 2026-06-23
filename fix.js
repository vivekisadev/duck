const fs = require('fs');
const path = require('path');
const files = fs.readdirSync('website/src').filter(f => f.startsWith('Rig') && f.endsWith('.jsx'));
files.forEach(f => {
    const fp = path.join('website/src', f);
    let c = fs.readFileSync(fp, 'utf8');
    c = c.replace(/''Chivo Mono', monospace'/g, "\"'Chivo Mono', monospace\"");
    fs.writeFileSync(fp, c);
});
console.log("Fixed Chivo Mono quotes");
