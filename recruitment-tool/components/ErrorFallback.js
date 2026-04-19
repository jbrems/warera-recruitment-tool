export default function ErrorFallback({ error }) {
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
