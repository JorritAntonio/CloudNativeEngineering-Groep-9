// fix-links.js (CommonJS)
const fs = require('fs');
const path = require('path');

const dir = 'frontend/out';


function updateLinks(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace href="/something" with href="/something.html", but skip already correct ones
  content = content.replace(/href="\/(?!.*\.html)([^"]+)"/g, 'href="/$1.html"');

  fs.writeFileSync(filePath, content);
}

// Loop through all HTML files in the output directory
fs.readdirSync(dir).forEach((file) => {
  console.log(`Checking: ${fullPath}`);
  const fullPath = path.join(dir, file);
  if (fs.statSync(fullPath).isFile() && file.endsWith('.html')) {
    updateLinks(fullPath);
  }
});