export function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getLastNDays(n: number): string[] {
  const dates: string[] = []
  const today = new Date()

  for (let i = n - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    dates.push(formatDate(date))
  }

  return dates
}

export function getDayName(dateString: string): string {
  const date = new Date(dateString)
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  return days[date.getDay()] ?? 'Sun'
}

export function getDayNumber(dateString: string): number {
  const date = new Date(dateString)
  return date.getDate()
}

export interface CalendarWeek {
  days: (number | null)[]
  dates: (string | null)[]
}

export function getMonthCalendar(year: number, month: number): CalendarWeek[] {
  const weeks: CalendarWeek[] = []
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()

  // Adjust for Monday start (0 = Monday, 6 = Sunday)
  let startDayIndex = firstDay.getDay() - 1
  if (startDayIndex < 0) startDayIndex = 6

  let currentWeek: CalendarWeek = { days: [], dates: [] }

  // Fill empty days at start
  for (let i = 0; i < startDayIndex; i++) {
    currentWeek.days.push(null)
    currentWeek.dates.push(null)
  }

  // Fill days of month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    currentWeek.days.push(day)
    currentWeek.dates.push(formatDate(date))

    if (currentWeek.days.length === 7) {
      weeks.push(currentWeek)
      currentWeek = { days: [], dates: [] }
    }
  }

  // Fill remaining days
  if (currentWeek.days.length > 0) {
    while (currentWeek.days.length < 7) {
      currentWeek.days.push(null)
      currentWeek.dates.push(null)
    }
    weeks.push(currentWeek)
  }

  return weeks
}

export function getMonthName(month: number): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  return months[month] ?? 'January'
}

export function getShortMonthName(month: number): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return months[month] ?? 'Jan'
}

export interface MonthYear {
  month: number
  year: number
  label: string
}

export function getLast12Months(): MonthYear[] {
  const months: MonthYear[] = []
  const today = new Date()

  for (let i = 11; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1)
    months.push({
      month: date.getMonth(),
      year: date.getFullYear(),
      label: getShortMonthName(date.getMonth())
    })
  }

  return months
}

export function isToday(dateString: string): boolean {
  return dateString === formatDate(new Date())
}

export function getLastNMonths(n: number): MonthYear[] {
  const months: MonthYear[] = []
  const today = new Date()

  for (let i = n - 1; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1)
    months.push({
      month: date.getMonth(),
      year: date.getFullYear(),
      label: getShortMonthName(date.getMonth())
    })
  }

  return months
}
