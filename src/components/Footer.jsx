function SakuraPetal({ className }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 2C12 2 8 8 8 12C8 16 12 22 12 22C12 22 16 16 16 12C16 8 12 2 12 2Z" fill="#f9a8d4" opacity="0.6" />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-sakura-50 via-white to-spring-50 border-t border-sakura-100 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <SakuraPetal className="opacity-60" />
            <span className="text-sm text-gray-500">
              Sakura Forecast 2026 — Cherry blossom predictions for Japan
            </span>
            <SakuraPetal className="opacity-60" />
          </div>
          <div className="text-xs text-gray-400">
            Data is illustrative. Bloom dates vary by year and microclimate.
          </div>
        </div>
      </div>
    </footer>
  )
}
