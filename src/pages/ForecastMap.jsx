import { useState } from 'react'

const regions = [
  {
    id: 'hokkaido', name: 'Hokkaido', status: 'not-yet',
    predictedDate: 'May 3–10',
    description: "Japan's northernmost island blooms last, with cherry blossoms appearing in early May.",
    path: 'M 320 20 L 380 15 L 420 30 L 440 60 L 430 95 L 400 110 L 360 105 L 330 85 L 310 55 Z',
    labelX: 370, labelY: 65,
  },
  {
    id: 'tohoku', name: 'Tohoku', status: 'budding',
    predictedDate: 'Apr 10–20',
    description: 'The scenic northern Honshu region, famous for castle-town cherry blossoms.',
    path: 'M 330 115 L 370 110 L 395 120 L 400 155 L 390 190 L 360 200 L 335 185 L 320 150 Z',
    labelX: 358, labelY: 155,
  },
  {
    id: 'kanto', name: 'Kanto', status: 'full-bloom',
    predictedDate: 'Mar 24–Apr 2',
    description: 'Home to Tokyo — peak bloom typically arrives in late March.',
    path: 'M 340 200 L 380 195 L 400 210 L 405 240 L 390 260 L 360 265 L 335 250 L 330 225 Z',
    labelX: 365, labelY: 230,
  },
  {
    id: 'chubu', name: 'Chubu', status: 'full-bloom',
    predictedDate: 'Mar 28–Apr 8',
    description: 'Central Japan including the Japanese Alps and Nagoya area.',
    path: 'M 280 195 L 335 195 L 340 225 L 335 255 L 310 270 L 275 260 L 260 235 L 265 210 Z',
    labelX: 300, labelY: 230,
  },
  {
    id: 'kansai', name: 'Kansai', status: 'full-bloom',
    predictedDate: 'Mar 26–Apr 4',
    description: 'Kyoto, Osaka, and Nara — the cultural heartland of cherry blossom viewing.',
    path: 'M 250 260 L 310 265 L 320 290 L 305 320 L 270 325 L 245 310 L 235 285 Z',
    labelX: 278, labelY: 292,
  },
  {
    id: 'chugoku', name: 'Chugoku', status: 'falling',
    predictedDate: 'Mar 25–Apr 3',
    description: 'Western Honshu including Hiroshima — blooms slightly ahead of Kansai.',
    path: 'M 175 270 L 245 265 L 250 295 L 240 325 L 205 335 L 175 320 L 160 295 Z',
    labelX: 208, labelY: 298,
  },
  {
    id: 'shikoku', name: 'Shikoku', status: 'falling',
    predictedDate: 'Mar 25–Apr 2',
    description: 'The smallest main island, known for riverside cherry blossom walks.',
    path: 'M 210 335 L 265 330 L 290 345 L 285 370 L 255 380 L 220 375 L 200 355 Z',
    labelX: 248, labelY: 355,
  },
  {
    id: 'kyushu', name: 'Kyushu', status: 'falling',
    predictedDate: 'Mar 22–30',
    description: 'Southern warmth brings the earliest blooms on the main islands.',
    path: 'M 140 330 L 195 330 L 210 360 L 205 400 L 180 420 L 150 415 L 130 390 L 125 355 Z',
    labelX: 168, labelY: 375,
  },
  {
    id: 'okinawa', name: 'Okinawa', status: 'falling',
    predictedDate: 'Jan 15–Feb 15',
    description: 'Subtropical Okinawa sees the first blooms in Japan — a unique kanhizakura variety.',
    path: 'M 80 470 L 110 460 L 130 475 L 125 500 L 100 510 L 80 500 Z',
    labelX: 105, labelY: 485,
  },
]

const statusConfig = {
  'not-yet': { color: '#e5e7eb', fill: '#f3f4f6', label: 'Not Yet', emoji: '🌱', textColor: '#6b7280' },
  'budding': { color: '#fde68a', fill: '#fef9c3', label: 'Budding', emoji: '🌸', textColor: '#92400e' },
  'full-bloom': { color: '#f9a8d4', fill: '#fce7f3', label: 'Full Bloom', emoji: '🌸', textColor: '#be185d' },
  'falling': { color: '#c4b5fd', fill: '#ede9fe', label: 'Falling', emoji: '🍃', textColor: '#5b21b6' },
}

