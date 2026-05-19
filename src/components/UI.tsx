import { AlertTriangle, Info, Zap, CheckCircle, Terminal } from 'lucide-react'

/* ── Module header ────────────────────────────────────────────── */
export function ModuleHeader({ num, title, subtitle }: { num: string; title: string; subtitle: string }) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-[10px] font-mono tracking-[0.25em] uppercase" style={{ color: 'var(--color-amber-dim)' }}>
          Module {num}
        </span>
        <div className="h-px flex-1" style={{ background: 'var(--color-border)' }} />
      </div>
      <h2 className="text-3xl leading-tight mb-2" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--color-text)' }}>
        {title}
      </h2>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '15px', lineHeight: '1.6' }}>{subtitle}</p>
    </div>
  )
}

/* ── Section heading ──────────────────────────────────────────── */
export function SectionH({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-lg mb-3 mt-10 flex items-center gap-2" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--color-text)' }}>
      <span className="w-1 h-5 rounded-sm flex-shrink-0" style={{ background: 'var(--color-amber)' }} />
      {children}
    </h3>
  )
}

export function SubH({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-sm font-semibold mb-2 mt-6" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-text)' }}>
      {children}
    </h4>
  )
}

/* ── Callout boxes ────────────────────────────────────────────── */
type CalloutKind = 'info' | 'warn' | 'danger' | 'tip' | 'terminal'

const calloutStyles: Record<CalloutKind, { bg: string; border: string; iconColor: string; label: string; Icon: React.ElementType }> = {
  info:     { bg: 'oklch(15% 0.015 220 / 0.6)',  border: 'var(--color-steel-dim)',  iconColor: 'var(--color-steel)',  label: 'Note',    Icon: Info },
  warn:     { bg: 'oklch(15% 0.015 55 / 0.5)',   border: 'var(--color-amber-dim)', iconColor: 'var(--color-amber)', label: 'Caution', Icon: AlertTriangle },
  danger:   { bg: 'oklch(14% 0.015 25 / 0.6)',   border: 'var(--color-red-dim)',   iconColor: 'var(--color-red)',   label: 'Warning', Icon: Zap },
  tip:      { bg: 'oklch(14% 0.015 145 / 0.5)',  border: 'var(--color-green-dim)', iconColor: 'var(--color-green)', label: 'Field Tip', Icon: CheckCircle },
  terminal: { bg: 'oklch(12% 0.008 240)',         border: 'var(--color-border)',    iconColor: 'var(--color-amber)', label: 'Terminal',  Icon: Terminal },
}

export function Callout({ kind = 'info', children }: { kind?: CalloutKind; children: React.ReactNode }) {
  const s = calloutStyles[kind]
  return (
    <div className="rounded-lg p-4 my-5 flex gap-3" style={{ background: s.bg, border: `1px solid ${s.border}` }}>
      <s.Icon size={15} className="flex-shrink-0 mt-0.5" style={{ color: s.iconColor }} />
      <div className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
        <span className="font-semibold text-xs uppercase tracking-wider mr-2" style={{ color: s.iconColor }}>{s.label}:</span>
        {children}
      </div>
    </div>
  )
}

/* ── Code block ──────────────────────────────────────────────── */
export function Code({ children, label }: { children: string; label?: string }) {
  return (
    <div className="rounded-lg overflow-hidden my-4" style={{ border: '1px solid var(--color-border)' }}>
      {label && (
        <div className="px-3 py-1.5 flex items-center gap-2" style={{ background: 'var(--color-surface-raised)', borderBottom: '1px solid var(--color-border)' }}>
          <div className="flex gap-1.5 flex-shrink-0">
            <div className="w-2 h-2 rounded-full" style={{ background: 'var(--color-red-dim)' }} />
            <div className="w-2 h-2 rounded-full" style={{ background: 'var(--color-amber-dim)' }} />
            <div className="w-2 h-2 rounded-full" style={{ background: 'var(--color-green-dim)' }} />
          </div>
          <span className="text-[10px] font-mono ml-1 truncate" style={{ color: 'var(--color-text-faint)' }}>{label}</span>
        </div>
      )}
      <pre className="p-3 sm:p-4 overflow-x-auto text-xs sm:text-sm leading-relaxed" style={{ background: 'var(--color-surface)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', margin: 0, WebkitOverflowScrolling: 'touch' }}>
        <code>{children}</code>
      </pre>
    </div>
  )
}

