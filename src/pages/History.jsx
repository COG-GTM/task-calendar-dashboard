import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const historicalData = [
  { year: '2016', tokyo: 'Mar 21', kyoto: 'Mar 23', tokyoDay: 81, kyotoDay: 83 },
  { year: '2017', tokyo: 'Mar 21', kyoto: 'Mar 31', tokyoDay: 80, kyotoDay: 90 },
  { year: '2018', tokyo: 'Mar 17', kyoto: 'Mar 22', tokyoDay: 76, kyotoDay: 81 },
  { year: '2019', tokyo: 'Mar 21', kyoto: 'Mar 27', tokyoDay: 80, kyotoDay: 86 },
  { year: '2020', tokyo: 'Mar 14', kyoto: 'Mar 22', tokyoDay: 74, kyotoDay: 82 },
  { year: '2021', tokyo: 'Mar 14', kyoto: 'Mar 16', tokyoDay: 73, kyotoDay: 75 },
  { year: '2022', tokyo: 'Mar 20', kyoto: 'Mar 23', tokyoDay: 79, kyotoDay: 82 },
  { year: '2023', tokyo: 'Mar 14', kyoto: 'Mar 17', tokyoDay: 73, kyotoDay: 76 },
  { year: '2024', tokyo: 'Mar 29', kyoto: 'Mar 29', tokyoDay: 89, kyotoDay: 89 },
  { year: '2025', tokyo: 'Mar 20', kyoto: 'Mar 25', tokyoDay: 79, kyotoDay: 84 },
]

function dayToDate(dayOfYear) {
  if (dayOfYear <= 31) return 'Jan ' + dayOfYear
  if (dayOfYear <= 59) return 'Feb ' + (dayOfYear - 31)
  if (dayOfYear <= 90) return 'Mar ' + (dayOfYear - 59)
  return 'Apr ' + (dayOfYear - 90)
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-sakura-100 p-4">
        <p className="font-bold text-gray-800 mb-2">{label}</p>
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-gray-600">{entry.name}:</span>
            <span className="font-semibold">{dayToDate(entry.value)}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default function History() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">
          <span className="bg-gradient-to-r from-sakura-500 to-sakura-400 bg-clip-text text-transparent">
            Historical Bloom Data
          </span>
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          First bloom dates for Tokyo and Kyoto over the past 10 years,
          showing how climate variations affect sakura timing.
        </p>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-lg font-bold text-gray-800 mb-6">First Bloom Date Trends</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={historicalData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#fce7f3" />
            <XAxis dataKey="year" tick={{ fill: '#6b7280', fontSize: 13 }} />
            <YAxis
              domain={[70, 95]}
              tick={{ fill: '#6b7280', fontSize: 13 }}
              tickFormatter={dayToDate}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="tokyoDay"
              name="Tokyo"
              stroke="#ec4899"
              strokeWidth={3}
              dot={{ r: 5, fill: '#ec4899' }}
              activeDot={{ r: 7 }}
            />
            <Line
              type="monotone"
              dataKey="kyotoDay"
              name="Kyoto"
              stroke="#86efac"
              strokeWidth={3}
              dot={{ r: 5, fill: '#86efac' }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 bg-sakura-50 border-b border-sakura-100">
          <h2 className="text-lg font-bold text-gray-800">Detailed Historical Data</h2>
          <p className="text-sm text-gray-500 mt-1">First bloom dates recorded by the Japan Meteorological Agency</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Year</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-sakura-500 uppercase tracking-wider">Tokyo</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-spring-300 uppercase tracking-wider">Kyoto</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Difference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {historicalData.map((row) => {
                const diff = row.kyotoDay - row.tokyoDay
                return (
                  <tr key={row.year} className="hover:bg-sakura-50/30 transition-colors">
                    <td className="px-6 py-3 text-sm font-bold text-gray-800">{row.year}</td>
                    <td className="px-6 py-3 text-sm text-gray-700">
                      <span className="inline-flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-sakura-400" />
                        {row.tokyo}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-700">
                      <span className="inline-flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-spring-300" />
                        {row.kyoto}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        diff > 0 ? 'bg-blue-50 text-blue-600' : diff < 0 ? 'bg-orange-50 text-orange-600' : 'bg-gray-50 text-gray-600'
                      }`}>
                        {diff === 0 ? 'Same day' : diff > 0 ? `Kyoto ${diff}d later` : `Tokyo ${Math.abs(diff)}d later`}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fun facts */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-sakura-50 to-sakura-100 rounded-2xl p-5 border border-sakura-200">
          <div className="text-2xl mb-2">{"\ud83c\udf38"}</div>
          <h3 className="font-bold text-gray-800 text-sm">Earliest Tokyo Bloom</h3>
          <p className="text-2xl font-bold text-sakura-600 mt-1">Mar 14</p>
          <p className="text-xs text-gray-500 mt-1">Recorded in 2020, 2021, and 2023</p>
        </div>
        <div className="bg-gradient-to-br from-spring-50 to-spring-100 rounded-2xl p-5 border border-spring-200">
          <div className="text-2xl mb-2">{"\ud83c\udf3f"}</div>
          <h3 className="font-bold text-gray-800 text-sm">Earliest Kyoto Bloom</h3>
          <p className="text-2xl font-bold text-green-600 mt-1">Mar 16</p>
          <p className="text-xs text-gray-500 mt-1">Recorded in 2021</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-5 border border-purple-200">
          <div className="text-2xl mb-2">{"\ud83d\udcca"}</div>
          <h3 className="font-bold text-gray-800 text-sm">Average Difference</h3>
          <p className="text-2xl font-bold text-purple-600 mt-1">3.6 days</p>
          <p className="text-xs text-gray-500 mt-1">Kyoto typically blooms after Tokyo</p>
        </div>
      </div>
    </div>
  )
}
