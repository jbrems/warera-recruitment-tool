import { format, startOfDay, startOfHour, subDays, subHours, endOfDay, startOfMonth, endOfMonth, addMonths, subMonths, addDays, addHours, startOfYear, endOfYear } from 'date-fns'

export const groupUsersByDay = (users, startDate, endDate) => {
  const groups = {}

  users.forEach(user => {
    const createdAt = new Date(user.createdAt)
    if (createdAt >= startDate && createdAt <= endDate) {
      const dayKey = format(startOfDay(createdAt), 'yyyy-MM-dd')
      groups[dayKey] = (groups[dayKey] || 0) + 1
    }
  })

  const result = []
  let currentDate = startOfDay(startDate)
  while (currentDate <= endDate) {
    const dayKey = format(currentDate, 'yyyy-MM-dd')
    result.push({
      date: dayKey,
      displayDate: format(currentDate, 'MMM dd'),
      count: groups[dayKey] || 0,
      timestamp: currentDate.getTime()
    })
    currentDate = addDays(currentDate, 1)
  }

  return result
}

export const groupUsersByHour = (users, startDate, endDate) => {
  const groups = {}

  users.forEach(user => {
    const createdAt = new Date(user.createdAt)
    if (createdAt >= startDate && createdAt <= endDate) {
      const hourKey = format(startOfHour(createdAt), 'yyyy-MM-dd HH:00')
      groups[hourKey] = (groups[hourKey] || 0) + 1
    }
  })

  const result = []
  let currentHour = startOfHour(startDate)
  while (currentHour <= endDate) {
    const hourKey = format(currentHour, 'yyyy-MM-dd HH:00')
    result.push({
      date: hourKey,
      displayDate: format(currentHour, 'HH:00'),
      count: groups[hourKey] || 0,
      timestamp: currentHour.getTime()
    })
    currentHour = addHours(currentHour, 1)
  }

  return result
}

// Monthly Navigation
export const getCurrentMonth = () => {
  const now = new Date()
  return {
    startDate: startOfMonth(now),
    endDate: endOfMonth(now)
  }
}

export const getPreviousMonth = (currentStart) => {
  const prev = subMonths(currentStart, 1)
  return {
    startDate: startOfMonth(prev),
    endDate: endOfMonth(prev)
  }
}

export const getNextMonth = (currentStart) => {
  const next = addMonths(currentStart, 1)
  return {
    startDate: startOfMonth(next),
    endDate: endOfMonth(next)
  }
}

// Daily Navigation (for hourly view)
export const getCurrentDay = () => {
  const now = new Date()
  return {
    startDate: startOfDay(now),
    endDate: endOfDay(now)
  }
}

export const getPreviousDay = (currentStart) => {
  const prev = subDays(startOfDay(currentStart), 1)
  return {
    startDate: startOfDay(prev),
    endDate: endOfDay(prev)
  }
}

export const getNextDay = (currentStart) => {
  const next = addDays(startOfDay(currentStart), 1)
  return {
    startDate: startOfDay(next),
    endDate: endOfDay(next)
  }
}

export const getLast31Days = () => {
  const endDate = endOfDay(new Date())
  const startDate = startOfDay(subDays(new Date(), 30))
  return { startDate, endDate }
}

export const groupUsersByMonth = (users, startDate, endDate) => {
  const groups = {}

  users.forEach(user => {
    const createdAt = new Date(user.createdAt)
    if (createdAt >= startDate && createdAt <= endDate) {
      const monthKey = format(startOfMonth(createdAt), 'yyyy-MM')
      groups[monthKey] = (groups[monthKey] || 0) + 1
    }
  })

  const result = []
  let currentDate = startOfMonth(startDate)
  while (currentDate <= endDate) {
    const monthKey = format(currentDate, 'yyyy-MM')
    result.push({
      date: monthKey,
      displayDate: format(currentDate, 'MMM yy'),
      count: groups[monthKey] || 0,
      timestamp: currentDate.getTime()
    })
    currentDate = addMonths(currentDate, 1)
  }

  return result
}

// Yearly Navigation (for monthly view)
export const getCurrentYear = () => {
  const now = new Date()
  return {
    startDate: startOfYear(now),
    endDate: endOfYear(now)
  }
}

export const getPreviousYear = (currentStart) => {
  const prev = subMonths(currentStart, 12)
  return {
    startDate: startOfYear(prev),
    endDate: endOfYear(prev)
  }
}

export const getNextYear = (currentStart) => {
  const next = addMonths(currentStart, 12)
  return {
    startDate: startOfYear(next),
    endDate: endOfYear(next)
  }
}
