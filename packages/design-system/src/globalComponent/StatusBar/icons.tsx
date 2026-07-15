/* iOS status-bar glyphs, drawn with currentColor so the StatusBar can
   theme them (dark on light screens, white on dark screens). */

export function SignalIcon() {
  return (
    <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="0" y="8.5" width="3" height="3.5" rx="0.6" fill="currentColor" />
      <rect x="4.5" y="6" width="3" height="6" rx="0.6" fill="currentColor" />
      <rect x="9" y="3.5" width="3" height="8.5" rx="0.6" fill="currentColor" />
      <rect x="13.5" y="1" width="3" height="11" rx="0.6" fill="currentColor" />
    </svg>
  );
}

export function WifiIcon() {
  return (
    <svg width="17" height="12" viewBox="0 0 17 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M8.5 2.2c2.63 0 5.05 1 6.86 2.65a.5.5 0 0 0 .69-.01l.79-.82a.5.5 0 0 0-.02-.72A11.7 11.7 0 0 0 8.5 0 11.7 11.7 0 0 0 .68 3.3a.5.5 0 0 0-.02.72l.79.82a.5.5 0 0 0 .69.01A9.7 9.7 0 0 1 8.5 2.2Z"
        fill="currentColor"
      />
      <path
        d="M8.5 5.9c1.5 0 2.87.56 3.92 1.48a.5.5 0 0 0 .68-.03l.8-.83a.5.5 0 0 0-.03-.73A8 8 0 0 0 8.5 3.7a8 8 0 0 0-5.37 2.06.5.5 0 0 0-.03.73l.8.83a.5.5 0 0 0 .68.03A5.9 5.9 0 0 1 8.5 5.9Z"
        fill="currentColor"
      />
      <path
        d="M8.5 9.5c.62 0 1.19.23 1.63.6a.5.5 0 0 0 .67-.03l.98-1.02a.5.5 0 0 0-.05-.75A5 5 0 0 0 8.5 7.2a5 5 0 0 0-3.23 1.1.5.5 0 0 0-.05.75l.98 1.02a.5.5 0 0 0 .67.03c.44-.37 1.01-.6 1.63-.6Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function BatteryIcon() {
  return (
    <svg width="25" height="12" viewBox="0 0 25 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="0.5" y="0.5" width="21" height="11" rx="3" stroke="currentColor" strokeOpacity="0.35" fill="none" />
      <rect x="2" y="2" width="18" height="8" rx="1.5" fill="currentColor" />
      <path d="M23 4v4a1.8 1.8 0 0 0 0-4Z" fill="currentColor" fillOpacity="0.4" />
    </svg>
  );
}
