export default function AnalyticsControls({
  viewMode,
  onChangeViewMode,
  onPreviousPeriod,
  onNextPeriod,
  onResetToLatest,
  previousLabel,
  nextLabel,
  currentPeriodLabel,
  resetButtonLabel,
  canGoPrevious,
  canGoNext,
  isAtCurrentPeriod,
  lastUpdatedText,
  onUpdate,
  isUpdating
}) {
  return (
    <div className="bg-slate-800 rounded-lg shadow-md p-4 mb-6 space-y-4 border border-slate-700">
      <div className="flex gap-2">
        <button
          onClick={() => onChangeViewMode('hourly')}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${viewMode === 'hourly'
            ? 'bg-yellow-500 text-slate-900 shadow-md'
            : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
            }`}
        >
          Hourly View
        </button>
        <button
          onClick={() => onChangeViewMode('daily')}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${viewMode === 'daily'
            ? 'bg-yellow-500 text-slate-900 shadow-md'
            : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
            }`}
        >
          Daily View
        </button>
        <button
          onClick={() => onChangeViewMode('monthly')}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${viewMode === 'monthly'
            ? 'bg-yellow-500 text-slate-900 shadow-md'
            : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
            }`}
        >
          Monthly View
        </button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onPreviousPeriod}
          disabled={!canGoPrevious}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${canGoPrevious
            ? 'bg-slate-700 hover:bg-slate-600 text-slate-200 cursor-pointer'
            : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
        >
          {previousLabel}
        </button>
        <div className="flex-1 px-4 py-2 rounded-lg font-medium bg-slate-700 text-yellow-400 flex items-center justify-center text-sm">
          {currentPeriodLabel}
        </div>
        <button
          onClick={onNextPeriod}
          disabled={!canGoNext}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${canGoNext
            ? 'bg-slate-700 hover:bg-slate-600 text-slate-200 cursor-pointer'
            : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
        >
          {nextLabel}
        </button>
        <button
          onClick={onResetToLatest}
          disabled={isAtCurrentPeriod}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${isAtCurrentPeriod
            ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
            : 'bg-slate-700 hover:bg-slate-600 text-slate-200 cursor-pointer'
            }`}
        >
          {resetButtonLabel}
        </button>
      </div>

      <div className="flex gap-3 items-center justify-end">
        <p className="text-xs text-slate-400">Last updated: {lastUpdatedText}</p>
        <button
          onClick={onUpdate}
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
  )
}
