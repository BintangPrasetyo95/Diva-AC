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

const files = findFiles('resources/js/pages');
const untranslatedRegex = /<Label[^>]*>([^<{}]+)<\/Label>|<label[^>]*>([^<{}]+)<\/label>/gi;

files.forEach(f => {
    const content = fs.readFileSync(f, 'utf8');
    let m;
    let found = false;
    while ((m = untranslatedRegex.exec(content)) !== null) {
        const text = (m[1] || m[2]).trim();
        if (text.length > 2 && !/^[\W_]+$/.test(text)) {
            if (!found) {
                console.log('\n--- ' + path.relative(process.cwd(), f) + ' ---');
                found = true;
            }
            console.log(m[0].trim());
        }
    }
});
