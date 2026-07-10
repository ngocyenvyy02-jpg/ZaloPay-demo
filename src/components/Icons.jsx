export function ClockIcon({ size = 20, color = '#0033C9' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path
        d="M3.6 6.4A7.5 7.5 0 1 1 2.5 10"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path d="M3.6 2.8v3.6h3.6" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 6.2V10l2.6 1.6" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function EyeIcon({ size = 18, color = '#66798B' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <path
        d="M1.8 9s2.6-4.8 7.2-4.8S16.2 9 16.2 9s-2.6 4.8-7.2 4.8S1.8 9 1.8 9Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="9" r="2.1" stroke={color} strokeWidth="1.5" />
    </svg>
  )
}

export function QrScanIcon({ size = 22, color = '#FFFFFF' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <path d="M2.5 7V5A2.5 2.5 0 0 1 5 2.5h2" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M15 2.5h2A2.5 2.5 0 0 1 19.5 5v2" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M19.5 15v2a2.5 2.5 0 0 1-2.5 2.5h-2" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M7 19.5H5A2.5 2.5 0 0 1 2.5 17v-2" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M2.5 11h17" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function CloseIcon({ size = 22, color = '#66798B' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <path d="M5 5l12 12M17 5L5 17" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
