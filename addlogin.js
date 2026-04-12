const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

// Find </head> and everything after it that's broken
const headEnd = h.indexOf('</head>');
const sidebarStart = h.indexOf('<!-- SIDEBAR -->');

// Keep everything up to </head>, then add clean body tag, then sidebar onwards
const fixed = h.substring(0, headEnd) + '</head>\n<body>\n<script>if(sessionStorage.getItem("ts_auth")!=="yes"){window.location.href="/login.html";}<\/script>\n' + h.substring(sidebarStart);

fs.writeFileSync('index.html', fixed, 'utf8');
console.log('body:', fixed.includes('<body>'));
console.log('sidebar:', fixed.includes('<!-- SIDEBAR -->'));