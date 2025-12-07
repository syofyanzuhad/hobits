<p align='center'>
  <!-- <a href='https://github.com/syofyanzuhad/hobits'>
	  <img src='https://img.shields.io/endpoint?url=https%3A%2F%2Fhits.dwyl.com%2Fsyofyanzuhad%2Fhobits.json%3Fcolor%3Dgreen'>
	</a> -->
  <a target="_blank" href="https://github.com/syofyanzuhad/hobits">
    <img src="https://img.shields.io/github/last-commit/syofyanzuhad/hobits" />
  </a>
	<a href="https://github.com/syofyanzuhad/hobits/issues">
    <img alt="GitHub Issues or Pull Requests" src="https://img.shields.io/github/issues/syofyanzuhad/hobits">
  </a>
	<a href="https://github.com/syofyanzuhad/hobits/pulls">
		<img src="https://img.shields.io/github/issues-pr/syofyanzuhad/hobits" alt="Pull Requests Badge"/>
	</a>
  <a href="https://github.com/syofyanzuhad/hobits/graphs/contributors">
		<img alt="GitHub contributors" src="https://img.shields.io/github/contributors/syofyanzuhad/hobits?color=2b9348">
	</a>
  <a href='https://github.com/syofyanzuhad/hobits'>
		<img src='https://img.shields.io/github/forks/syofyanzuhad/hobits'>
	</a>
  <a href='https://github.com/syofyanzuhad/hobits'>
		<img src='https://img.shields.io/github/stars/syofyanzuhad/hobits'>
	</a>
  <a href='https://github.com/syofyanzuhad/hobits'>
    <img src="https://visitor-badge.laobi.icu/badge?page_id=syofyanzuhad.hobits" />
  </a>
</p>

# Hobits

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

## Star history

<a href="https://www.star-history.com/#syofyanzuhad/hobits&type=date&legend=top-left">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=syofyanzuhad/hobits&type=date&theme=dark&legend=top-left" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=syofyanzuhad/hobits&type=date&legend=top-left" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=syofyanzuhad/hobits&type=date&legend=top-left" />
 </picture>
</a>
