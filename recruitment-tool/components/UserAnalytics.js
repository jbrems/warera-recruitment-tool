'use client'

import { useState, useEffect, useRef } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts'
import { format } from 'date-fns'
import { fetchCountries } from '@/lib/warera-api'
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
  const [countries, setCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [loadingCountries, setLoadingCountries] = useState(true)
  const [countryFilter, setCountryFilter] = useState('')
  const [countryInputValue, setCountryInputValue] = useState('')
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false)
  const [highlightedCountryIndex, setHighlightedCountryIndex] = useState(-1)
  const countryComboboxRef = useRef(null)
  const countryDropdownRef = useRef(null)
  const highlightedItemRef = useRef(null)
  const countryCachesRef = useRef({}) // Store cache per country: { countryId: { data: [], lastUpdateDate: timestamp } }

  // Close country dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryComboboxRef.current && !countryComboboxRef.current.contains(event.target)) {
        setIsCountryDropdownOpen(false)
      }
    }

    if (isCountryDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isCountryDropdownOpen])

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedItemRef.current) {
      highlightedItemRef.current.scrollIntoView({ block: 'nearest' })
    }
  }, [highlightedCountryIndex])

  const handleUpdate = async () => {
    try {
      setIsUpdating(true)
      console.log('[Client] Updating user data for country:', selectedCountry?.name)
      const countryId = selectedCountry?._id || selectedCountry?.id || '6813b6d446e731854c7ac7a4'
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update', countryId })
      })
      const data = await response.json()
      if (data.success) {
        console.log('[Client] Data updated, reloading...')

        // Update per-country cache
        const cacheCountryId = selectedCountry?._id || selectedCountry?.id || '6813b6d446e731854c7ac7a4'
        countryCachesRef.current[cacheCountryId] = {
          data: data.data,
          lastUpdateDate: data.lastUpdateDate
        }

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

  // Fetch countries on mount and load selected country from localStorage
  useEffect(() => {
    const loadCountries = async () => {
      try {
        setLoadingCountries(true)
        const countryList = await fetchCountries()
        // Sort countries by name alphabetically
        const sortedCountries = [...countryList].sort((a, b) => a.name.localeCompare(b.name))
        setCountries(sortedCountries)

        // Load selected country from localStorage or use auto-detection
        const savedCountryId = localStorage.getItem('selectedCountryId')
        let country = null

        if (savedCountryId) {
          country = sortedCountries.find(c => c._id === savedCountryId || c.id === savedCountryId)
        }

        if (!country) {
          // Try to auto-detect country from IP if not saved
          try {
            console.log('[Client] Attempting to auto-detect country from IP...')
            const detectResponse = await fetch('/api/detect-country')
            if (detectResponse.ok) {
              const detectData = await detectResponse.json()
              if (detectData.success && detectData.countryCode) {
                console.log('[Client] Detected country code:', detectData.countryCode)
                // Try to find country by code (assuming country names or codes match)
                country = sortedCountries.find(c =>
                  c.name.toUpperCase().includes(detectData.countryCode) ||
                  c.id.includes(detectData.countryCode)
                )
              }
            }
          } catch (err) {
            console.error('[Client] Auto-detection failed:', err)
          }
        }

        if (!country) {
          // Default to Belgium
          country = sortedCountries.find(c => c.name.toLowerCase().includes('belgium')) || sortedCountries.find(c => c.id === '6813b6d446e731854c7ac7a4')
        }

        // Fall back to first country if Belgium not found
        if (!country && sortedCountries.length > 0) {
          country = sortedCountries[0]
        }

        if (country) {
          setSelectedCountry(country)
          //setCountryInputValue(country.name)
          localStorage.setItem('selectedCountryId', country._id || country.id)
        }
      } catch (err) {
        console.error('[Client] Error loading countries:', err)
      } finally {
        setLoadingCountries(false)
      }
    }
    loadCountries()
  }, [])

  // Handle country selection from combobox
  const handleCountrySelect = (country) => {
    console.log('[Client] Country selected:', JSON.stringify({ name: country.name, id: country.id, code: country.code }))
    // Clear component cache to force fresh fetch
    countryCachesRef.current = {}
    setSelectedCountry(country)
    setCountryInputValue('')
    localStorage.setItem('selectedCountryId', country._id || country.id)
    setAllUsers([])
    setChartData([])
    setLoading(true)
    setCountryFilter('')
    setIsCountryDropdownOpen(false)
    setHighlightedCountryIndex(-1)
  }

  // Get filtered countries for keyboard navigation
  const getFilteredCountries = () => {
    return countries.filter((country) => country.name.toLowerCase().includes(countryFilter.toLowerCase()))
  }

  // Handle keyboard navigation in combobox
  const handleCountryInputKeyDown = (e) => {
    const filteredCountries = getFilteredCountries()

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (!isCountryDropdownOpen) {
        setIsCountryDropdownOpen(true)
        setHighlightedCountryIndex(0)
      } else {
        setHighlightedCountryIndex((prev) =>
          prev < filteredCountries.length - 1 ? prev + 1 : prev
        )
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedCountryIndex((prev) => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (isCountryDropdownOpen && highlightedCountryIndex >= 0) {
        handleCountrySelect(filteredCountries[highlightedCountryIndex])
      }
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setIsCountryDropdownOpen(false)
      setHighlightedCountryIndex(-1)
    }
  }

  // Get the oldest user date to determine boundaries
  const getOldestUserDate = () => {
    if (allUsers.length === 0) return null
    const dates = allUsers.map(u => new Date(u.createdAt)).sort((a, b) => a - b)
    return dates[0]
  }

  const oldestUserDate = getOldestUserDate()

  // Fetch all users on mount or when country changes
  useEffect(() => {
    if (!selectedCountry) {
      console.log('[Client] No selected country yet')
      return
    }

    console.log('[Client] Country selected:', selectedCountry.name, 'ID:', selectedCountry.id)

    const loadUsers = async () => {
      try {
        const countryId = selectedCountry?._id || selectedCountry?.id || '6813b6d446e731854c7ac7a4'
        const cache = countryCachesRef.current[countryId]
        const fifteenMinutes = 15 * 60 * 1000
        const now = Date.now()

        // Check if we have fresh cached data
        if (cache && cache.data && cache.lastUpdateDate) {
          const timeSinceUpdate = now - cache.lastUpdateDate
          if (timeSinceUpdate < fifteenMinutes) {
            console.log('[Client] Using cached data for country:', selectedCountry.name, `countryId: ${countryId} (${Math.round(timeSinceUpdate / 1000)}s old)`)
            setAllUsers(cache.data)
            setLastUpdateDate(cache.lastUpdateDate)
            setError(null)
            setLoading(false)
            return
          }
        }

        // Cache is stale or doesn't exist, fetch fresh data
        setLoading(true)
        console.log('[Client] Fetching fresh users from API for country:', selectedCountry.name, `countryId: ${countryId}`)
        const response = await fetch(`/api/users?countryId=${countryId}`)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch users')
        }

        console.log(`[Client] Successfully fetched ${data.data.length} users for country: ${selectedCountry.name}`)

        // Store in per-country cache
        const cacheCountryId = selectedCountry?._id || selectedCountry?.id || '6813b6d446e731854c7ac7a4'
        countryCachesRef.current[cacheCountryId] = {
          data: data.data,
          lastUpdateDate: data.lastUpdateDate
        }

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
  }, [selectedCountry])

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
        <h1 className="text-2xl md:text-3xl font-bold text-yellow-400 mb-4">
          User Growth Analytics
        </h1>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <p className="text-slate-400">
            New Users Per {viewMode === 'hourly' ? 'Hour' : viewMode === 'daily' ? 'Day' : 'Month'}
          </p>
          {!loadingCountries && countries.length > 0 && (
            <div className="relative" ref={countryComboboxRef}>
              <div className="relative inline-block w-56">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={selectedCountry?.name || 'Choose a country...'}
                    value={countryInputValue}
                    onChange={(e) => {
                      setCountryInputValue(e.target.value)
                      setCountryFilter(e.target.value)
                      setHighlightedCountryIndex(-1)
                      if (!isCountryDropdownOpen) {
                        setIsCountryDropdownOpen(true)
                      }
                    }}
                    onFocus={() => {
                      setIsCountryDropdownOpen(true)
                      setHighlightedCountryIndex(-1)
                    }}
                    onKeyDown={handleCountryInputKeyDown}
                    className="w-full px-4 py-2 bg-slate-700 text-slate-100 rounded-lg text-sm border-2 border-slate-600 placeholder-slate-500 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 transition-all cursor-pointer font-medium"
                    style={{
                      backgroundImage: selectedCountry?.code ? `url("https://flagsapi.com/${selectedCountry.code.toUpperCase()}/flat/32.png")` : undefined,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'left 10px center',
                      backgroundSize: '22px 16px',
                      paddingLeft: selectedCountry?.code ? '42px' : '16px'
                    }}
                  />
                  <svg
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {isCountryDropdownOpen && (
                  <>
                    <style>{`
                      .country-dropdown::-webkit-scrollbar {
                        width: 8px;
                      }
                      .country-dropdown::-webkit-scrollbar-track {
                        background: #334155;
                        border-radius: 4px;
                      }
                      .country-dropdown::-webkit-scrollbar-thumb {
                        background: #64748b;
                        border-radius: 4px;
                      }
                      .country-dropdown::-webkit-scrollbar-thumb:hover {
                        background: #78828f;
                      }
                    `}</style>
                    <div ref={countryDropdownRef} className="country-dropdown absolute top-full left-0 right-0 mt-2 bg-slate-700 border-2 border-slate-600 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
                      {getFilteredCountries().map((country, index) => (
                        <button
                          ref={highlightedCountryIndex === index ? highlightedItemRef : null}
                          key={country.id}
                          onClick={() => handleCountrySelect(country)}
                          className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center gap-3 border-b border-slate-600 last:border-b-0 ${selectedCountry?.id === country.id
                            ? 'bg-yellow-600 text-slate-900 font-semibold'
                            : highlightedCountryIndex === index
                              ? 'bg-slate-600 text-slate-100 font-medium'
                              : 'text-slate-200 hover:bg-slate-600'
                            }`}
                          onMouseEnter={() => setHighlightedCountryIndex(index)}
                        >
                          {country.code && (
                            <img
                              src={`https://flagsapi.com/${country.code.toUpperCase()}/flat/32.png`}
                              alt={country.name}
                              className="w-6 h-4 object-cover rounded"
                              onError={(e) => {
                                e.target.style.display = 'none'
                              }}
                            />
                          )}
                          <span>{country.name}</span>
                        </button>
                      ))}
                      {getFilteredCountries().length === 0 && (
                        <div className="px-4 py-3 text-sm text-slate-400 text-center">No countries found</div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
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
      <div className="bg-slate-800 rounded-lg shadow-md p-1 md:p-4 flex-1 min-h-0 border border-slate-700">
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
