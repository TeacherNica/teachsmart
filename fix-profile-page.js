const fs = require('fs');
const path = require('path');
const indexPath = path.join(__dirname, 'index.html');

let html = fs.readFileSync(indexPath, 'utf8');

// Fix duplicate localStorage line
html = html.replace(
  `  localStorage.setItem('ts-last-page', page);    
  localStorage.setItem('ts-last-page', page);`,
  `  localStorage.setItem('ts-last-page', page);`
);
console.log('✓ Fixed duplicate localStorage line');

// Add profile render handler to nav function
html = html.replace(
  `if(page==='students')renderStudents();`,
  `if(page==='students')renderStudents();
  if(page==='profile')loadProfile();`
);
console.log('✓ Added profile render handler');

// Add profile page HTML before schedule-modal
if (!html.includes('page-profile')) {
  const profilePage = `
  <!-- PROFILE PAGE -->
  <div class="page" id="page-profile">
    <div style="max-width:600px;margin:0 auto;padding:24px 16px;">
      
      <!-- Profile Header Card -->
      <div style="background:linear-gradient(135deg,#A855F7,#6366F1);border-radius:20px;padding:32px 24px;color:#fff;text-align:center;margin-bottom:20px;">
        <div id="profile-avatar-display" onclick="document.getElementById('avatar-picker').style.display='flex'" style="font-size:4rem;background:rgba(255,255,255,0.2);border-radius:50%;width:80px;height:80px;display:flex;align-items:center;justify-content:center;margin:0 auto 8px;cursor:pointer;">👩‍🏫</div>
        <div style="font-size:0.75rem;opacity:0.8;margin-bottom:10px;">Tap avatar to change</div>
        <div id="profile-name-display" style="font-size:1.5rem;font-weight:800;">Teacher Nica</div>
        <div id="profile-role-display" style="font-size:0.9rem;opacity:0.85;margin-top:4px;">English Teacher</div>
        <div id="profile-location-display" style="font-size:0.85rem;opacity:0.75;margin-top:4px;">🇹🇭 Bangkok, Thailand</div>
      </div>

      <!-- Avatar Picker -->
      <div id="avatar-picker" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9999;align-items:center;justify-content:center;">
        <div style="background:#fff;border-radius:16px;padding:24px;max-width:360px;width:90%;">
          <div style="font-weight:700;margin-bottom:16px;">Choose Avatar</div>
          <div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center;">
            <div onclick="selectAvatar('👩‍🏫')" style="font-size:2rem;cursor:pointer;padding:8px;border-radius:10px;border:2px solid #e5e7eb;">👩‍🏫</div>
            <div onclick="selectAvatar('👨‍🏫')" style="font-size:2rem;cursor:pointer;padding:8px;border-radius:10px;border:2px solid #e5e7eb;">👨‍🏫</div>
            <div onclick="selectAvatar('👩')" style="font-size:2rem;cursor:pointer;padding:8px;border-radius:10px;border:2px solid #e5e7eb;">👩</div>
            <div onclick="selectAvatar('👨')" style="font-size:2rem;cursor:pointer;padding:8px;border-radius:10px;border:2px solid #e5e7eb;">👨</div>
            <div onclick="selectAvatar('🧑‍💻')" style="font-size:2rem;cursor:pointer;padding:8px;border-radius:10px;border:2px solid #e5e7eb;">🧑‍💻</div>
            <div onclick="selectAvatar('👩‍💼')" style="font-size:2rem;cursor:pointer;padding:8px;border-radius:10px;border:2px solid #e5e7eb;">👩‍💼</div>
          </div>
          <button onclick="document.getElementById('avatar-picker').style.display='none'" style="margin-top:16px;width:100%;padding:10px;border:none;background:#f3f4f6;border-radius:8px;cursor:pointer;font-weight:600;">Cancel</button>
        </div>
      </div>

      <!-- Edit Form -->
      <div style="background:#fff;border-radius:16px;padding:24px;box-shadow:0 2px 12px rgba(0,0,0,0.07);margin-bottom:16px;">
        <div style="font-weight:700;font-size:1rem;color:#374151;margin-bottom:16px;">✏️ Edit Profile</div>
        <div style="margin-bottom:14px;">
          <label style="font-size:0.82rem;font-weight:600;color:#6B7280;display:block;margin-bottom:6px;">Full Name</label>
          <input id="profile-name-input" type="text" placeholder="Your full name" style="width:100%;padding:10px 14px;border:1.5px solid #e5e7eb;border-radius:10px;font-size:0.95rem;box-sizing:border-box;">
        </div>
        <div style="margin-bottom:14px;">
          <label style="font-size:0.82rem;font-weight:600;color:#6B7280;display:block;margin-bottom:6px;">Role</label>
          <input id="profile-role-input" type="text" placeholder="e.g. English Teacher" style="width:100%;padding:10px 14px;border:1.5px solid #e5e7eb;border-radius:10px;font-size:0.95rem;box-sizing:border-box;">
        </div>
        <div style="margin-bottom:14px;">
          <label style="font-size:0.82rem;font-weight:600;color:#6B7280;display:block;margin-bottom:6px;">Location</label>
          <input id="profile-location-input" type="text" placeholder="e.g. Bangkok, Thailand" style="width:100%;padding:10px 14px;border:1.5px solid #e5e7eb;border-radius:10px;font-size:0.95rem;box-sizing:border-box;">
        </div>
        <div style="margin-bottom:20px;">
          <label style="font-size:0.82rem;font-weight:600;color:#6B7280;display:block;margin-bottom:6px;">Short Bio</label>
          <textarea id="profile-bio-input" placeholder="Tell your students a little about yourself..." rows="3" style="width:100%;padding:10px 14px;border:1.5px solid #e5e7eb;border-radius:10px;font-size:0.95rem;box-sizing:border-box;resize:vertical;font-family:inherit;"></textarea>
        </div>
        <button onclick="saveProfile()" style="width:100%;padding:12px;background:linear-gradient(135deg,#A855F7,#6366F1);color:#fff;border:none;border-radius:10px;font-size:1rem;font-weight:700;cursor:pointer;">💾 Save Profile</button>
        <div id="profile-save-msg" style="display:none;margin-top:12px;text-align:center;color:#22C55E;font-weight:600;">✅ Profile saved!</div>
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

  html = html.replace('<div id="schedule-modal"', profilePage + '\n  <div id="schedule-modal"');
  console.log('✓ Profile page HTML injected');
} else {
  console.log('⚠ Profile page already exists, skipping HTML injection');
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('\ndone: true');
