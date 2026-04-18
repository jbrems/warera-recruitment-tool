'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts'
import { format } from 'date-fns'
import { groupUsersByDay, groupUsersByHour, groupUsersByMonth, getCurrentMonth, getPreviousMonth, getNextMonth, getCurrentDay, getPreviousDay, getNextDay, getCurrentYear, getPreviousYear, getNextYear } from '@/lib/data-processing'

function ErrorFallback({ error }) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center bg-slate-800 p-8 rounded-lg shadow-lg max-w-sm border border-slate-700">
        <p className="text-red-400 text-lg font-semibold mb-4">⚠️ Failed to load user data</p>
        <p className="text-slate-400 text-sm mb-4">{error?.message || 'Unknown error occurred'}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-yellow-500 text-slate-900 rounded-lg hover:bg-yellow-400 transition-colors font-medium"
        >
          Retry
        </button>
      </div>
    </div>
  )
}

export default function UserAnalytics() {
  const [allUsers, setAllUsers] = useState([])
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState('daily')
  const [dateRange, setDateRange] = useState(getCurrentMonth())
  const [totalNewUsers, setTotalNewUsers] = useState(0)
  const [lastUpdateDate, setLastUpdateDate] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleUpdate = async () => {
    try {
      setIsUpdating(true)
      console.log('[Client] Updating user data...')
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update' })
      })
      const data = await response.json()
      if (data.success) {
        console.log('[Client] Data updated, reloading...')
        setAllUsers(data.data)
        setLastUpdateDate(data.lastUpdateDate)
      }
    } catch (err) {
      console.error('[Client] Error updating data:', err)
    } finally {
      setIsUpdating(false)
    }
  }

  const getFormattedUpdateDate = () => {
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

  // Get the oldest user date to determine boundaries
  const getOldestUserDate = () => {
    if (allUsers.length === 0) return null
    const dates = allUsers.map(u => new Date(u.createdAt)).sort((a, b) => a - b)
    return dates[0]
  }

  const oldestUserDate = getOldestUserDate()

  // Fetch all users on mount
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true)
        console.log('[Client] Fetching users from API...')
        const response = await fetch('/api/users')

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch users')
        }

        console.log(`[Client] Successfully fetched ${data.data.length} users`)
        setAllUsers(data.data)
        setLastUpdateDate(data.lastUpdateDate)
        setError(null)
      } catch (err) {
        setError(err)
        console.error('[Client] Error:', err)
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [])

  // Background update check - update if last update was > 15 minutes ago
  useEffect(() => {
    if (lastUpdateDate === null) return

    const checkAndUpdate = () => {
      const now = Date.now()
      const timeSinceUpdate = now - new Date(lastUpdateDate).getTime()
      const fifteenMinutes = 15 * 60 * 1000

      if (timeSinceUpdate > fifteenMinutes) {
        console.log('[Client] Last update was more than 15 minutes ago. Updating in background...')
        handleUpdate()
      }
    }

    // Check immediately
    checkAndUpdate()

    // Check every minute
    const interval = setInterval(checkAndUpdate, 60000)
    return () => clearInterval(interval)
  }, [lastUpdateDate])

  // Update chart data when date range or view mode changes
  useEffect(() => {
    if (allUsers.length === 0) {
      console.log('[Client] No users loaded yet')
      return
    }

    let data
    if (viewMode === 'daily') {
      data = groupUsersByDay(allUsers, dateRange.startDate, dateRange.endDate)
    } else if (viewMode === 'hourly') {
      data = groupUsersByHour(allUsers, dateRange.startDate, dateRange.endDate)
    } else if (viewMode === 'monthly') {
      data = groupUsersByMonth(allUsers, dateRange.startDate, dateRange.endDate)
    }

    // Remove trailing zeros (future dates with no users)
    const now = new Date()
    while (data.length > 0 && data[data.length - 1].count === 0 && new Date(data[data.length - 1].date) > now) {
      data.pop()
    }

    setChartData(data)
    const total = data.reduce((sum, item) => sum + item.count, 0)
    setTotalNewUsers(total)
  }, [allUsers, viewMode, dateRange])

  // Update date range when view mode changes
  useEffect(() => {
    if (viewMode === 'daily') {
      setDateRange(getCurrentMonth())
    } else if (viewMode === 'hourly') {
      setDateRange(getCurrentDay())
    } else if (viewMode === 'monthly') {
      setDateRange(getCurrentYear())
    }
  }, [viewMode])

  // Navigation handlers
  const handlePreviousPeriod = () => {
    if (viewMode === 'daily') {
      const newRange = getPreviousMonth(dateRange.startDate)
      setDateRange(newRange)
    } else if (viewMode === 'hourly') {
      const newRange = getPreviousDay(dateRange.startDate)
      setDateRange(newRange)
    } else if (viewMode === 'monthly') {
      const newRange = getPreviousYear(dateRange.startDate)
      setDateRange(newRange)
    }
  }

  const handleNextPeriod = () => {
    if (viewMode === 'daily') {
      const newRange = getNextMonth(dateRange.startDate)
      setDateRange(newRange)
    } else if (viewMode === 'hourly') {
      const newRange = getNextDay(dateRange.startDate)
      setDateRange(newRange)
    } else if (viewMode === 'monthly') {
      const newRange = getNextYear(dateRange.startDate)
      setDateRange(newRange)
    }
  }

  const handleResetToLatest = () => {
    if (viewMode === 'daily') {
      setDateRange(getCurrentMonth())
    } else if (viewMode === 'hourly') {
      setDateRange(getCurrentDay())
    } else if (viewMode === 'monthly') {
      setDateRange(getCurrentYear())
    }
  }

  // Check if buttons should be disabled
  const canGoPrevious = oldestUserDate && dateRange.startDate > oldestUserDate
  const canGoNext = () => {
    const today = new Date()
    if (viewMode === 'daily') {
      return dateRange.endDate < today
    } else {
      return dateRange.endDate < today
    }
  }

  // Get button labels
  const getPreviousLabel = () => {
    if (viewMode === 'daily') {
      const prev = getPreviousMonth(dateRange.startDate)
      return `< ${format(prev.startDate, 'MMMM')}`
    } else if (viewMode === 'hourly') {
      const prev = getPreviousDay(dateRange.startDate)
      return `< ${format(prev.startDate, 'MMM dd')}`
    } else if (viewMode === 'monthly') {
      const prev = getPreviousYear(dateRange.startDate)
      return `< ${format(prev.startDate, 'yyyy')}`
    }
  }

  const getNextLabel = () => {
    if (viewMode === 'daily') {
      const next = getNextMonth(dateRange.startDate)
      return `${format(next.startDate, 'MMMM')} >`
    } else if (viewMode === 'hourly') {
      const next = getNextDay(dateRange.startDate)
      return `${format(next.startDate, 'MMM dd')} >`
    } else if (viewMode === 'monthly') {
      const next = getNextYear(dateRange.startDate)
      return `${format(next.startDate, 'yyyy')} >`
    }
  }

  const getTodayLabel = () => {
    if (viewMode === 'daily') {
      return `This Month`
    } else if (viewMode === 'hourly') {
      return `Today`
    } else if (viewMode === 'monthly') {
      return `This Year`
    }
  }

  const isAtCurrentPeriod = () => {
    if (viewMode === 'hourly') {
      const today = getCurrentDay()
      return dateRange.startDate.toDateString() === today.startDate.toDateString() && dateRange.endDate.toDateString() === today.endDate.toDateString()
    } else if (viewMode === 'daily') {
      const thisMonth = getCurrentMonth()
      return dateRange.startDate.toDateString() === thisMonth.startDate.toDateString() && dateRange.endDate.toDateString() === thisMonth.endDate.toDateString()
    } else if (viewMode === 'monthly') {
      const thisYear = getCurrentYear()
      return dateRange.startDate.toDateString() === thisYear.startDate.toDateString() && dateRange.endDate.toDateString() === thisYear.endDate.toDateString()
    }
    return false
  }

  const getDateRangeLabel = () => {
    if (viewMode === 'daily') {
      return format(dateRange.startDate, 'MMMM yyyy')
    } else if (viewMode === 'hourly') {
      return format(dateRange.startDate, 'MMMM dd, yyyy')
    } else if (viewMode === 'monthly') {
      return format(dateRange.startDate, 'yyyy')
    }
  }

  if (error) {
    return <ErrorFallback error={error} />
  }

  return (
    <div className="w-full h-full overflow-auto flex flex-col bg-slate-900 p-2 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-yellow-400 mb-2">
          User Growth Analytics
        </h1>
        <p className="text-slate-400">Belgium - New Users Per {viewMode === 'hourly' ? 'Hour' : viewMode === 'daily' ? 'Day' : 'Month'}</p>
      </div>

      {/* Stats Card */}
      <div className="bg-slate-800 rounded-lg shadow-md p-6 mb-6 border border-slate-700">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-slate-400 font-medium">New Users</p>
            <p className="text-3xl font-bold text-yellow-400">{totalNewUsers}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400 font-medium">Period</p>
            <p className="text-sm font-semibold text-slate-200 mt-2">{getDateRangeLabel()}</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-slate-800 rounded-lg shadow-md p-4 mb-6 space-y-4 border border-slate-700">
        {/* View Mode Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('hourly')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${viewMode === 'hourly'
              ? 'bg-yellow-500 text-slate-900 shadow-md'
              : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
              }`}
          >
            Daily View
          </button>
          <button
            onClick={() => setViewMode('daily')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${viewMode === 'daily'
              ? 'bg-yellow-500 text-slate-900 shadow-md'
              : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
              }`}
          >
            Monthly View
          </button>
          <button
            onClick={() => setViewMode('monthly')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${viewMode === 'monthly'
              ? 'bg-yellow-500 text-slate-900 shadow-md'
              : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
              }`}
          >
            Yearly View
          </button>
        </div>

        {/* Navigation Controls */}
        <div className="flex gap-2">
          <button
            onClick={handlePreviousPeriod}
            disabled={!canGoPrevious}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${canGoPrevious
              ? 'bg-slate-700 hover:bg-slate-600 text-slate-200 cursor-pointer'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }`}
          >
            {getPreviousLabel()}
          </button>
          <div className="flex-1 px-4 py-2 rounded-lg font-medium bg-slate-700 text-yellow-400 flex items-center justify-center text-sm">
            {getDateRangeLabel()}
          </div>
          <button
            onClick={handleNextPeriod}
            disabled={!canGoNext()}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${canGoNext()
              ? 'bg-slate-700 hover:bg-slate-600 text-slate-200 cursor-pointer'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }`}
          >
            {getNextLabel()}
          </button>
          <button
            onClick={handleResetToLatest}
            disabled={isAtCurrentPeriod()}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${isAtCurrentPeriod()
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
              : 'bg-slate-700 hover:bg-slate-600 text-slate-200 cursor-pointer'
              }`}
          >
            {getTodayLabel()}
          </button>
        </div>

        {/* Data Update Management */}
        <div className="flex gap-3 items-center justify-end">
          <p className="text-xs text-slate-400">
            Last updated: {getFormattedUpdateDate()}
          </p>
          <button
            onClick={handleUpdate}
            disabled={isUpdating}
            className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm whitespace-nowrap ${isUpdating
              ? 'bg-yellow-600 text-slate-900 cursor-wait opacity-75'
              : 'bg-yellow-600 hover:bg-yellow-500 text-slate-900'
              }`}
          >
            {isUpdating ? '⟳ Updating...' : '⟳ Update Data'}
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-slate-800 rounded-lg shadow-md px-1 py-4 md:px-4 flex-1 min-h-0 border border-slate-700">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
              <p className="text-slate-300 text-lg font-medium">Loading graph...</p>
            </div>
          </div>
        ) : chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 30, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#64748b" />
              <XAxis
                dataKey="displayDate"
                tick={{ fontSize: 12, fill: '#cbd5e1' }}
                angle={chartData.length > 15 ? -45 : 0}
                height={chartData.length > 15 ? 80 : 40}
                interval={Math.max(0, Math.floor(chartData.length / 7))}
              />
              <YAxis tick={{ fontSize: 12, fill: '#cbd5e1' }} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #fbbf24',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
                }}
                labelStyle={{ color: '#fbbf24' }}
                formatter={(value) => [`${value} users`, 'New Users']}
                labelFormatter={(label) => `${label}`}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#fbbf24"
                dot={{ fill: '#fbbf24', r: 4 }}
                activeDot={{ r: 6 }}
                strokeWidth={2}
                isAnimationActive={true}
                name="New Users"
                label={{ position: 'top', fill: '#fbbf24', fontSize: 12, offset: 10 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-slate-500 text-center">No data available for the selected period</p>
          </div>
        )}
      </div>
    </div>
  )
}
