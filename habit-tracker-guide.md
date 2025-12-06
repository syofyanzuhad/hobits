# PWA Habit Tracker - Step-by-Step Prompt Guide

## 📱 Project Overview
Progressive Web App untuk tracking habits dengan fitur:
- **Dashboard**: List habits dengan 5 hari terakhir
- **Detail Page**: Calendar bulanan, heatmap 3 bulan, chart tahunan, notes
- **Local-first**: Semua data disimpan di localStorage
- **Dark Theme**: UI gelap modern

---

## 🎯 Tech Stack
- Vue 3 (Composition API)
- Vite
- Pinia (State Management)
- Vue Router
- PWA (offline-first)
- localStorage

---

## 📋 STEP-BY-STEP PROMPTS

### **STEP 1: Project Setup**

**Prompt:**
```
Buatkan setup project Vue 3 untuk PWA Habit Tracker dengan:
- Vite sebagai build tool
- Install Vue Router dan Pinia
- Install vite-plugin-pwa untuk PWA functionality
- Buat struktur folder: components (dashboard & detail), views, stores, utils, router
- Setup manifest.json dengan theme dark
- Konfigurasi vite.config.js untuk PWA dengan service worker
```

---

### **STEP 2: Data Structure & Storage Utils**

**Prompt:**
```
Buatkan utility functions untuk data management:

File: utils/storageUtils.js
- loadData(): ambil data dari localStorage
- saveData(data): simpan data ke localStorage
- exportData(): download data sebagai JSON file
- importData(file): import JSON file dan validate format

File: utils/dateUtils.js
- formatDate(date): format ke "YYYY-MM-DD"
- getLastNDays(n): return array n hari terakhir
- getDayName(dateString): return "Mon", "Tue", dst
- getMonthCalendar(year, month): return array weeks untuk calendar
- getMonthName(month): return nama bulan
- getLast12Months(): return 12 bulan terakhir untuk chart

Data Structure untuk Habit:
{
  id: string,
  name: string,
  color: string,
  completions: { "2025-12-01": true, "2025-12-02": false },
  notes: string,
  createdAt: string,
  updatedAt: string
}
```

---

### **STEP 3: Pinia Store**

**Prompt:**
```
Buatkan Pinia store untuk habits (stores/habitStore.js) dengan:

State:
- habits: array
- settings: { theme, firstDayOfWeek }

Getters:
- getHabitById(id): return habit by ID
- getHabitCompletionsByMonth(habitId, year, month): return completions untuk bulan tertentu
- getHabitStats(habitId): return { total, completed, streak, percentage }

Actions:
- loadFromStorage(): load dari localStorage saat app start
- saveToStorage(): save ke localStorage setiap perubahan
- addHabit(name): tambah habit baru
- deleteHabit(id): hapus habit
- updateHabit(id, updates): update habit properties
- toggleCompletion(habitId, date): toggle completion status
- setNotes(habitId, notes): update notes

Tambahkan helper function calculateStreak(completions) untuk hitung berapa hari berturut-turut.
```

---

### **STEP 4: Router Setup**

**Prompt:**
```
Setup Vue Router (router/index.js) dengan 2 routes:
- "/" → HabitList view (dashboard)
- "/habit/:id" → HabitDetail view (detail page dengan props: true)

Gunakan createWebHistory untuk clean URLs.
Tambahkan transition animation antar routes (optional).
```

---

### **STEP 5: Dashboard - Main View**

**Prompt:**
```
Buatkan view HabitList.vue (dashboard utama) dengan:

Template:
- Header: judul "Habits" + hamburger menu button (kanan atas)
- HabitTable component (passing habits & dates)
- DropdownMenu component (show/hide dengan v-if)
- AddHabitModal component (show/hide dengan v-if)

Script:
- Import habitStore dan gunakan computed untuk habits
- dates = getLastNDays(5) untuk 5 hari terakhir
- Toggle showMenu dan showAddModal
- Methods: toggleCompletion, addNewHabit, goToDetail (navigate ke detail page), exportData, handleImport
- onMounted: load data dari storage

Style:
- Dark theme: background #1a1a1a, text white
- Header flex dengan space-between
- Responsive untuk mobile
```

---

### **STEP 6: Dashboard - Habit Table Component**

