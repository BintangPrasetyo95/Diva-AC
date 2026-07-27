const fs = require('fs');
const path = require('path');
function findFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.resolve(dir, file);
        if (fs.statSync(file).isDirectory()) results = results.concat(findFiles(file));
        else if (file.endsWith('.tsx')) results.push(file);
    });
    return results;
}
findFiles('resources/js/pages').forEach(f => {
    const content = fs.readFileSync(f, 'utf8');
    if (content.includes('<Label>{t(')) {
        console.log('Missing htmlFor in ' + path.relative(process.cwd(), f));
    }
});
