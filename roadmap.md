# 📚 TeachSmart Roadmap

> **App:** teachsmart-two.vercel.app  
> **Teacher:** Teacher Nica  
> **Stack:** Single file `index.html` · localStorage · Vercel · GitHub  
> **Last Updated:** April 2026

---

## ✅ COMPLETED FEATURES

### 🔐 Auth & Navigation
- [x] Login system with password protection
- [x] Logout button
- [x] Page remembers last visited tab on refresh
- [x] Dark mode toggle

### 👨‍🎓 Students Tab
- [x] 21 students (7 Korean + 14 Chinese) with correct packages
- [x] Student packages persist in localStorage
- [x] Add, Deduct, Delete per student card
- [x] Clickable duration toggle (25/50 min)
- [x] Clickable level badge (cycles Beginner/Intermediate/Advanced)
- [x] Set Package popup on student cards
- [x] Students sorted A-Z
- [x] Double-click student name → quick rename popup
- [x] Low Package filter (≤3 classes left)
- [x] Low Package modal with WeChat-ready message
- [x] Dashboard low package counter
- [x] WeChat message with time-based greeting

### 👤 Student Profile Modal
- [x] Click student name/avatar → opens profile modal
- [x] Attendance History tab (date, time, status)
- [x] Edit Info tab
- [x] 3 statuses: ✅ Present (deducts), 🔔 Absent (no deduct), 🚫 No Show (deducts)
- [x] Duplicate attendance guard (warns before marking same student twice in one day)

### 📅 Schedule Tab
- [x] Weekly schedule grid with pastel colors + flags
- [x] Thai Time + China Time columns
- [x] Morning/Evening sections
- [x] Clickable Close/Available slots → assign/move/remove students
- [x] Schedule student name click → opens slot editor modal
- [x] Class Notes & Makeup Classes section
- [x] Add makeup note with student, date, time, reason
- [x] Mark makeup note as Done
- [x] Delete makeup note

### 📊 Dashboard
- [x] Active students count
- [x] Classes today count
- [x] Low packages counter
- [x] This month earnings
- [x] Today's schedule with attendance buttons
- [x] Navigate between days (◀ Today ▶)
- [x] Alerts sidebar (low packages, birthdays, holidays)
- [x] Live exchange rate widget (CNY → PHP via frankfurter.app)
- [x] World clock (Thailand, China, Philippines, Korea)
- [x] Schedule syncs with dashboard automatically

### 💰 Payments Tab
- [x] Add payment records
- [x] Edit ✏️ and Delete 🗑️ buttons on every record
- [x] Filter by status and month
- [x] Grouped by month with month header + total
- [x] Vouchers sorted by date descending within each month
- [x] Student name editable in Edit Payment modal
- [x] 14 vouchers bulk imported (Jan–Apr 2026)

### 💵 Earnings Tab
- [x] Earned This Month stat
- [x] Total Unpaid stat
- [x] All Time Earned stat
- [x] Monthly breakdown cards (voucher count + total earned)

### 📈 Progress Reports Tab
- [x] Student progress with skill bars
- [x] Per-student skill tracking

### 👩‍🏫 Teacher Profile
- [x] Photo, name, role, location, bio
- [x] Editable profile

### 🎓 Student Portal (student.html)
- [x] Separate login page for students
- [x] PIN: `student2026`
- [x] Auto-detect language (Chinese 🇨🇳 / Korean 🇰🇷 / English)
- [x] Shows remaining classes with progress bar
- [x] Birthday countdown (within 30 days)
- [x] Teacher's message/homework
- [x] Weekly schedule
- [x] Attendance history (last 10 classes)
- [x] Skill progress bars
- [x] Motivational quote of the day
- [x] Low package warning
- [x] Auto logout after 30 minutes
- [x] Read-only (students cannot edit anything)

### ⚙️ Technical
- [x] Auto-save every 30 seconds via saveData()
- [x] Health check script (health_check.js)
- [x] Git version control + Vercel auto-deploy
- [x] Page refresh bug fixed (all tabs load correctly)

---

## 🔧 IN PROGRESS

- [ ] Present/Absent buttons showing on future days (bug fix)
- [ ] Schedule → Dashboard full sync for all days

---

## 📋 TO DO — HIGH PRIORITY

### 🗄️ Supabase Migration
- [ ] Set up Supabase project
- [ ] Migrate students data
- [ ] Migrate payments data
- [ ] Migrate attendance data
- [ ] Migrate progress reports
- [ ] Replace all localStorage calls with Supabase
- [ ] Test all tabs after migration

### 📁 Materials Tab
- [ ] Upload/store teaching materials
- [ ] Organize by student or topic
- [ ] Link materials to students

### 🎥 Live Classroom Tab
- [ ] Show today's schedule
- [ ] Start Class button → opens Tencent Meeting link
- [ ] Class timer (25/50 min)
- [ ] Per-student Tencent Meeting link storage

### 📋 Absence Log Tab
- [ ] Log teacher absences
- [ ] Log student absences
- [ ] Reschedule tracking

---

## 💡 TO DO — FUTURE IDEAS

### Student Experience
- [ ] Individual student PIN (instead of shared `student2026`)
- [ ] Homework/notes per student visible in portal
- [ ] Auto WeChat reminder when package hits 3 classes left
- [ ] Mobile-friendly improvements to student portal

### Business/Admin
- [ ] Invoice generator per student
- [ ] Monthly earnings report (exportable)
- [ ] Holiday blocker on schedule
- [ ] Data export to CSV/JSON backup

### Schedule
- [ ] Class reminder alert 15 mins before class
- [ ] Reschedule request logging

### Technical
- [ ] Better security (stronger login)
- [ ] Multi-device support (via Supabase)

---

## 📝 NOTES

- Always use regular Chrome (never incognito) — localStorage is browser-specific
- Data saves automatically every 30 seconds
- Run `node health_check.js` at start of each session
- Revert if something breaks: `git revert HEAD --no-edit` then `git push`
- Scripts with backtick template literals break in PowerShell — always save as .js files
- **Supabase should only be set up AFTER all tabs are complete**

---

## 👩‍🎓 STUDENT LIST (21 students)

| Name | Package | Nationality |
|------|---------|-------------|
| K.Bella | 46/54 | Korean |
| Jackie | 41/52 | Korean |
| Lina | 6/30 | Korean |
| Aiden | 5/25 | Korean |
| Sophia | 6/27 | Korean |
| Peter | 23/52 | Korean |
| Seah | 10/52 | Korean |
| Suri | 13/30 | Chinese |
| Bella | 10/32 | Chinese |
| COCO-1 | 2/20 | Chinese |
| Harry | 2/27 | Chinese |
| Kelly-Adult | 11/11 | Chinese |
| KAREN | 18/20 | Chinese |
| Mollie-Adult & Steven | 32/52 | Chinese (shared) |
| Coco-2 | 22/27 | Chinese |
| Koala | 26/30 | Chinese |
| Owen | 22/27 | Chinese |
| Rainy | 20/27 | Chinese |
| Carl | 3/30 | Chinese |
| Shily | 25/27 | Chinese |
| Allen | New | Chinese |
