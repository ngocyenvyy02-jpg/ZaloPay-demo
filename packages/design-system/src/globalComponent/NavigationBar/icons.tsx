// Icons for NavigationBar.
// Source of truth: Figma node 1:1893 → exported to /assets (ic-back.svg, header-support-dots.svg,
// header-divider-line.svg, ic-close.svg). Inlined here so they inherit `currentColor` and need no asset path.

export function BackIcon() {
  // Figma layer: "Vector 2 (Stroke)" — viewBox 8.13 x 13.96, rendered inside a 24px box.
  return (
    <svg width="9" height="14" viewBox="0 0 8.12541 13.9593" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.84508 0.21967C7.13797 -0.0732233 7.61285 -0.0732233 7.90574 0.21967C8.19863 0.512563 8.19863 0.987436 7.90574 1.28033L1.9864 7.19966L7.86648 12.6597C8.17001 12.9416 8.18759 13.4161 7.90574 13.7197C7.62389 14.0232 7.14934 14.0408 6.84581 13.7589L0.126785 7.51984C-0.0380081 7.36681 -0.0428076 7.10756 0.116209 6.94854L6.84508 0.21967Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function DotsIcon() {
  // Figma layer: "Group 2" — three dots (support / more).
  return (
    <svg width="17" height="5" viewBox="0 0 17 5" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="15.5" cy="2.5" r="1.5" fill="currentColor" />
      <circle cx="8.5" cy="2.5" r="2.5" fill="currentColor" />
      <circle cx="1.5" cy="2.5" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function CloseIcon() {
  // Figma layer: "close" — viewBox 16 x 16, rendered inside a 24px box.
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.7489 2.25496C13.4142 1.91501 12.8715 1.91501 12.5368 2.25496L8 6.86245L3.46323 2.25496C3.1285 1.91501 2.58579 1.91501 2.25105 2.25496C1.91632 2.59492 1.91632 3.14609 2.25105 3.48604L6.78782 8.09353L2.43524 12.514C2.10051 12.8539 2.10051 13.4051 2.43524 13.745C2.76998 14.085 3.31269 14.085 3.64742 13.745L8 9.32461L12.3526 13.745C12.6873 14.085 13.23 14.085 13.5648 13.745C13.8995 13.4051 13.8995 12.8539 13.5648 12.514L9.21218 8.09353L13.7489 3.48604C14.0837 3.14609 14.0837 2.59492 13.7489 2.25496Z"
        fill="currentColor"
      />
    </svg>
  );
}
