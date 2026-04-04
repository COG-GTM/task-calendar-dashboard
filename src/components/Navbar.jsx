import { NavLink } from 'react-router-dom'

function SakuraIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g>
        {[0, 72, 144, 216, 288].map((angle) => (
          <ellipse
            key={angle}
            cx="32"
            cy="14"
            rx="8"
            ry="14"
            fill="#f9a8d4"
            stroke="#f472b6"
            strokeWidth="1"
            transform={`rotate(${angle} 32 32)`}
          />
        ))}
        <circle cx="32" cy="32" r="5" fill="#fbbf24" />
      </g>
    </svg>
  )
}

export default function Navbar() {
  const linkClass = ({ isActive }) =>
    `px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-sakura-200 text-sakura-600'
        : 'text-gray-600 hover:text-sakura-500 hover:bg-sakura-50'
    }`

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-sakura-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <NavLink to="/" className="flex items-center gap-2 group">
            <SakuraIcon />
            <span className="text-xl font-bold bg-gradient-to-r from-sakura-500 to-sakura-400 bg-clip-text text-transparent">
              Sakura Forecast
            </span>
          </NavLink>
          <div className="flex items-center gap-1">
            <NavLink to="/" className={linkClass} end>
              Forecast Map
            </NavLink>
            <NavLink to="/top-spots" className={linkClass}>
              Top Spots
            </NavLink>
            <NavLink to="/history" className={linkClass}>
              History
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  )
}
