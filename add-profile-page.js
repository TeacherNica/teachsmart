const fs = require('fs');
const path = require('path');
const indexPath = path.join(__dirname, 'index.html');

let html = fs.readFileSync(indexPath, 'utf8');

// ─── STEP 1: Make profile card clickable ───
const oldChip = `<div class="teacher-chip">
      <div class="teacher-av">👩‍🏫</div>        
      <div><div class="teacher-name">Teacher Nica</div><div class="teacher-sub">🇹🇭 Bangkok, Thai iland</div></div>`;

const newChip = `<div class="teacher-chip" onclick="nav('profile',this)" style="cursor:pointer;" title="View Profile">
      <div class="teacher-av" id="sidebar-avatar">👩‍🏫</div>
      <div><div class="teacher-name" id="sidebar-name">Teacher Nica</div><div class="teacher-sub" id="sidebar-location">🇹🇭 Bangkok, Thailand</div></div>`;

if (html.includes(oldChip)) {
  html = html.replace(oldChip, newChip);
  console.log('✓ Profile card made clickable');
} else {
  // Try a more flexible match
  html = html.replace(
    /(<div class="teacher-chip">[\s\S]*?<div class="teacher-av">)👩‍🏫(<\/div>[\s\S]*?<div class="teacher-name">)Teacher Nica(<\/div><div class="teacher-sub">)🇹🇭 Bangkok, Thai iland/,
    '<div class="teacher-chip" onclick="nav(\'profile\',this)" style="cursor:pointer;" title="View Profile">$1👩‍🏫$2<span id="sidebar-name">Teacher Nica</span>$3<span id="sidebar-location">🇹🇭 Bangkok, Thailand</span>'
  );
  console.log('✓ Profile card made clickable (flexible match)');
}

// ─── STEP 2: Add profile nav item to sidebar ───
html = html.replace(
  `<div class="nav-item" onclick="nav('settings',this)"><span class="nav-icon">⚙️</span>Settiings</div>`,
  `<div class="nav-item" onclick="nav('profile',this)"><span class="nav-icon">👤</span>My Profile</div>
  <div class="nav-item" onclick="nav('settings',this)"><span class="nav-icon">⚙️</span>Settings</div>`
);
console.log('✓ Profile nav item added');

