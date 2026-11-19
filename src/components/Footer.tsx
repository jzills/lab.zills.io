// Every zills site's footer: the Z/LLS mark and the way back to the hub.
export function Footer() {
  return (
    <footer className="flex items-center justify-between border-t border-border/60 px-5 py-6 font-mono text-[11px] text-muted sm:px-7">
      <span className="font-sans text-sm font-extrabold tracking-[-0.03em] text-fg">
        Z<span className="font-semibold text-fg/55">/</span>LLS
      </span>
      <a href="https://zills.io/" className="transition-colors hover:text-fg">
        zills.io <span aria-hidden="true">↗</span>
      </a>
    </footer>
  )
}