/* ── Inline code ─────────────────────────────────────────────── */
export function IC({ children }: { children: React.ReactNode }) {
  return (
    <code className="px-1.5 py-0.5 rounded text-xs" style={{ background: 'var(--color-surface-raised)', color: 'var(--color-amber)', fontFamily: 'var(--font-mono)', border: '1px solid var(--color-border-subtle)' }}>
      {children}
    </code>
  )
}

/* ── Spec table ──────────────────────────────────────────────── */
export function SpecTable({ rows }: { rows: [string, string][] }) {
  return (
    <div className="rounded-lg overflow-hidden my-5" style={{ border: '1px solid var(--color-border)' }}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm" style={{ minWidth: '360px' }}>
          <tbody>
            {rows.map(([k, v], i) => (
              <tr key={i} style={{ borderBottom: i < rows.length - 1 ? '1px solid var(--color-border-subtle)' : 'none' }}>
                <td className="px-3 py-2.5 font-mono text-xs whitespace-nowrap" style={{ color: 'var(--color-amber-dim)', background: 'var(--color-surface)', width: '38%' }}>{k}</td>
                <td className="px-3 py-2.5 text-xs" style={{ color: 'var(--color-text-muted)', background: 'var(--color-bg)' }}>{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ── Feature grid ────────────────────────────────────────────── */
export function FeatureGrid({ items }: { items: { name: string; desc: string }[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-4">
      {items.map(item => (
        <div key={item.name} className="px-3 py-2.5 rounded-lg" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-subtle)' }}>
          <div className="text-xs font-semibold mb-0.5" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>{item.name}</div>
          <div className="text-xs" style={{ color: 'var(--color-text-faint)' }}>{item.desc}</div>
        </div>
      ))}
    </div>
  )
}

/* ── Step list ───────────────────────────────────────────────── */
export function Steps({ steps }: { steps: { title: string; body: React.ReactNode }[] }) {
  return (
    <ol className="space-y-4 my-5">
      {steps.map((s, i) => (
        <li key={i} className="flex gap-4">
          <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'var(--color-surface-raised)', border: '1px solid var(--color-amber-dim)', color: 'var(--color-amber)', fontFamily: 'var(--font-mono)' }}>
            {i + 1}
          </div>
          <div className="pt-0.5">
            <div className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-display)' }}>{s.title}</div>
            <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{s.body}</div>
          </div>
        </li>
      ))}
    </ol>
  )
}

/* ── Divider ─────────────────────────────────────────────────── */
export function Divider() {
  return (
    <div className="flex items-center gap-3 my-8">
      <div className="h-px flex-1" style={{ background: 'var(--color-border-subtle)' }} />
      <div className="w-1 h-1 rounded-full" style={{ background: 'var(--color-border)' }} />
      <div className="h-px flex-1" style={{ background: 'var(--color-border-subtle)' }} />
    </div>
  )
}

/* ── Tag / badge ─────────────────────────────────────────────── */
export function Tag({ children, color = 'amber' }: { children: React.ReactNode; color?: 'amber' | 'red' | 'green' | 'steel' | 'violet' }) {
  const colors = {
    amber:  { bg: 'var(--color-amber-glow)',             text: 'var(--color-amber)' },
    red:    { bg: 'oklch(14% 0.015 25 / 0.5)',           text: 'var(--color-red)' },
    green:  { bg: 'oklch(14% 0.015 145 / 0.5)',          text: 'var(--color-green)' },
    steel:  { bg: 'oklch(15% 0.015 220 / 0.5)',          text: 'var(--color-steel)' },
    violet: { bg: 'oklch(14% 0.015 290 / 0.5)',          text: 'var(--color-violet)' },
  }
  const c = colors[color]
  return (
    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold font-mono uppercase tracking-wider" style={{ background: c.bg, color: c.text }}>
      {children}
    </span>
  )
}
