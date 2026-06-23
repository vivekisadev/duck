const fs = require('fs');

const html = fs.readFileSync('rig-template/rig.ai/index.html', 'utf8');

function convertToJSX(htmlString) {
    let jsx = htmlString
        .replace(/class=/g, 'className=')
        .replace(/data-astro-cid-[a-z0-9-]*(=["'][^"']*["'])?/g, '')
        .replace(/for=/g, 'htmlFor=')
        .replace(/<br>/g, '<br />')
        .replace(/<hr>/g, '<hr />')
        .replace(/<img([^>]*)>/g, (match, p1) => `<img${p1.replace(/\/$/, '')} />`)
        .replace(/<circle([^>]*)>/g, (match, p1) => `<circle${p1.replace(/\/$/, '')} />`)
        .replace(/<path([^>]*)>/g, (match, p1) => `<path${p1.replace(/\/$/, '')} />`)
        .replace(/<line([^>]*)>/g, (match, p1) => `<line${p1.replace(/\/$/, '')} />`)
        .replace(/<rect([^>]*)>/g, (match, p1) => `<rect${p1.replace(/\/$/, '')} />`)
        .replace(/<polyline([^>]*)>/g, (match, p1) => `<polyline${p1.replace(/\/$/, '')} />`)
        .replace(/<ellipse([^>]*)>/g, (match, p1) => `<ellipse${p1.replace(/\/$/, '')} />`)
        .replace(/<polygon([^>]*)>/g, (match, p1) => `<polygon${p1.replace(/\/$/, '')} />`)
        .replace(/<animate([^>]*)>/g, (match, p1) => `<animate${p1.replace(/\/$/, '')} />`)
        .replace(/<animateMotion(.*?)>/g, (match, p1) => {
            if(match.includes('</animateMotion>')) return match;
            return `<animateMotion${p1.replace(/\/$/, '')}>`;
        })
        .replace(/<mpath(.*?)>/g, (match, p1) => `<mpath${p1.replace(/\/$/, '')} />`)
        .replace(/<stop(.*?)>/g, (match, p1) => `<stop${p1.replace(/\/$/, '')} />`)
        .replace(/stroke-width/g, 'strokeWidth')
        .replace(/stroke-dasharray/g, 'strokeDasharray')
        .replace(/stroke-linecap/g, 'strokeLinecap')
        .replace(/fill-rule/g, 'fillRule')
        .replace(/clip-rule/g, 'clipRule')
        .replace(/clip-path/g, 'clipPath')
        .replace(/font-family/g, 'fontFamily')
        .replace(/font-size/g, 'fontSize')
        .replace(/text-anchor/g, 'textAnchor')
        .replace(/dominant-baseline/g, 'dominantBaseline')
        .replace(/letter-spacing/g, 'letterSpacing')
        .replace(/text-transform/g, 'textTransform')
        .replace(/stop-color/g, 'stopColor')
        .replace(/stop-opacity/g, 'stopOpacity')
        .replace(/pointer-events/g, 'pointerEvents')
        .replace(/repeatCount/g, 'repeatCount')
        .replace(/keyPoints/g, 'keyPoints')
        .replace(/keyTimes/g, 'keyTimes')
        .replace(/calcMode/g, 'calcMode')
        .replace(/attributeName/g, 'attributeName')
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/style="([^"]*)"/g, (match, styleString) => {
            const styleObj = styleString.split(';').filter(s => s.trim()).reduce((acc, style) => {
                const [key, value] = style.split(':').map(s => s.trim());
                if(key && value) {
                    const camelKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                    acc.push(`'${camelKey}': '${value}'`);
                }
                return acc;
            }, []);
            return `style={{${styleObj.join(', ')}}}`;
        });
    return jsx;
}

const htmlWithClassName = html.replace(/class=/g, 'className=').replace(/data-astro-cid-[a-z0-9-]*(=["'][^"']*["'])?/g, '');

// 5. How It Works Section (how-section)
const howItWorksRegex = /<section className="how-section"[\s\S]*?<\/section>/;
const howItWorksMatch = htmlWithClassName.match(howItWorksRegex);
if (howItWorksMatch) {
    let jsx = convertToJSX(howItWorksMatch[0]);
    jsx = jsx.replace(/Rig/g, 'Duck CLI');
    const componentStr = `import React from 'react';\n\nconst RigHowItWorks = () => {\n  return (\n    ${jsx}\n  );\n};\n\nexport default RigHowItWorks;\n`;
    fs.writeFileSync('website/src/RigHowItWorks.jsx', componentStr);
}

// 6. Terminal Showcase Section (illust-features)
const terminalRegex = /<section className="illust-features"[\s\S]*?<\/section>/;
const terminalMatch = htmlWithClassName.match(terminalRegex);
if (terminalMatch) {
    let jsx = convertToJSX(terminalMatch[0]);
    jsx = jsx.replace(/rig/g, 'duck');
    jsx = jsx.replace(/Rig/g, 'Duck');
    const componentStr = `import React from 'react';\n\nconst RigTerminalSection = () => {\n  return (\n    ${jsx}\n  );\n};\n\nexport default RigTerminalSection;\n`;
    fs.writeFileSync('website/src/RigTerminalSection.jsx', componentStr);
}

console.log("Conversion complete for missing sections.");
