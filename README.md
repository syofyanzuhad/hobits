# Habit Tracker PWA

A Progressive Web App for tracking daily habits with offline support, built with Vue 3 and TypeScript.

## Features

- **Dashboard**: View all habits with 5-day completion grid
- **Detail Page**: Monthly calendar, 4-month heatmap, yearly chart, and notes
- **Offline-first**: All data stored locally in localStorage
- **PWA**: Installable on mobile and desktop
- **Dark Theme**: Modern dark UI design
- **Export/Import**: Backup and restore data as JSON

## Tech Stack

- Vue 3 (Composition API)
- TypeScript
- Vite
- Pinia (State Management)
- Vue Router
- vite-plugin-pwa

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd hobits

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
npm run preview  # Preview production build
```

## Project Structure

```
src/
├── components/
│   ├── dashboard/          # Dashboard components
│   │   ├── HabitTable.vue
│   │   ├── AddHabitModal.vue
│   │   └── DropdownMenu.vue
│   ├── detail/             # Detail page components
│   │   ├── MonthCalendar.vue
│   │   ├── HeatmapThreeMonths.vue
│   │   ├── YearChart.vue
│   │   ├── NotesSection.vue
│   │   └── EditHabitModal.vue
│   ├── ToastContainer.vue
│   └── ConfirmDialog.vue
├── composables/
│   └── usePWAInstall.ts    # PWA install prompt handling
├── router/
│   └── index.ts
├── stores/
│   ├── habitStore.ts       # Habit state management
│   └── toastStore.ts       # Toast notifications
├── utils/
│   ├── dateUtils.ts        # Date formatting helpers
│   ├── storageUtils.ts     # localStorage operations
│   └── types.ts            # TypeScript interfaces
├── views/
│   ├── HabitList.vue       # Dashboard view
│   └── HabitDetail.vue     # Detail view
├── App.vue
├── main.ts
└── style.css               # Global styles & CSS variables
```

## PWA Installation

### Desktop (Chrome/Edge)
1. Open the app in browser
2. Click the install icon in the address bar, or
3. Open menu (hamburger icon) and click "Install App"

### Android (Chrome)
1. Open the app in Chrome
2. Tap menu → "Add to Home screen" or "Install app"

### iOS (Safari)
1. Open the app in Safari
2. Tap Share icon → "Add to Home Screen"

## Data Storage

All habit data is stored in browser's localStorage under the key `habit-tracker-data`. Data structure:

```typescript
{
  habits: [
    {
      id: string,
      name: string,
      color: string,
      completions: { "YYYY-MM-DD": boolean },
      notes: string,
      createdAt: string,
      updatedAt: string
    }
  ],
  settings: {
    theme: "dark",
    firstDayOfWeek: 1
  }
}
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## License

MIT