**Prompt:**
```
Buatkan HabitTable.vue component dengan:

Props: habits (array), dates (array)
Emits: 'toggle', 'click-habit'

Template:
- Table header: kosong di kiri, lalu 5 kolom tanggal (hari + nomor tanggal)
- Habit rows: nama habit + 5 cell completion
- Setiap cell: tampilkan ✓ (green) jika completed, ✗ (gray) jika tidak
- Klik row habit → emit 'click-habit' untuk navigate ke detail
- Klik cell completion → emit 'toggle' (dengan stop propagation)
- Empty state jika belum ada habits

Style:
- Grid layout: 1fr untuk nama, 60px untuk setiap kolom tanggal
- Hover effect pada row (background lighter)
- Hover effect pada cell (scale transform)
- Border bottom untuk setiap row
```

---

### **STEP 7: Dashboard - Add Habit Modal**

**Prompt:**
```
Buatkan AddHabitModal.vue component dengan:

Emits: 'close', 'save'

Template:
- Modal overlay (full screen, semi-transparent)
- Modal content: judul "Add New Habit", input text, 2 buttons (Cancel & Save)
- Input auto-focus saat modal terbuka
- Enter key untuk save

Script:
- habitName reactive state
- save(): emit 'save' dengan habitName jika tidak kosong
- Disable save button jika input kosong

Style:
- Overlay: rgba(0,0,0,0.8) dengan flex center
- Content: background #2a2a2a, padding 2rem, border-radius
- Input: full width, dark background, border, focus state
- Buttons: Cancel (gray), Save (blue, disabled state)
```

---

### **STEP 8: Dashboard - Dropdown Menu**

**Prompt:**
```
Buatkan DropdownMenu.vue component dengan:

Emits: 'close', 'add', 'export', 'import'

Template:
- Overlay untuk close saat click outside
- Menu positioned absolute (top-right corner)
- 4 menu items: Add, Export, Import, Logout
- Hidden file input untuk import

Script:
- handleImport: trigger file input click
- onFileChange: emit 'import' dengan file

Style:
- Fixed position di kanan atas (60px dari top)
- Background #2a2a2a, border-radius, shadow
- Menu items: full width, hover effect
```

---

### **STEP 9: Detail Page - Main View**

**Prompt:**
```
Buatkan view HabitDetail.vue dengan:

Template:
- Header: back button (←) + habit name + edit button + menu button
- MonthCalendar component
- HeatmapThreeMonths component
- YearChart component
- NotesSection component
- EditHabitModal (conditional)
- DropdownMenu (conditional)
- Not found message jika habit tidak ditemukan

Script:
- Get habitId dari route.params
- computed habit dari store
- currentYear & currentMonth untuk calendar navigation
- Methods: goBack, prevMonth, nextMonth, toggleDay, updateNotes, updateHabitName, deleteHabit
- Konfirmasi sebelum delete

Style:
- Dark theme konsisten
- Header flex dengan gap
- Back button di kiri, title di tengah, actions di kanan
```

---

### **STEP 10: Detail - Month Calendar Component**

**Prompt:**
```
Buatkan MonthCalendar.vue component dengan:

Props: habit, year, month
Emits: 'prev-month', 'next-month', 'toggle'

Template:
- Navigation: ← button, "December 2025" text, → button
- Day headers: Mon, Tue, Wed, Thu, Fri, Sat, Sun
- Calendar grid: 7 kolom, multiple rows
- Setiap cell: nomor tanggal, highlight jika completed (blue background)
- Highlight hari ini dengan border/outline
- Empty cells untuk hari di luar bulan

Script:
- Gunakan getMonthCalendar(year, month) untuk generate calendar
- formatDate untuk membuat dateString
- isCompleted: cek habit.completions[dateString]
- isToday: compare dengan hari ini
- Klik cell untuk toggle completion

Style:
- Grid 7 kolom equal width
- Cells: square aspect ratio, center text
- Completed: background blue/green
- Today: border atau outline khusus
- Hover effect pada clickable cells
```

---

### **STEP 11: Detail - Heatmap Three Months**

