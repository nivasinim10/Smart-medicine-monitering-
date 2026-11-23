const { spawn } = require('node:child_process');
const path = require('node:path');
const children = [];
for (const name of ['backend', 'frontend']) {
  const child = spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'dev'], {
    cwd: path.join(__dirname, '..', name), stdio: 'inherit', shell: process.platform === 'win32'
  });
  children.push(child);
  child.on('error', err => console.error(`${name} failed to launch:`, err.message));
}
function shutdown() { for (const child of children) if (!child.killed) child.kill(); }
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
