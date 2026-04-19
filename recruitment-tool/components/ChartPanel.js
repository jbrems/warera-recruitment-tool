import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function ChartPanel({ loading, chartData }) {
  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-slate-300 text-lg font-medium">Loading graph...</p>
        </div>
      </div>
    )
  }

  if (chartData.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-slate-500 text-center">No data available for the selected period</p>
      </div>
    )
  }

  return (
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
  )
}
