// fix-unescaped.js
const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, 'src');

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walkDir(filePath));
        } else if (filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
            results.push(filePath);
        }
    });
    return results;
}

function fixFile(filePath) {
    let code = fs.readFileSync(filePath, 'utf8');

    // Replace ' and " in JSX text nodes
    // This regex looks for text between > and < (simple heuristic)
    code = code.replace(/>([^<]+)</g, (match, p1) => {
        let fixed = p1
            .replace(/'/g, '&apos;')
            .replace(/"/g, '&quot;');
        return `>${fixed}<`;
    });

    fs.writeFileSync(filePath, code, 'utf8');
    console.log(`Fixed: ${filePath}`);
}

const files = walkDir(SRC_DIR);
files.forEach(fixFile);

console.log(`Processed ${files.length} files.`);