**Prompt:**
```
Buatkan HeatmapThreeMonths.vue component dengan:

Props: habit

Template:
- Judul: "Last 3 Months"
- Grid heatmap: 4 bulan (Aug, Sep, Oct, Nov, Dec di contoh)
- Label bulan di atas
- Label hari (Mon, Tue, Wed, dst) di kiri
- Setiap cell kecil mewakili 1 hari
- Warna intensity berdasarkan completion (darker = completed)

Script:
- Generate data untuk 4 bulan terakhir
- Loop through setiap hari dalam bulan
- Map completion status ke color intensity
- Format grid: 7 rows (days) x N columns (days in months)

Style:
- Compact grid dengan cells kecil (10-15px)
- Color scale: #2a2a2a (not completed) → #3b82f6 (completed)
- Tooltip on hover (optional): tanggal + status
- Responsive: scroll horizontal jika perlu
```

---

### **STEP 12: Detail - Year Chart Component**

**Prompt:**
```
Buatkan YearChart.vue component dengan:

Props: habit

Template:
- Judul: "Last Year"
- Canvas atau SVG untuk chart
- X-axis: bulan (Jan, Feb, Mar, ... Dec)
- Y-axis: jumlah completions (0-31)
- Line chart dengan dots pada setiap bulan
- Grid lines untuk readability

Script:
- getLast12Months() untuk get months array
- Loop months, count completions per month dari habit.completions
- Calculate max value untuk Y-axis scale
- Draw line chart (gunakan Canvas API atau library seperti Chart.js)

Style:
- Height: 200-300px
- Dark theme: grid lines dark gray, line blue/green
- Dots pada intersections
- Labels: white text
- Responsive width
```

**Alternative dengan Chart.js:**
```
Atau gunakan Chart.js library:
- Install chart.js
- Setup LineChart dengan config dark theme
- Data: array jumlah completions per bulan
- Options: responsive, maintainAspectRatio false, dark colors
```

---

### **STEP 13: Detail - Notes Section**

**Prompt:**
```
Buatkan NotesSection.vue component dengan:

Props: notes (string)
Emits: 'update'

Template:
- Header "Notes" dengan collapse button (... atau ▼)
- Textarea untuk input notes (collapsible)
- Auto-resize textarea berdasarkan content
- Character count (optional)

Script:
- localNotes: copy dari props saat mount
- debounce function untuk auto-save (500ms delay)
- Emit 'update' saat user stop typing
- Toggle expanded/collapsed state

Style:
- Textarea: full width, min-height, dark background
- Border: subtle, focus state
- Padding dan spacing yang nyaman
- Collapsed: hanya tampilkan preview 2 baris
```

---

### **STEP 14: Detail - Edit Habit Modal**

**Prompt:**
```
Buatkan EditHabitModal.vue component dengan:

Props: habit
Emits: 'close', 'save'

Template:
- Modal overlay
- Modal content: "Edit Habit" title
- Input untuk rename habit (pre-filled dengan habit.name)
- Color picker untuk habit color (optional)
- Delete button (merah, di bawah) dengan konfirmasi
- Action buttons: Cancel & Save

Script:
- habitName dan habitColor reactive states (initialized dari props)
- save(): emit 'save' dengan new name
- Validate: name tidak boleh kosong

Style:
- Similar dengan AddHabitModal
- Delete button: red background, full width
- Konfirmasi delete sebelum action
```

---

### **STEP 15: PWA Configuration**

**Prompt:**
```
Konfigurasi PWA dengan vite-plugin-pwa:

vite.config.js:
- registerType: 'autoUpdate'
- workbox strategies: NetworkFirst untuk API, CacheFirst untuk assets
- manifest: name, short_name, description, theme_color (#1a1a1a), background_color, icons (192x192 & 512x512)

public/manifest.json:
- name: "Habit Tracker"
- short_name: "Habits"
- start_url: "/"
- display: "standalone"
- orientation: "portrait"
- theme_color: "#1a1a1a"
- icons: array dengan src, sizes, type

Buat icons:
- 192x192 dan 512x512 PNG
- Simple icon design (checkbox atau checkmark)
- Background color matching theme
```

---

### **STEP 16: Service Worker & Offline**

