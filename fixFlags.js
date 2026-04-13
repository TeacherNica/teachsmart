const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const old1 = "flag:'\uD83C\uDDF0\uD83C\uDDF7'";
const old2 = "flag:'\uD83C\uDDE8\uD83C\uDDF3'";
html = html.replace(/flag:'🇰🇷'/g, "flag:'<img src=https://flagcdn.com/16x12/kr.png style=vertical-align:middle;margin-right:3px;>'");
html = html.replace(/flag:'🇨🇳'/g, "flag:'<img src=https://flagcdn.com/16x12/cn.png style=vertical-align:middle;margin-right:3px;>'");
html = html.replace("meta.flag?meta.flag+' ':''", "meta.flag?meta.flag:''");
fs.writeFileSync('index.html', html, 'utf8');
console.log('done: true');
