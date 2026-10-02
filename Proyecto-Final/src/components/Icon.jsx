const paths = {
  leaf: (
    <>
      <path d="M20 4C11 4 5 9 5 17c0 2 1 3 3 3 8 0 13-6 12-16Z" />
      <path d="M5 20c2-5 6-9 12-12" />
    </>
  ),

  mountain: (
    <>
      <path d="m3 19 6.5-10 4 6 2.5-3L21 19H3Z" />
      <path d="m13.5 19 2-3 2.2 3" />
    </>
  ),

  wave: (
    <>
      <path d="M3 10c2.2 0 2.2-2 4.4-2s2.2 2 4.4 2 2.2-2 4.4-2S18.4 10 21 10" />
      <path d="M3 15c2.2 0 2.2-2 4.4-2s2.2 2 4.4 2 2.2-2 4.4-2S18.4 15 21 15" />
    </>
  ),

  culture: (
    <>
      <path d="M4 20h16" />
      <path d="M5 20V9h14v11" />
      <path d="M3 9 12 4l9 5" />
      <path d="M8 13h1M11.5 13h1M15 13h1M8 17h1M11.5 17h1M15 17h1" />
    </>
  ),

  mapPin: (
    <>
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),

  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5l3.5 2" />
    </>
  ),

  users: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19c.5-3.2 2.3-5 5.5-5s5 1.8 5.5 5" />
      <path d="M16 5.5a3 3 0 0 1 0 5.8M17 14c2.3.6 3.7 2.1 4 5" />
    </>
  ),

  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </>
  ),

  arrowRight: (
    <path d="M5 12h13M13 6l6 6-6 6" />
  ),

  arrowLeft: (
    <path d="M19 12H6m6-6-6 6 6 6" />
  ),

  check: (
    <path d="m5 12 4 4L19 6" />
  ),

  close: (
    <path d="m6 6 12 12M18 6 6 18" />
  ),

  external: (
    <>
      <path d="M14 5h5v5" />
      <path d="m19 5-8 8" />
      <path d="M19 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" />
    </>
  ),

  logout: (
    <>
      <path d="M10 5H6a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h4" />
      <path d="M13 8l4 4-4 4" />
      <path d="M9 12h8" />
    </>
  ),

  compass: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m15.5 8.5-2.1 4.9-4.9 2.1 2.1-4.9 4.9-2.1Z" />
    </>
  ),

  accessibility: (
    <>
      <circle cx="12" cy="5" r="2" />
      <path d="M6 9.5h12" />
      <path d="M12 8v10" />
      <path d="m8 20 4-7 4 7" />
    </>
  ),

  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),

  moon: (
    <path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.7 8.7 0 1 0 20 15.5Z" />
  ),

  volume: (
    <>
      <path d="M4 10v4h3l4 3V7l-4 3H4Z" />
      <path d="M15 9.5a4 4 0 0 1 0 5M17.5 7a7.5 7.5 0 0 1 0 10" />
    </>
  ),
};

function Icon({
  name,
  size = 20,
  className = "",
  title,
}) {
  const content = paths[name];

  if (!content) {
    return null;
  }

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      focusable="false"
    >
      {title && <title>{title}</title>}
      {content}
    </svg>
  );
}

export default Icon;