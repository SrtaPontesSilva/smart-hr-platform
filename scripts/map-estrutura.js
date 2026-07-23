// scripts/map-estrutura.js

const fs = require('fs');
const path = require('path');

const SRC = path.join(process.cwd(), 'src');
const OUTPUT = path.join(process.cwd(), 'docs', 'estrutura.txt');

function walk(dir, prefix = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  return entries
    .filter(e => !['.DS_Store', 'node_modules'].includes(e.name))
    .map(entry => {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.relative(SRC, fullPath);
      const displayPath = `${prefix}${entry.name}`;

      if (entry.isDirectory()) {
        const children = walk(fullPath, `${prefix}${entry.name}/`);
        return [`📁 ${displayPath}/`, ...children];
      } else {
        return [`📄 ${displayPath}`];
      }
    })
    .flat();
}

// Garante que a pasta docs/ exista
const docsPath = path.join(process.cwd(), 'docs');
if (!fs.existsSync(docsPath)) fs.mkdirSync(docsPath);

const output = walk(SRC);
fs.writeFileSync(OUTPUT, output.join('\n'), 'utf8');

console.log(`✅ Estrutura essencial gerada em: ${OUTPUT}`);