// ─── STEP 3: Add profile page HTML ───
const profilePage = `
  <!-- PROFILE PAGE -->
  <div class="page" id="page-profile">
    <div style="max-width:600px;margin:0 auto;padding:24px 16px;">
      
      <!-- Profile Card -->
      <div style="background:linear-gradient(135deg,#A855F7,#6366F1);border-radius:20px;padding:32px 24px;color:#fff;text-align:center;margin-bottom:20px;position:relative;">
        <div id="profile-avatar-display" style="font-size:4rem;background:rgba(255,255,255,0.2);border-radius:50%;width:80px;height:80px;display:flex;align-items:center;justify-content:center;margin:0 auto 12px;cursor:pointer;" onclick="document.getElementById('avatar-picker').style.display='flex'" title="Change avatar">👩‍🏫</div>
        <div style="font-size:0.75rem;opacity:0.8;margin-bottom:12px;">Tap avatar to change</div>
        <div id="profile-name-display" style="font-size:1.6rem;font-weight:800;"></div>
        <div id="profile-role-display" style="font-size:0.9rem;opacity:0.85;margin-top:4px;"></div>
        <div id="profile-location-display" style="font-size:0.85rem;opacity:0.75;margin-top:4px;"></div>
      </div>

      <!-- Avatar Picker -->
      <div id="avatar-picker" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9999;align-items:center;justify-content:center;">
        <div style="background:#fff;border-radius:16px;padding:24px;max-width:360px;width:90%;">
          <div style="font-weight:700;margin-bottom:16px;font-size:1rem;">Choose Avatar</div>
          <div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center;">
            ${['👩‍🏫','👨‍🏫','👩','👨','🧑‍💻','👩‍💼','👨‍💼','🧑','👧','👦'].map(a => 
              `<div onclick="selectAvatar('${a}')" style="font-size:2rem;cursor:pointer;padding:8px;border-radius:10px;border:2px solid #e5e7eb;" onmouseover="this.style.borderColor='#A855F7'" onmouseout="this.style.borderColor='#e5e7eb'">${a}</div>`
            ).join('')}
          </div>
          <button onclick="document.getElementById('avatar-picker').style.display='none'" style="margin-top:16px;width:100%;padding:10px;border:none;background:#f3f4f6;border-radius:8px;cursor:pointer;font-weight:600;">Cancel</button>
        </div>
      </div>

      <!-- Edit Form -->
      <div style="background:#fff;border-radius:16px;padding:24px;box-shadow:0 2px 12px rgba(0,0,0,0.07);margin-bottom:16px;">
        <div style="font-weight:700;font-size:1rem;color:#374151;margin-bottom:16px;">✏️ Edit Profile</div>
        
        <div style="margin-bottom:14px;">
          <label style="font-size:0.82rem;font-weight:600;color:#6B7280;display:block;margin-bottom:6px;">Full Name</label>
          <input id="profile-name-input" type="text" placeholder="Your full name" style="width:100%;padding:10px 14px;border:1.5px solid #e5e7eb;border-radius:10px;font-size:0.95rem;box-sizing:border-box;outline:none;" onfocus="this.style.borderColor='#A855F7'" onblur="this.style.borderColor='#e5e7eb'">
        </div>

        <div style="margin-bottom:14px;">
          <label style="font-size:0.82rem;font-weight:600;color:#6B7280;display:block;margin-bottom:6px;">Role</label>
          <input id="profile-role-input" type="text" placeholder="e.g. English Teacher" style="width:100%;padding:10px 14px;border:1.5px solid #e5e7eb;border-radius:10px;font-size:0.95rem;box-sizing:border-box;outline:none;" onfocus="this.style.borderColor='#A855F7'" onblur="this.style.borderColor='#e5e7eb'">
        </div>

        <div style="margin-bottom:14px;">
          <label style="font-size:0.82rem;font-weight:600;color:#6B7280;display:block;margin-bottom:6px;">Location</label>
          <input id="profile-location-input" type="text" placeholder="e.g. Bangkok, Thailand" style="width:100%;padding:10px 14px;border:1.5px solid #e5e7eb;border-radius:10px;font-size:0.95rem;box-sizing:border-box;outline:none;" onfocus="this.style.borderColor='#A855F7'" onblur="this.style.borderColor='#e5e7eb'">
        </div>

        <div style="margin-bottom:20px;">
          <label style="font-size:0.82rem;font-weight:600;color:#6B7280;display:block;margin-bottom:6px;">Short Bio</label>
          <textarea id="profile-bio-input" placeholder="Tell your students a little about yourself..." rows="3" style="width:100%;padding:10px 14px;border:1.5px solid #e5e7eb;border-radius:10px;font-size:0.95rem;box-sizing:border-box;outline:none;resize:vertical;font-family:inherit;" onfocus="this.style.borderColor='#A855F7'" onblur="this.style.borderColor='#e5e7eb'"></textarea>
        </div>

        <button onclick="saveProfile()" style="width:100%;padding:12px;background:linear-gradient(135deg,#A855F7,#6366F1);color:#fff;border:none;border-radius:10px;font-size:1rem;font-weight:700;cursor:pointer;">💾 Save Profile</button>
        <div id="profile-save-msg" style="display:none;margin-top:12px;text-align:center;color:#22C55E;font-weight:600;font-size:0.9rem;">✅ Profile saved successfully!</div>
      </div>

      <!-- Stats -->
      <div style="background:#fff;border-radius:16px;padding:24px;box-shadow:0 2px 12px rgba(0,0,0,0.07);margin-bottom:16px;">
        <div style="font-weight:700;font-size:1rem;color:#374151;margin-bottom:16px;">📊 My Stats</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;text-align:center;">
          <div style="background:#F5F3FF;border-radius:12px;padding:16px;">
            <div style="font-size:1.6rem;font-weight:800;color:#A855F7;" id="stat-total-students">0</div>
            <div style="font-size:0.75rem;color:#6B7280;margin-top:4px;">Students</div>
          </div>
          <div style="background:#F0FDF4;border-radius:12px;padding:16px;">
            <div style="font-size:1.6rem;font-weight:800;color:#22C55E;" id="stat-low-pkg">0</div>
            <div style="font-size:0.75rem;color:#6B7280;margin-top:4px;">Low Package</div>
          </div>
          <div style="background:#EFF6FF;border-radius:12px;padding:16px;">
            <div style="font-size:1.6rem;font-weight:800;color:#3B82F6;" id="stat-korean">0</div>
            <div style="font-size:0.75rem;color:#6B7280;margin-top:4px;">Korean</div>
          </div>
        </div>
      </div>

      <!-- Settings -->
      <div style="background:#fff;border-radius:16px;padding:24px;box-shadow:0 2px 12px rgba(0,0,0,0.07);">
        <div style="font-weight:700;font-size:1rem;color:#374151;margin-bottom:16px;">⚙️ Settings</div>
        <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid #f3f4f6;">
          <div>
            <div style="font-weight:600;font-size:0.9rem;">Dark Mode</div>
            <div style="font-size:0.78rem;color:#9CA3AF;">Toggle dark/light theme</div>
          </div>
          <div id="dark-mode-toggle" onclick="toggleDarkMode()" style="width:44px;height:24px;background:#e5e7eb;border-radius:12px;cursor:pointer;position:relative;transition:background 0.3s;">
            <div id="dark-mode-knob" style="position:absolute;top:2px;left:2px;width:20px;height:20px;background:#fff;border-radius:50%;transition:left 0.3s;box-shadow:0 1px 4px rgba(0,0,0,0.2);"></div>
          </div>
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0;">
          <div>
            <div style="font-weight:600;font-size:0.9rem;">Logout</div>
            <div style="font-size:0.78rem;color:#9CA3AF;">Sign out of TeachSmart</div>
          </div>
          <button onclick="sessionStorage.removeItem('ts_auth');window.location.href='/login.html';" style="padding:8px 16px;background:#FEE2E2;color:#EF4444;border:none;border-radius:8px;font-weight:700;cursor:pointer;font-size:0.85rem;">Logout</button>
        </div>
      </div>

    </div>
  </div>
`;

