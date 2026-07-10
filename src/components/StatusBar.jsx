export default function StatusBar() {
  return (
    <div className="status-bar">
      <span className="status-bar__time">9:41</span>
      <div className="status-bar__icons">
        <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
          <rect x="0" y="7.5" width="3" height="4.5" rx="0.8" fill="#001F3E" />
          <rect x="5" y="5" width="3" height="7" rx="0.8" fill="#001F3E" />
          <rect x="10" y="2.5" width="3" height="9.5" rx="0.8" fill="#001F3E" />
          <rect x="15" y="0" width="3" height="12" rx="0.8" fill="#001F3E" opacity="0.35" />
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path
            d="M8 9.6a2 2 0 0 1 1.5.7L8 12l-1.5-1.7A2 2 0 0 1 8 9.6ZM4.6 7.9a5 5 0 0 1 6.8 0L10 9.5a3 3 0 0 0-4 0L4.6 7.9ZM1.2 4.5a10 10 0 0 1 13.6 0L13.4 6a8 8 0 0 0-10.8 0L1.2 4.5Z"
            fill="#001F3E"
          />
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3" stroke="#001F3E" strokeOpacity="0.4" />
          <rect x="2" y="2" width="18" height="8" rx="1.8" fill="#001F3E" />
          <path d="M23 4v4a2.2 2.2 0 0 0 0-4Z" fill="#001F3E" fillOpacity="0.4" />
        </svg>
      </div>
    </div>
  )
}
