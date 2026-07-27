const fs = require('fs');
const path = require('path');

const languageHook = fs.readFileSync('resources/js/hooks/use-language.tsx', 'utf8');

const keys = [];
let inTranslations = false;
const lines = languageHook.split('\n');
for (const line of lines) {
    if (line.includes('export const translations: Translations = {')) {
        inTranslations = true;
        continue;
    }
    if (inTranslations && line.trim() === '};') {
        inTranslations = false;
    }
    if (inTranslations) {
        const m = line.match(/^\s*([a-zA-Z0-9_]+)\s*:/);
        if (m) {
            keys.push(m[1]);
        }
    }
}

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
const missingKeys = new Set();
const tRegex = /t\(['"]([a-zA-Z0-9_]+)['"]\)/g;

files.forEach(f => {
    const content = fs.readFileSync(f, 'utf8');
    let m;
    while ((m = tRegex.exec(content)) !== null) {
        if (!keys.includes(m[1])) {
            missingKeys.add(m[1] + ' in ' + path.relative(process.cwd(), f));
        }
    }
});

console.log('Missing translation keys in frontends (excluding invoice.tsx):');
if (missingKeys.size === 0) {
    console.log('None.');
} else {
    missingKeys.forEach(k => console.log(k));
}
