const fs = require('fs');
const path = require('path');

function findFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.resolve(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(findFiles(file));
        } else {
            if (file.endsWith('.tsx') && !file.includes('invoice.tsx') && !file.includes('use-language.tsx')) results.push(file);
        }
    });
    return results;
}

const files = findFiles('resources/js');
const jsxTextRegex = />\s*([a-zA-Z][^<{}]+[a-zA-Z\.])\s*</g;

console.log('Potential hardcoded texts in JSX:');
files.forEach(f => {
    const content = fs.readFileSync(f, 'utf8');
    let m;
    const matches = new Set();
    while ((m = jsxTextRegex.exec(content)) !== null) {
        const text = m[1].trim();
        // Ignore single characters, numbers, and common short symbols
        if (text.length > 2 && /[a-zA-Z]/.test(text)) {
            matches.add(text);
        }
    }
    if (matches.size > 0) {
        console.log('\n--- ' + path.relative(process.cwd(), f) + ' ---');
        matches.forEach(t => console.log('  ' + t));
    }
});
