const fs = require('fs');
let lines = fs.readFileSync('backend/src/index.js', 'utf8').split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('evida_token=') || lines[i].includes('v_token=')) {
    if (lines[i].includes('max-age') || lines[i].includes('Max-Age')) {
      lines[i] = '          "Set-Cookie": `revida_token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=None; Secure`,';
    } else {
      lines[i] = '      "Set-Cookie": `revida_token=; HttpOnly; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=None; Secure`,';
    }
  }
}
fs.writeFileSync('backend/src/index.js', lines.join('\n'));
