import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

const template = read('src/template.html');
const styles = read('src/styles.css');
const scripts = [
    read('src/story.js'),
    read('src/audio.js'),
    read('src/minigames.js'),
    read('src/renderer.js'),
    read('src/main.js')
].join('\n\n');

const output = template
    .replace('{{STYLES}}', styles)
    .replace('{{SCRIPTS}}', scripts);

fs.writeFileSync(path.join(root, 'index.html'), output, 'utf8');
fs.writeFileSync(path.join(root, 'terarium_di_ujung_lorong.html'), output, 'utf8');

// Prepare www/ if building for Capacitor / Android
const wwwDir = path.join(root, 'www');
fs.mkdirSync(wwwDir, { recursive: true });
fs.copyFileSync(path.join(root, 'index.html'), path.join(wwwDir, 'index.html'));
fs.copyFileSync(path.join(root, 'manifest.webmanifest'), path.join(wwwDir, 'manifest.webmanifest'));
fs.copyFileSync(path.join(root, 'sw.js'), path.join(wwwDir, 'sw.js'));
fs.cpSync(path.join(root, 'icons'), path.join(wwwDir, 'icons'), { recursive: true });

console.log(`Built index.html & terarium_di_ujung_lorong.html (${output.length} bytes) + www/`);
