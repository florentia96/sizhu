// Dawn-sky mist veil - the main background is drawn by body::before (tokens.css)
// This layer adds faint "mist/stars" that tint per theme via --star-dot (light = lavender mist, dark = white stars)
export function Starfield() {
  return <div aria-hidden className="starfield" />;
}
