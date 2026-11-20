// Piece pages float the site's name over the media, linking back to the Lab's home.
// The home page has no header: its hero carries the wordmark. Nothing here links to
// other sites; zills.io is the hub.
export function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-20 px-5 py-5 sm:px-7">
      <a href="/" className="text-xl font-extrabold tracking-[-0.03em] text-fg">
        Lab<span className="text-accent">.</span>
      </a>
    </header>
  )
}
