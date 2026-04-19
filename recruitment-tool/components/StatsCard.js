export default function StatsCard({ totalNewUsers, dateRangeLabel }) {
  return (
    <div className="bg-slate-800 rounded-lg shadow-md p-6 mb-6 border border-slate-700">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-slate-400 font-medium">New Users</p>
          <p className="text-3xl font-bold text-yellow-400">{totalNewUsers}</p>
        </div>
        <div>
          <p className="text-sm text-slate-400 font-medium">Period</p>
          <p className="text-sm font-semibold text-slate-200 mt-2">{dateRangeLabel}</p>
        </div>
      </div>
    </div>
  )
}