// Insert profile page before the closing of the pages section
html = html.replace('<div id="schedule-modal"', profilePage + '\n  <div id="schedule-modal"');
console.log('✓ Profile page HTML added');

// ─── STEP 4: Add profile JS before </body> ───
const profileJS = `
<script>
// ─── PROFILE ───
function loadProfile() {
  var p = JSON.parse(localStorage.getItem('ts-profile') || '{}');
  var name = p.name || 'Teacher Nica';
  var role = p.role || 'English Teacher';
  var location = p.location || '🇹🇭 Bangkok, Thailand';
  var bio = p.bio || '';
  var avatar = p.avatar || '👩‍🏫';

  // Update profile page
  document.getElementById('profile-avatar-display').textContent = avatar;
  document.getElementById('profile-name-display').textContent = name;
  document.getElementById('profile-role-display').textContent = role;
  document.getElementById('profile-location-display').textContent = location;
  document.getElementById('profile-name-input').value = name;
  document.getElementById('profile-role-input').value = role;
  document.getElementById('profile-location-input').value = location;
  document.getElementById('profile-bio-input').value = bio;

  // Update sidebar
  var sidebarName = document.getElementById('sidebar-name');
  var sidebarLoc = document.getElementById('sidebar-location');
  var sidebarAv = document.getElementById('sidebar-avatar');
  if (sidebarName) sidebarName.textContent = name;
  if (sidebarLoc) sidebarLoc.textContent = location;
  if (sidebarAv) sidebarAv.textContent = avatar;

  // Update stats
  var allStudents = JSON.parse(localStorage.getItem('ts-students') || '[]');
  var statTotal = document.getElementById('stat-total-students');
  var statLow = document.getElementById('stat-low-pkg');
  var statKorean = document.getElementById('stat-korean');
  if (statTotal) statTotal.textContent = allStudents.length;
  if (statLow) statLow.textContent = allStudents.filter(function(s){ return s.classes <= 3; }).length;
  if (statKorean) statKorean.textContent = allStudents.filter(function(s){ return s.nat && s.nat.includes('Korean'); }).length;

  // Dark mode
  var dark = localStorage.getItem('ts-dark-mode') === 'true';
  if (dark) applyDarkMode(true);
}

function saveProfile() {
  var p = {
    name: document.getElementById('profile-name-input').value || 'Teacher Nica',
    role: document.getElementById('profile-role-input').value || 'English Teacher',
    location: document.getElementById('profile-location-input').value || '🇹🇭 Bangkok, Thailand',
    bio: document.getElementById('profile-bio-input').value || '',
    avatar: document.getElementById('profile-avatar-display').textContent
  };
  localStorage.setItem('ts-profile', JSON.stringify(p));
  loadProfile();
  var msg = document.getElementById('profile-save-msg');
  msg.style.display = 'block';
  setTimeout(function(){ msg.style.display = 'none'; }, 3000);
}

function selectAvatar(emoji) {
  document.getElementById('profile-avatar-display').textContent = emoji;
  document.getElementById('avatar-picker').style.display = 'none';
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
loadProfile();
</script>
`;

html = html.replace('</body>', profileJS + '\n</body>');
console.log('✓ Profile JS added');

fs.writeFileSync(indexPath, html, 'utf8');
console.log('\ndone: true — Profile system added successfully!');
