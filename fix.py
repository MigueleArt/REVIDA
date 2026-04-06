import sys

with open('backend/src/index.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(len(lines)):
    if 'evida_token=\;' in lines[i] or 'evida_token=;' in lines[i]:
        if 'Max-Age' in lines[i]:
            lines[i] = '          "Set-Cookie": evida_token=; HttpOnly; Path=/; Max-Age=3600; SameSite=None; Secure,\n'
        else:
            lines[i] = '      "Set-Cookie": evida_token=; HttpOnly; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=None; Secure,\n'

with open('backend/src/index.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
