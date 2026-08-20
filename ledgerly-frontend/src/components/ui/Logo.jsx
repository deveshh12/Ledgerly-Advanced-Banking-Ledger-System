export default function Logo({ className = '' }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg width="30" height="30" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="24" fill="url(#logo-grad)" />
        <path d="M30 68V32h10.5c9 0 14.5 5 14.5 13.5S49.5 59 40.5 59H36v9h-6Zm6-14h4c5 0 8-2.5 8-7.5S45 39 40 39h-4v15Z" fill="#05070d" />
        <defs>
          <linearGradient id="logo-grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f2cd7c" />
            <stop offset="1" stopColor="#c9982f" />
          </linearGradient>
        </defs>
      </svg>
      <span className="font-display text-lg font-semibold tracking-tight text-white">
        Ledgerly
      </span>
    </div>
  )
}