export default function ForecastMap() {
  const [hoveredRegion, setHoveredRegion] = useState(null)
  const [selectedRegion, setSelectedRegion] = useState(null)

  const activeRegion = selectedRegion || hoveredRegion

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">
          <span className="bg-gradient-to-r from-sakura-500 to-sakura-400 bg-clip-text text-transparent">
            2026 Cherry Blossom Forecast
          </span>
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          Track the sakura front as it sweeps across Japan from south to north.
          Click a region to see predicted bloom dates.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {Object.entries(statusConfig).map(([key, config]) => (
          <div key={key} className="flex items-center gap-2 bg-white/80 rounded-full px-4 py-2 shadow-sm border border-gray-100">
            <span className="text-lg">{config.emoji}</span>
            <div className="w-4 h-4 rounded-full border-2" style={{ backgroundColor: config.fill, borderColor: config.color }} />
            <span className="text-sm font-medium" style={{ color: config.textColor }}>{config.label}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="flex-1 flex justify-center">
          <div className="relative bg-gradient-to-b from-blue-50 to-cyan-50 rounded-3xl p-6 shadow-lg border border-blue-100 overflow-hidden">
            <svg viewBox="50 0 430 540" className="w-full max-w-md" style={{ minHeight: '500px' }}>
              <defs>
                <pattern id="waves" patternUnits="userSpaceOnUse" width="40" height="20" patternTransform="rotate(0)">
                  <path d="M0 10 Q10 0 20 10 Q30 20 40 10" stroke="#bfdbfe" strokeWidth="0.5" fill="none" opacity="0.3" />
                </pattern>
              </defs>
              <rect x="50" y="0" width="430" height="540" fill="url(#waves)" />
              {regions.map((region) => {
                const config = statusConfig[region.status]
                const isActive = activeRegion?.id === region.id
                return (
                  <g key={region.id}
                    onMouseEnter={() => setHoveredRegion(region)}
                    onMouseLeave={() => setHoveredRegion(null)}
                    onClick={() => setSelectedRegion(selectedRegion?.id === region.id ? null : region)}
                    className="cursor-pointer">
                    <path d={region.path} fill={isActive ? config.color : config.fill}
                      stroke={isActive ? config.textColor : config.color}
                      strokeWidth={isActive ? 3 : 1.5} />
                    <text x={region.labelX} y={region.labelY} textAnchor="middle"
                      fontSize="11" fontWeight="600"
                      fill={isActive ? config.textColor : '#4b5563'}
                      className="pointer-events-none select-none">
                      {region.name}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>
        </div>

        <div className="lg:w-80 w-full">
          {activeRegion ? (
            <div className="bg-white rounded-2xl shadow-lg border-2 p-6"
              style={{ borderColor: statusConfig[activeRegion.status].color }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{statusConfig[activeRegion.status].emoji}</span>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{activeRegion.name}</h3>
                  <span className="text-sm font-semibold px-3 py-0.5 rounded-full inline-block mt-1"
                    style={{ backgroundColor: statusConfig[activeRegion.status].fill, color: statusConfig[activeRegion.status].textColor }}>
                    {statusConfig[activeRegion.status].label}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-sakura-50 rounded-xl p-3">
                  <span className="text-xs font-semibold text-sakura-500 uppercase tracking-wide">Predicted Bloom</span>
                  <p className="text-lg font-bold text-gray-800 mt-1">{activeRegion.predictedDate}</p>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{activeRegion.description}</p>
              </div>
            </div>
          ) : (
            <div className="bg-white/60 rounded-2xl border-2 border-dashed border-sakura-200 p-6 text-center">
              <span className="text-4xl block mb-3">{"\ud83d\uddfe"}</span>
              <p className="text-gray-500 font-medium">Hover or click a region</p>
              <p className="text-gray-400 text-sm mt-1">to see bloom predictions</p>
            </div>
          )}

          <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 bg-sakura-50 border-b border-sakura-100">
              <h4 className="font-semibold text-gray-700 text-sm">All Regions Overview</h4>
            </div>
            <div className="divide-y divide-gray-50">
              {regions.map((region) => {
                const config = statusConfig[region.status]
                return (
                  <div key={region.id}
                    className="flex items-center justify-between px-4 py-2.5 hover:bg-sakura-50/50 cursor-pointer transition-colors"
                    onMouseEnter={() => setHoveredRegion(region)}
                    onMouseLeave={() => setHoveredRegion(null)}
                    onClick={() => setSelectedRegion(selectedRegion?.id === region.id ? null : region)}>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full border"
                        style={{ backgroundColor: config.fill, borderColor: config.color }} />
                      <span className="text-sm font-medium text-gray-700">{region.name}</span>
                    </div>
                    <span className="text-xs text-gray-500">{region.predictedDate}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
