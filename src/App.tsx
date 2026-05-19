import { useState, useEffect, useRef } from 'react'
import { Menu, ChevronRight, Wifi, Cpu, Terminal, Shield, Radio, Bluetooth, Zap, BookOpen, AlertTriangle } from 'lucide-react'
import clsx from 'clsx'

import ModuleHardware from './modules/Hardware'
import ModuleInstallation from './modules/Installation'
import ModuleWiFiTheory from './modules/WiFiTheory'
import ModuleScanning from './modules/Scanning'
import ModuleWiFiAttacks from './modules/WiFiAttacks'
import ModuleNetworkAttacks from './modules/NetworkAttacks'
import ModuleBluetoothUSB from './modules/BluetoothUSB'
import ModuleAdvanced from './modules/Advanced'
import ModuleGlossary from './modules/Glossary'

export type ModuleId =
  | 'hardware' | 'installation' | 'wifi-theory' | 'scanning'
  | 'wifi-attacks' | 'network-attacks' | 'bluetooth-usb' | 'advanced' | 'glossary'

interface NavItem { id: ModuleId; label: string; subtitle: string; icon: React.ReactNode; color: string }

const NAV: NavItem[] = [
  { id: 'hardware',        label: '01 — Hardware',         subtitle: 'Cardputer anatomy',     icon: <Cpu size={14} />,       color: 'text-amber' },
  { id: 'installation',    label: '02 — Installation',     subtitle: 'Firmware & SD setup',   icon: <Terminal size={14} />,  color: 'text-amber' },
  { id: 'wifi-theory',     label: '03 — WiFi Theory',      subtitle: '802.11 fundamentals',   icon: <Wifi size={14} />,      color: 'text-steel' },
  { id: 'scanning',        label: '04 — Scanning & Recon', subtitle: 'Passive intelligence',  icon: <Radio size={14} />,     color: 'text-steel' },
  { id: 'wifi-attacks',    label: '05 — WiFi Attacks',     subtitle: 'Karma, twins & deauth', icon: <Shield size={14} />,    color: 'text-red' },
  { id: 'network-attacks', label: '06 — Network Attacks',  subtitle: 'DHCP, DNS, NTLM',      icon: <Zap size={14} />,       color: 'text-red' },
  { id: 'bluetooth-usb',   label: '07 — BT & USB',         subtitle: 'BadUSB & BLE attacks',  icon: <Bluetooth size={14} />, color: 'text-violet' },
  { id: 'advanced',        label: '08 — Advanced',         subtitle: 'Wardriving, IMSI, RF',  icon: <Radio size={14} />,     color: 'text-violet' },
  { id: 'glossary',        label: '09 — Glossary',         subtitle: 'Key terms',             icon: <BookOpen size={14} />,  color: 'text-green' },
]

const MODULES: Record<ModuleId, React.ReactNode> = {
  'hardware':        <ModuleHardware />,
  'installation':    <ModuleInstallation />,
  'wifi-theory':     <ModuleWiFiTheory />,
  'scanning':        <ModuleScanning />,
  'wifi-attacks':    <ModuleWiFiAttacks />,
  'network-attacks': <ModuleNetworkAttacks />,
  'bluetooth-usb':   <ModuleBluetoothUSB />,
  'advanced':        <ModuleAdvanced />,
  'glossary':        <ModuleGlossary />,
}

