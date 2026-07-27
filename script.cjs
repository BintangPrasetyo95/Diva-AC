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
            if (file.endsWith('.tsx')) results.push(file);
        }
    });
    return results;
}

const files = findFiles('resources/js');
const jsxTextRegex = />\s*([^<{}]+)\s*</g;

files.forEach(f => {
    const content = fs.readFileSync(f, 'utf8');
    let m;
    while ((m = jsxTextRegex.exec(content)) !== null) {
        if (m[1].toLowerCase().includes('booking')) {
            console.log(path.relative(process.cwd(), f) + ': ' + m[1].trim());
        }
    }
});