**Prompt:**
```
Implementasi offline functionality:

- Service worker otomatis generated oleh vite-plugin-pwa
- Caching strategy: Cache-First untuk app shell, Network-First untuk data
- Offline fallback: tampilkan message jika offline dan ada network error
- Install prompt: tampilkan banner untuk "Add to Home Screen"
- Update notification: tampilkan toast saat ada update tersedia

Tambahkan di App.vue:
- Check online/offline status
- Display offline indicator
- Handle service worker updates
```

---

### **STEP 17: Styling & Theme**

**Prompt:**
```
Polish styling dengan:

Global styles (main.css atau App.vue):
- Reset CSS
- Dark theme variables: --bg-primary (#1a1a1a), --bg-secondary (#2a2a2a), --text-primary (#fff), --text-secondary (#888), --accent (#3b82f6)
- Font family: system fonts atau Google Fonts
- Base font size: 16px, line-height 1.5
- Smooth scrolling

Responsive breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

Animations:
- Transitions: 0.2s ease untuk hover, 0.3s untuk modals
- Fade in/out untuk modals
- Slide transition untuk route changes
- Scale on hover untuk interactive elements

Touch-friendly:
- Button min-height: 44px
- Touch targets min 44x44px
- Spacing yang cukup antar elements
```

---

### **STEP 18: Error Handling & Validation**

**Prompt:**
```
Tambahkan error handling:

Storage errors:
- Try-catch pada semua localStorage operations
- Fallback jika localStorage full atau disabled
- Show error message ke user

Validation:
- Habit name tidak boleh kosong
- Import JSON validate structure
- Date format validation

User feedback:
- Toast notifications untuk success/error
- Loading states untuk async operations
- Confirmation dialogs untuk destructive actions
- Disable buttons saat processing
```

---

### **STEP 19: Testing & Optimization**

**Prompt:**
```
Test dan optimize:

Functionality testing:
- Test add/delete habits
- Test toggle completions
- Test calendar navigation
- Test export/import
- Test offline mode
- Test di berbagai browsers

Performance:
- Lazy load routes
- Debounce auto-save functions
- Optimize re-renders dengan computed
- Bundle size analysis
- Lighthouse audit

Accessibility:
- Keyboard navigation
- Focus management
- ARIA labels
- Color contrast (dark theme)
- Screen reader testing
```

---

### **STEP 20: Deployment**

**Prompt:**
```
Deploy PWA:

Build:
- npm run build
- Check dist folder

Deploy options:
1. Netlify: drag & drop dist folder
2. Vercel: connect GitHub repo
3. GitHub Pages: gh-pages branch
4. Firebase Hosting: firebase deploy

Post-deployment:
- Test PWA install pada mobile
- Test offline functionality
- Test service worker updates
- Verify manifest.json loads correctly
- Check all icons load properly
- Test on real devices (Android & iOS)

HTTPS required:
- PWA hanya berfungsi pada HTTPS
- Localhost OK untuk development
```

---

## 🎯 Summary: Complete Flow

1. **Setup** → Project structure & dependencies
2. **Data** → Storage utils & date helpers  
3. **Store** → Pinia state management
4. **Router** → 2 routes (list & detail)
5. **Dashboard** → List view + table + modals
6. **Detail** → Calendar + heatmap + chart + notes
7. **PWA** → Manifest + service worker + offline
8. **Polish** → Styling + animations + UX
9. **Test** → Functionality + performance + A11y
10. **Deploy** → Build + hosting + verification

---

## 💡 Tips untuk Development

- **Mulai dari simple**: Dashboard dulu, baru detail page
- **Test incremental**: Test setiap component sebelum lanjut
- **Mobile-first**: Design untuk mobile, scale up ke desktop
- **Console errors**: Fix semua warnings/errors di console
- **localStorage limit**: Aware of 5-10MB limit
- **Date timezone**: Gunakan UTC atau local timezone konsisten
- **Git commits**: Commit setelah setiap step selesai

---

## 🚀 Ready to Code!

Gunakan prompt ini step-by-step untuk membangun aplikasi. Setiap step bisa di-copy paste ke AI assistant untuk generate code yang specific.

**Pro tip**: Jika stuck di step tertentu, minta AI untuk:
- "Jelaskan lebih detail step X"
- "Berikan contoh code untuk step X"
- "Ada alternative approach untuk step X?"