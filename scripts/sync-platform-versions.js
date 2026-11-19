import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const version = process.argv[2];
if (!version) {
  console.error('Error: Version argument is required.');
  process.exit(1);
}

const targets = [
  path.join(rootDir, 'client', 'package.json'),
  path.join(rootDir, 'server', 'package.json'),
];

for (const targetPath of targets) {
  if (fs.existsSync(targetPath)) {
    const pkg = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
    pkg.version = version;
    fs.writeFileSync(targetPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
    console.log(`[OK] Updated ${path.relative(rootDir, targetPath)} to version ${version}`);
  }
}
