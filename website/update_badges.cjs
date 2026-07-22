const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'components', 'sections');
const files = fs.readdirSync(dir);

files.forEach(file => {
  if (file.endsWith('.jsx')) {
    const filePath = path.join(dir, file);
    let code = fs.readFileSync(filePath, 'utf-8');

    // Regex to find:
    // <div className="badge ...">
    //   <svg ...> ... </svg>
    //   Text
    // </div>
    // Note: Some files have multi-line paths inside the SVG.
    const svgRegex = /<svg[\s\S]*?<\/svg>/g;
    
    // We only want to replace SVGs that are inside a .badge div.
    // Instead of complex regex, let's just replace all SVGs that match the exact badge icon size (width="16" height="16")
    // Or, we can just replace the svg block directly where we know it's a badge.
    const badgeRegex = /(<div className="badge[^>]*>)\s*<svg[^>]*width="16"[^>]*>[\s\S]*?<\/svg>/g;
    
    if (badgeRegex.test(code)) {
      code = code.replace(badgeRegex, '$1\n          <div className="w-1.5 h-1.5 bg-red shrink-0"></div>');
      fs.writeFileSync(filePath, code);
      console.log(`Updated badge SVG in ${file}`);
    }
  }
});
