import type { KindFilter } from '@/lib/query'

const links: { kind: KindFilter; label: string }[] = [
  { kind: 'shaders', label: 'Shaders' },
  { kind: 'video', label: 'Video' },
  { kind: 'images', label: 'Images' },
  { kind: 'audio', label: 'Audio' },
]

// Floats over the hero. Only the site's own name and sections: zills.io is the hub.
export function Header({ onKind }: { onKind?: (kind: KindFilter) => void }) {
  return (
    <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-5 sm:px-7">
      <a href="/" className="text-xl font-extrabold tracking-[-0.03em] text-fg">
        Lab<span className="text-accent">.</span>
      </a>
      {onKind && (
        <nav aria-label="Kinds" className="hidden gap-5 text-[13px] text-zinc-300 sm:flex">
          {links.map((l) => (
            <a
              key={l.kind}
              href={`/?kind=${l.kind}#work`}
              onClick={(e) => {
                e.preventDefault()
                onKind(l.kind)
              }}
              className="transition-colors hover:text-fg"
            >
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}
