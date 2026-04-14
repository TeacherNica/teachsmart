const fs = require('fs');
const path = require('path');
const indexPath = path.join(__dirname, 'index.html');

let html = fs.readFileSync(indexPath, 'utf8');

// Remove stats section from profile page
html = html.replace(
  /<!-- Stats -->[\s\S]*?<!-- Settings -->/,
  '<!-- Settings -->'
);
console.log('✓ Stats section removed');

// Inject profile JS before </body>
const profileJS = `
<script>
// ─── PROFILE FUNCTIONS ───
function loadProfile() {
  var p = JSON.parse(localStorage.getItem('ts-profile') || '{}');
  var name = p.name || 'Teacher Nica';
  var role = p.role || 'English Teacher';
  var location = p.location || 'Bangkok, Thailand';
  var bio = p.bio || '';
  var avatar = p.avatar || '👩‍🏫';
  var photo = p.photo || '';

  // Update profile header
  var avatarEl = document.getElementById('profile-avatar-display');
  if (avatarEl) {
    if (photo) {
      avatarEl.innerHTML = '<img src="' + photo + '" style="width:80px;height:80px;border-radius:50%;object-fit:cover;">';
    } else {
      avatarEl.textContent = avatar;
    }
  }

  var nameDisplay = document.getElementById('profile-name-display');
  var roleDisplay = document.getElementById('profile-role-display');
  var locDisplay = document.getElementById('profile-location-display');
  if (nameDisplay) nameDisplay.textContent = name;
  if (roleDisplay) roleDisplay.textContent = role;
  if (locDisplay) locDisplay.textContent = location;

  // Fill inputs
  var nameInput = document.getElementById('profile-name-input');
  var roleInput = document.getElementById('profile-role-input');
  var locInput = document.getElementById('profile-location-input');
  var bioInput = document.getElementById('profile-bio-input');
  if (nameInput) nameInput.value = name;
  if (roleInput) roleInput.value = role;
  if (locInput) locInput.value = location;
  if (bioInput) bioInput.value = bio;

  // Update sidebar
  var sidebarName = document.getElementById('sidebar-name');
  var sidebarLoc = document.getElementById('sidebar-location');
  var sidebarAv = document.getElementById('sidebar-avatar');
  if (sidebarName) sidebarName.textContent = name;
  if (sidebarLoc) sidebarLoc.textContent = location;
  if (sidebarAv) {
    if (photo) {
      sidebarAv.innerHTML = '<img src="' + photo + '" style="width:36px;height:36px;border-radius:10px;object-fit:cover;">';
    } else {
      sidebarAv.textContent = avatar;
    }
  }

  // Dark mode
  var dark = localStorage.getItem('ts-dark-mode') === 'true';
  if (dark) applyDarkMode(true);
}

function saveProfile() {
  var nameInput = document.getElementById('profile-name-input');
  var roleInput = document.getElementById('profile-role-input');
  var locInput = document.getElementById('profile-location-input');
  var bioInput = document.getElementById('profile-bio-input');
  var avatarEl = document.getElementById('profile-avatar-display');

  var existing = JSON.parse(localStorage.getItem('ts-profile') || '{}');

  var p = {
    name: nameInput ? nameInput.value || 'Teacher Nica' : 'Teacher Nica',
    role: roleInput ? roleInput.value || 'English Teacher' : 'English Teacher',
    location: locInput ? locInput.value || 'Bangkok, Thailand' : 'Bangkok, Thailand',
    bio: bioInput ? bioInput.value || '' : '',
    avatar: avatarEl ? (avatarEl.textContent || '👩‍🏫') : '👩‍🏫',
    photo: existing.photo || ''
  };

  localStorage.setItem('ts-profile', JSON.stringify(p));
  loadProfile();

  var msg = document.getElementById('profile-save-msg');
  if (msg) {
    msg.style.display = 'block';
    setTimeout(function(){ msg.style.display = 'none'; }, 3000);
  }
}

function selectAvatar(emoji) {
  var avatarEl = document.getElementById('profile-avatar-display');
  if (avatarEl) avatarEl.textContent = emoji;
  var picker = document.getElementById('avatar-picker');
  if (picker) picker.style.display = 'none';
}

function handlePhotoUpload(input) {
  var file = input.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    var photo = e.target.result;
    var existing = JSON.parse(localStorage.getItem('ts-profile') || '{}');
    existing.photo = photo;
    localStorage.setItem('ts-profile', JSON.stringify(existing));
    loadProfile();
  };
  reader.readAsDataURL(file);
}

function toggleDarkMode() {
  var isDark = localStorage.getItem('ts-dark-mode') === 'true';
  localStorage.setItem('ts-dark-mode', (!isDark).toString());
  applyDarkMode(!isDark);
}

function applyDarkMode(dark) {
  var toggle = document.getElementById('dark-mode-toggle');
  var knob = document.getElementById('dark-mode-knob');
  if (dark) {
    document.body.style.background = '#1a1a2e';
    document.body.style.color = '#e2e8f0';
    if (toggle) toggle.style.background = '#A855F7';
    if (knob) knob.style.left = '22px';
  } else {
    document.body.style.background = '';
    document.body.style.color = '';
    if (toggle) toggle.style.background = '#e5e7eb';
    if (knob) knob.style.left = '2px';
  }
}

// Load profile on init
setTimeout(function(){ loadProfile(); }, 100);
</script>
`;

// Add photo upload button to profile page
html = html.replace(
  '<div style="font-size:0.75rem;opacity:0.8;margin-bottom:10px;">Tap avatar to change</div>',
  '<div style="font-size:0.75rem;opacity:0.8;margin-bottom:6px;">Tap avatar to change</div>' +
  '<label style="display:inline-block;margin-bottom:10px;background:rgba(255,255,255,0.2);padding:4px 12px;border-radius:20px;cursor:pointer;font-size:0.78rem;">📷 Upload Photo<input type="file" accept="image/*" onchange="handlePhotoUpload(this)" style="display:none;"></label>'
);
console.log('✓ Photo upload button added');

html = html.replace('</body>', profileJS + '\n</body>');
fs.writeFileSync(indexPath, html, 'utf8');
console.log('✓ Profile JS functions injected');
console.log('\ndone: true');
