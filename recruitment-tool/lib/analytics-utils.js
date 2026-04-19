import { format } from 'date-fns'
import {
  getCurrentMonth,
  getCurrentDay,
  getCurrentYear,
  getPreviousMonth,
  getNextMonth,
  getPreviousDay,
  getNextDay,
  getPreviousYear,
  getNextYear
} from './data-processing'

export function getFormattedUpdateDate(lastUpdateDate) {
  if (!lastUpdateDate) return 'Never'

  const date = new Date(lastUpdateDate)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return 'Just now'
  if (diffMins === 1) return '1 min ago'
  if (diffMins < 60) return `${diffMins} mins ago`

  const diffHours = Math.floor(diffMins / 60)
  if (diffHours === 1) return '1 hour ago'
  if (diffHours < 24) return `${diffHours} hours ago`

  return format(date, 'MMM dd, HH:mm')
}

export function getOldestUserDate(users) {
  if (users.length === 0) return null
  const dates = users.map((user) => new Date(user.createdAt)).sort((a, b) => a - b)
  return dates[0]
}

export function getInitialDateRange(viewMode) {
  if (viewMode === 'daily') return getCurrentMonth()
  if (viewMode === 'hourly') return getCurrentDay()
  if (viewMode === 'monthly') return getCurrentYear()
  return getCurrentMonth()
}

export function getDateRangeLabel(viewMode, dateRange) {
  if (viewMode === 'daily') return format(dateRange.startDate, 'MMMM yyyy')
  if (viewMode === 'hourly') return format(dateRange.startDate, 'MMMM dd, yyyy')
  if (viewMode === 'monthly') return format(dateRange.startDate, 'yyyy')
  return ''
}

export function getPreviousLabel(viewMode, dateRange) {
  if (viewMode === 'daily') {
    const prev = getPreviousMonth(dateRange.startDate)
    return `< ${format(prev.startDate, 'MMMM')}`
  }

  if (viewMode === 'hourly') {
    const prev = getPreviousDay(dateRange.startDate)
    return `< ${format(prev.startDate, 'MMM dd')}`
  }

  if (viewMode === 'monthly') {
    const prev = getPreviousYear(dateRange.startDate)
    return `< ${format(prev.startDate, 'yyyy')}`
  }

  return ''
}

export function getNextLabel(viewMode, dateRange) {
  if (viewMode === 'daily') {
    const next = getNextMonth(dateRange.startDate)
    return `${format(next.startDate, 'MMMM')} >`
  }

  if (viewMode === 'hourly') {
    const next = getNextDay(dateRange.startDate)
    return `${format(next.startDate, 'MMM dd')} >`
  }

  if (viewMode === 'monthly') {
    const next = getNextYear(dateRange.startDate)
    return `${format(next.startDate, 'yyyy')} >`
  }

  return ''
}

export function getTodayLabel(viewMode) {
  if (viewMode === 'daily') return 'This Month'
  if (viewMode === 'hourly') return 'Today'
  if (viewMode === 'monthly') return 'This Year'
  return ''
}

export function canGoNext(dateRange) {
  const today = new Date()
  return dateRange.endDate < today
}

export function isAtCurrentPeriod(viewMode, dateRange) {
  if (viewMode === 'hourly') {
    const today = getCurrentDay()
    return dateRange.startDate.toDateString() === today.startDate.toDateString() && dateRange.endDate.toDateString() === today.endDate.toDateString()
  }

  if (viewMode === 'daily') {
    const thisMonth = getCurrentMonth()
    return dateRange.startDate.toDateString() === thisMonth.startDate.toDateString() && dateRange.endDate.toDateString() === thisMonth.endDate.toDateString()
  }

  if (viewMode === 'monthly') {
    const thisYear = getCurrentYear()
    return dateRange.startDate.toDateString() === thisYear.startDate.toDateString() && dateRange.endDate.toDateString() === thisYear.endDate.toDateString()
  }

  return false
}