export default function App() {
  const [active, setActive] = useState<ModuleId>('hardware')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: 'instant' })
    setSidebarOpen(false)
  }, [active])

  const currentIdx = NAV.findIndex(n => n.id === active)
  const prev = NAV[currentIdx - 1]
  const next = NAV[currentIdx + 1]

  const colorMap: Record<string, string> = {
    'text-amber': 'var(--color-amber)',
    'text-steel': 'var(--color-steel)',
    'text-red': 'var(--color-red)',
    'text-violet': 'var(--color-violet)',
    'text-green': 'var(--color-green)',
  }

  return (
    <div className="flex w-full min-h-screen relative">
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={clsx(
        'fixed top-0 left-0 z-40 h-screen w-68 flex flex-col transition-transform duration-300',
        'border-r',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )} style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)', width: '272px' }}>
        <div className="px-5 pt-6 pb-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--color-amber)' }} />
            <span className="text-[9px] tracking-[0.25em] uppercase font-mono" style={{ color: 'var(--color-amber-dim)' }}>
              For Educational Use Only
            </span>
          </div>
          <h1 className="text-lg leading-tight" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--color-text)' }}>
            Evil Cardputer
            <span className="block" style={{ color: 'var(--color-amber)' }}>Field Manual</span>
          </h1>
          <p className="text-[10px] mt-1 font-mono" style={{ color: 'var(--color-text-faint)' }}>
            Evil-M5Project · M5Stack Cardputer
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto py-2 px-2">
          {NAV.map(item => {
            const isActive = active === item.id
            return (
              <button
                key={item.id}
                onClick={() => { setActive(item.id); setSidebarOpen(false) }}
                className="w-full text-left px-3 py-2 rounded mb-0.5 flex items-center gap-3 transition-all duration-150 group"
                style={{
                  background: isActive ? 'var(--color-surface-raised)' : 'transparent',
                  border: `1px solid ${isActive ? 'var(--color-border)' : 'transparent'}`,
                }}
              >
                <span style={{ color: isActive ? colorMap[item.color] : 'var(--color-text-faint)', flexShrink: 0 }}>
                  {item.icon}
                </span>
                <div className="min-w-0">
                  <div className="text-xs leading-tight truncate" style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? 'var(--color-text)' : 'var(--color-text-muted)',
                  }}>
                    {item.label}
                  </div>
                  <div className="text-[10px] mt-0.5" style={{ color: 'var(--color-text-faint)' }}>{item.subtitle}</div>
                </div>
                {isActive && <ChevronRight size={11} className="ml-auto flex-shrink-0" style={{ color: 'var(--color-amber)' }} />}
              </button>
            )
          })}
        </nav>

        <div className="px-4 py-3" style={{ borderTop: '1px solid var(--color-border)' }}>
          <div className="flex items-start gap-2 text-[10px] leading-tight" style={{ color: 'var(--color-text-faint)' }}>
            <AlertTriangle size={11} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--color-amber-dim)' }} />
            <span>Only test on networks and devices you own or have explicit written permission to access.</span>
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-h-screen" style={{ marginLeft: '0' }}>
        <style>{`@media (min-width: 1024px) { .main-offset { margin-left: 272px; } }`}</style>
        <div className="main-offset flex flex-col min-h-screen">
          {/* Mobile bar */}
          <div className="lg:hidden sticky top-0 z-20 flex items-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded" style={{ color: 'var(--color-text-muted)' }}>
              <Menu size={18} />
            </button>
            <span className="text-sm" style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--color-text)' }}>
              {NAV.find(n => n.id === active)?.label}
            </span>
          </div>

          <div ref={contentRef} className="flex-1">
            <div className="max-w-4xl mx-auto px-5 py-10 lg:px-10 module-enter" key={active}>
              {MODULES[active]}
            </div>

            {/* Prev/Next */}
            <div className="max-w-4xl mx-auto px-5 lg:px-10 pb-16 flex justify-between gap-4">
              {prev ? (
                <button onClick={() => setActive(prev.id)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors text-sm group"
                  style={{ border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-amber-dim)'; (e.currentTarget as HTMLElement).style.color = 'var(--color-amber)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)'; (e.currentTarget as HTMLElement).style.color = 'var(--color-text-muted)' }}
                >
                  <ChevronRight size={13} style={{ transform: 'rotate(180deg)' }} />
                  <div className="text-left">
                    <div className="text-[9px] uppercase tracking-wider opacity-50">Previous</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '12px' }}>{prev.label}</div>
                  </div>
                </button>
              ) : <div />}
              {next ? (
                <button onClick={() => setActive(next.id)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors text-sm group ml-auto"
                  style={{ border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-amber-dim)'; (e.currentTarget as HTMLElement).style.color = 'var(--color-amber)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)'; (e.currentTarget as HTMLElement).style.color = 'var(--color-text-muted)' }}
                >
                  <div className="text-right">
                    <div className="text-[9px] uppercase tracking-wider opacity-50">Next</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '12px' }}>{next.label}</div>
                  </div>
                  <ChevronRight size={13} />
                </button>
              ) : <div />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
