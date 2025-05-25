// fix-links.js (CommonJS)
const fs = require('fs');
const path = require('path');

const dir = 'frontend/out';


function updateLinks(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace href="/something" with href="/something.html", but skip already correct ones and files with extensions
  content = content.replace(/href="\/([^"]+)"/g, (match, path) => {
    if (
      path.endsWith('.html') ||
      path.includes('.') // skip .css, .js, images, etc.
    ) {
      return match; // do not change
    }
    return `href="/${path}.html"`; // append .html for route-like links
  });

  fs.writeFileSync(filePath, content);
}

// Loop through all HTML files in the output directory
fs.readdirSync(dir).forEach((file) => {
  const fullPath = path.join(dir, file);
  console.log(`Checking: ${fullPath}`);
  if (fs.statSync(fullPath).isFile() && file.endsWith('.html')) {
    updateLinks(fullPath);
  }
});