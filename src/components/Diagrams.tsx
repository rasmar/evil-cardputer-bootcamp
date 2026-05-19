/* All SVG/visual diagrams for the bootcamp */

/* ── OSI Model ───────────────────────────────────────────────── */
export function OSIModel() {
  const layers = [
    { n: 7, name: 'Application',  ex: 'HTTP, DNS, DHCP',   color: '#7c3aed', h: 'var(--color-violet)' },
    { n: 6, name: 'Presentation', ex: 'TLS/SSL, encoding', color: '#2563eb', h: 'var(--color-steel)' },
    { n: 5, name: 'Session',      ex: 'Sessions, sockets', color: '#0369a1', h: 'var(--color-steel-dim)' },
    { n: 4, name: 'Transport',    ex: 'TCP, UDP',           color: '#0f766e', h: 'var(--color-green)' },
    { n: 3, name: 'Network',      ex: 'IP, ICMP, routing', color: '#15803d', h: 'var(--color-green)' },
    { n: 2, name: 'Data Link',    ex: '802.11 frames, MAC', color: '#b45309', h: 'var(--color-amber)' },
    { n: 1, name: 'Physical',     ex: 'Radio waves, bits', color: '#b91c1c', h: 'var(--color-red)' },
  ]
  return (
    <div className="diagram-bg rounded-xl p-5 my-6" style={{ border: '1px solid var(--color-border)' }}>
      <div className="text-[10px] font-mono uppercase tracking-widest mb-4" style={{ color: 'var(--color-text-faint)' }}>
        OSI Reference Model — WiFi operates primarily at layers 1 & 2
      </div>
      <div className="flex gap-3">
        {/* Left label */}
        <div className="flex flex-col justify-between py-1 text-right pr-2" style={{ minWidth: '80px' }}>
          <span className="text-[9px] font-mono" style={{ color: 'var(--color-text-faint)' }}>Software</span>
          <span className="text-[9px] font-mono" style={{ color: 'var(--color-text-faint)' }}>Hardware</span>
        </div>
        {/* Stack */}
        <div className="flex-1">
          {layers.map((l, i) => (
            <div key={l.n} className="flex items-center gap-3 mb-1"
              style={{ opacity: i > 1 ? 0.7 : 1 }}>
              <div className="flex-shrink-0 w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold font-mono"
                style={{ background: `${l.color}22`, border: `1px solid ${l.color}55`, color: l.h }}>
                {l.n}
              </div>
              <div className="flex-1 px-3 py-1.5 rounded flex items-center justify-between"
                style={{ background: `${l.color}11`, border: `1px solid ${l.color}33` }}>
                <span className="text-xs font-semibold" style={{ color: l.h, fontFamily: 'var(--font-display)' }}>{l.name}</span>
                <span className="text-[10px] font-mono hidden sm:block" style={{ color: 'var(--color-text-faint)' }}>{l.ex}</span>
              </div>
            </div>
          ))}
        </div>
        {/* WiFi annotation */}
        <div className="flex flex-col justify-end pb-1" style={{ minWidth: '60px' }}>
          <div className="flex flex-col items-center">
            <div className="w-px flex-1 min-h-[44px]" style={{ background: 'var(--color-amber-dim)' }} />
            <div className="text-[9px] font-mono text-center px-1 py-1 rounded" style={{ background: 'var(--color-amber-glow)', color: 'var(--color-amber)', border: '1px solid var(--color-amber-dim)' }}>
              WiFi<br />Layer 1+2
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3 text-[11px]" style={{ color: 'var(--color-text-faint)' }}>
        Evil-M5Project attacks happen primarily at <span style={{ color: 'var(--color-amber)' }}>Layer 2</span> (802.11 management frames) and <span style={{ color: 'var(--color-green)' }}>Layer 3–4</span> (IP spoofing, DHCP, DNS).
      </div>
    </div>
  )
}

/* ── 802.11 Frame ────────────────────────────────────────────── */
export function WiFiFrameDiagram() {
  const fields = [
    { name: 'Frame\nControl', bytes: '2', color: 'var(--color-amber)', desc: 'Type, subtype, flags' },
    { name: 'Duration\n/ ID', bytes: '2', color: 'var(--color-amber-dim)', desc: '' },
    { name: 'Addr 1\n(Dest)', bytes: '6', color: 'var(--color-steel)', desc: 'Destination MAC' },
    { name: 'Addr 2\n(Src)', bytes: '6', color: 'var(--color-steel)', desc: 'Source MAC' },
    { name: 'Addr 3\n(BSSID)', bytes: '6', color: 'var(--color-steel)', desc: 'AP MAC address' },
    { name: 'Seq\nCtrl', bytes: '2', color: 'var(--color-violet)', desc: '' },
    { name: 'Payload\n(variable)', bytes: '0–2304', color: 'var(--color-green)', desc: 'Data or management body' },
    { name: 'FCS\nCRC', bytes: '4', color: 'var(--color-red)', desc: 'Frame check sequence' },
  ]
  return (
    <div className="diagram-bg rounded-xl p-5 my-6" style={{ border: '1px solid var(--color-border)' }}>
      <div className="text-[10px] font-mono uppercase tracking-widest mb-4" style={{ color: 'var(--color-text-faint)' }}>
        802.11 MAC Frame Structure (bytes)
      </div>
      <div className="flex flex-wrap gap-px" style={{ background: 'var(--color-border)' }}>
        {fields.map(f => (
          <div key={f.name} className="flex flex-col items-center justify-center text-center py-2 px-1" style={{
            minWidth: f.bytes === '0–2304' ? '120px' : '60px',
            flex: f.bytes === '0–2304' ? '2' : '1',
            background: 'var(--color-surface)',
            borderTop: `2px solid ${f.color}`,
          }}>
            <div className="text-[9px] font-mono leading-tight whitespace-pre-line" style={{ color: f.color }}>{f.name}</div>
            <div className="text-[8px] mt-1" style={{ color: 'var(--color-text-faint)' }}>{f.bytes}B</div>
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
        {fields.filter(f => f.desc).map(f => (
          <div key={f.name} className="text-[10px] flex items-start gap-1.5">
            <span className="w-2 h-2 rounded-sm flex-shrink-0 mt-0.5" style={{ background: f.color }} />
            <span style={{ color: 'var(--color-text-faint)' }}>
              <span style={{ color: f.color }}>{f.name.replace('\n', ' ')}</span> — {f.desc}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Management frame types ──────────────────────────────────── */
export function FrameTypeTable() {
  const rows = [
    ['Beacon',            '0x08', 'AP broadcasts its existence every ~100ms', 'Passive'],
    ['Probe Request',     '0x04', 'Client asks "is [SSID] here?"',            'Client → Air'],
    ['Probe Response',    '0x05', 'AP replies with its capabilities',         'AP → Client'],
    ['Authentication',   '0x0b', 'Open/shared key auth handshake',           'Both'],
    ['Association Req',  '0x00', 'Client requests to join AP',               'Client → AP'],
    ['Deauthentication', '0x0c', 'Forcefully disconnect a station',         '⚡ Abused'],
    ['Disassociation',   '0x0a', 'Gracefully leave the BSS',               '⚡ Abused'],
  ]
  return (
    <div className="rounded-xl overflow-hidden my-5" style={{ border: '1px solid var(--color-border)' }}>
      <table className="w-full text-xs">
        <thead>
          <tr style={{ background: 'var(--color-surface-raised)', borderBottom: '1px solid var(--color-border)' }}>
            {['Frame Type', 'Subtype', 'Purpose', 'Direction'].map(h => (
              <th key={h} className="px-3 py-2 text-left font-semibold" style={{ color: 'var(--color-amber)', fontFamily: 'var(--font-display)' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{ borderBottom: i < rows.length-1 ? '1px solid var(--color-border-subtle)' : 'none', background: r[3].includes('⚡') ? 'oklch(14% 0.015 25 / 0.2)' : 'transparent' }}>
              <td className="px-3 py-2 font-mono" style={{ color: r[3].includes('⚡') ? 'var(--color-red)' : 'var(--color-text)' }}>{r[0]}</td>
              <td className="px-3 py-2 font-mono text-[10px]" style={{ color: 'var(--color-text-faint)' }}>{r[1]}</td>
              <td className="px-3 py-2" style={{ color: 'var(--color-text-muted)' }}>{r[2]}</td>
              <td className="px-3 py-2" style={{ color: r[3].includes('⚡') ? 'var(--color-red)' : 'var(--color-text-faint)' }}>{r[3]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ── Probe Request Flow ──────────────────────────────────────── */
export function ProbeRequestFlow() {
  return (
    <div className="diagram-bg rounded-xl p-5 my-6" style={{ border: '1px solid var(--color-border)' }}>
      <div className="text-[10px] font-mono uppercase tracking-widest mb-5" style={{ color: 'var(--color-text-faint)' }}>
        Probe Request / Response Flow
      </div>
      <svg viewBox="0 0 600 200" className="w-full" style={{ maxHeight: '200px' }}>
        {/* Phone/client */}
        <rect x="20" y="60" width="80" height="80" rx="8" fill="oklch(18% 0.02 240)" stroke="var(--color-steel)" strokeWidth="1.5"/>
        <text x="60" y="95" textAnchor="middle" fill="var(--color-steel)" fontSize="10" fontFamily="var(--font-display)" fontWeight="600">Client</text>
        <text x="60" y="108" textAnchor="middle" fill="var(--color-text-faint)" fontSize="8">(your phone)</text>
        <text x="60" y="122" textAnchor="middle" fill="var(--color-text-faint)" fontSize="8">Saved SSIDs:</text>
        <text x="60" y="133" textAnchor="middle" fill="var(--color-amber)" fontSize="7">HomeWifi, Work</text>

        {/* Arrow: probe request */}
        <line x1="105" y1="95" x2="250" y2="95" stroke="var(--color-amber)" strokeWidth="1.5" strokeDasharray="5,3" className="flow-arrow"/>
        <polygon points="250,90 262,95 250,100" fill="var(--color-amber)"/>
        <text x="183" y="83" textAnchor="middle" fill="var(--color-amber)" fontSize="9">Probe Request</text>
        <text x="183" y="75" textAnchor="middle" fill="var(--color-text-faint)" fontSize="7">"Is 'HomeWifi' around?"</text>

        {/* Broadcast cloud / air */}
        <ellipse cx="300" cy="100" rx="40" ry="28" fill="oklch(15% 0.01 240)" stroke="var(--color-border)" strokeWidth="1"/>
        <text x="300" y="96" textAnchor="middle" fill="var(--color-text-faint)" fontSize="8">802.11</text>
        <text x="300" y="107" textAnchor="middle" fill="var(--color-text-faint)" fontSize="8">Broadcast</text>

        {/* Arrow: probe response from real AP */}
        <line x1="340" y1="85" x2="460" y2="70" stroke="var(--color-green)" strokeWidth="1.5" strokeDasharray="5,3" className="flow-arrow"/>
        <polygon points="460,65 472,70 460,78" fill="var(--color-green)"/>
        <text x="410" y="62" textAnchor="middle" fill="var(--color-green)" fontSize="8">Probe Response</text>
        <text x="410" y="72" textAnchor="middle" fill="var(--color-text-faint)" fontSize="7">"Yes! I'm HomeWifi, ch6…"</text>

        {/* Real AP */}
        <rect x="470" y="40" width="110" height="55" rx="6" fill="oklch(14% 0.015 145 / 0.5)" stroke="var(--color-green)" strokeWidth="1.5"/>
        <text x="525" y="63" textAnchor="middle" fill="var(--color-green)" fontSize="10" fontFamily="var(--font-display)" fontWeight="600">Legitimate</text>
        <text x="525" y="76" textAnchor="middle" fill="var(--color-green)" fontSize="9">AP "HomeWifi"</text>
        <text x="525" y="87" textAnchor="middle" fill="var(--color-text-faint)" fontSize="7">ch6, WPA2</text>

        {/* Arrow: Karma — evil AP also responds */}
        <line x1="340" y1="115" x2="460" y2="145" stroke="var(--color-red)" strokeWidth="1.5" strokeDasharray="5,3" className="flow-arrow"/>
        <polygon points="460,142 472,148 458,152" fill="var(--color-red)"/>
        <text x="410" y="140" textAnchor="middle" fill="var(--color-red)" fontSize="8">Karma Response</text>
        <text x="410" y="150" textAnchor="middle" fill="var(--color-text-faint)" fontSize="7">"I'm HomeWifi too!" (Evil AP)</text>

        {/* Evil AP */}
        <rect x="470" y="130" width="110" height="55" rx="6" fill="oklch(14% 0.015 25 / 0.3)" stroke="var(--color-red)" strokeWidth="1.5"/>
        <text x="525" y="153" textAnchor="middle" fill="var(--color-red)" fontSize="10" fontFamily="var(--font-display)" fontWeight="600">Evil Twin</text>
        <text x="525" y="166" textAnchor="middle" fill="var(--color-red)" fontSize="9">Cardputer AP</text>
        <text x="525" y="177" textAnchor="middle" fill="var(--color-text-faint)" fontSize="7">stronger signal</text>
      </svg>
    </div>
  )
}

/* ── WPA2 4-way Handshake ─────────────────────────────────────── */
export function HandshakeDiagram() {
  return (
    <div className="diagram-bg rounded-xl p-5 my-6" style={{ border: '1px solid var(--color-border)' }}>
      <div className="text-[10px] font-mono uppercase tracking-widest mb-4" style={{ color: 'var(--color-text-faint)' }}>
        WPA2 EAPOL 4-Way Handshake
      </div>
      <svg viewBox="0 0 560 280" className="w-full" style={{ maxHeight: '280px' }}>
        {/* Columns */}
        <text x="110" y="22" textAnchor="middle" fill="var(--color-steel)" fontSize="11" fontFamily="var(--font-display)" fontWeight="600">Client (STA)</text>
        <text x="450" y="22" textAnchor="middle" fill="var(--color-green)" fontSize="11" fontFamily="var(--font-display)" fontWeight="600">Access Point (AP)</text>

        {/* Lifelines */}
        <line x1="110" y1="28" x2="110" y2="275" stroke="var(--color-steel)" strokeWidth="1" strokeDasharray="4,3" opacity="0.4"/>
        <line x1="450" y1="28" x2="450" y2="275" stroke="var(--color-green)" strokeWidth="1" strokeDasharray="4,3" opacity="0.4"/>

        {/* Message 1: ANonce */}
        <line x1="445" y1="55" x2="115" y2="55" stroke="var(--color-green)" strokeWidth="1.5" className="flow-arrow" strokeDasharray="5,3"/>
        <polygon points="115,50 103,55 115,60" fill="var(--color-green)"/>
        <rect x="190" y="43" width="180" height="24" rx="4" fill="oklch(14% 0.015 145 / 0.3)" stroke="var(--color-green)" strokeWidth="0.8"/>
        <text x="280" y="56" textAnchor="middle" fill="var(--color-green)" fontSize="9" fontWeight="600">MSG 1 — ANonce</text>
        <text x="280" y="66" textAnchor="middle" fill="var(--color-text-faint)" fontSize="8">AP random nonce</text>

        {/* Client computes PTK */}
        <rect x="20" y="82" width="180" height="28" rx="4" fill="oklch(15% 0.015 220 / 0.3)" stroke="var(--color-steel-dim)" strokeWidth="0.8"/>
        <text x="110" y="96" textAnchor="middle" fill="var(--color-steel)" fontSize="8">Client generates SNonce</text>
        <text x="110" y="106" textAnchor="middle" fill="var(--color-text-faint)" fontSize="7">Derives PTK from PSK+ANonce+SNonce</text>

        {/* Message 2: SNonce + MIC */}
        <line x1="115" y1="125" x2="445" y2="125" stroke="var(--color-steel)" strokeWidth="1.5" className="flow-arrow" strokeDasharray="5,3"/>
        <polygon points="445,120 457,125 445,130" fill="var(--color-steel)"/>
        <rect x="190" y="113" width="180" height="24" rx="4" fill="oklch(15% 0.015 220 / 0.3)" stroke="var(--color-steel)" strokeWidth="0.8"/>
        <text x="280" y="126" textAnchor="middle" fill="var(--color-steel)" fontSize="9" fontWeight="600">MSG 2 — SNonce + MIC</text>
        <text x="280" y="136" textAnchor="middle" fill="var(--color-text-faint)" fontSize="8">Client nonce + integrity check</text>

        {/* AP computes PTK */}
        <rect x="360" y="148" width="180" height="20" rx="4" fill="oklch(14% 0.015 145 / 0.3)" stroke="var(--color-green-dim)" strokeWidth="0.8"/>
        <text x="450" y="162" textAnchor="middle" fill="var(--color-green)" fontSize="8">AP also derives PTK — verifies MIC ✓</text>

        {/* Message 3: GTK */}
        <line x1="445" y1="185" x2="115" y2="185" stroke="var(--color-amber)" strokeWidth="1.5" className="flow-arrow" strokeDasharray="5,3"/>
        <polygon points="115,180 103,185 115,190" fill="var(--color-amber)"/>
        <rect x="190" y="173" width="180" height="24" rx="4" fill="var(--color-amber-glow)" stroke="var(--color-amber-dim)" strokeWidth="0.8"/>
        <text x="280" y="186" textAnchor="middle" fill="var(--color-amber)" fontSize="9" fontWeight="600">MSG 3 — GTK (encrypted)</text>
        <text x="280" y="196" textAnchor="middle" fill="var(--color-text-faint)" fontSize="8">Group Temporal Key + MIC</text>

        {/* Message 4: ACK */}
        <line x1="115" y1="240" x2="445" y2="240" stroke="var(--color-amber)" strokeWidth="1.5" className="flow-arrow" strokeDasharray="5,3"/>
        <polygon points="445,235 457,240 445,245" fill="var(--color-amber)"/>
        <rect x="190" y="228" width="180" height="24" rx="4" fill="var(--color-amber-glow)" stroke="var(--color-amber-dim)" strokeWidth="0.8"/>
        <text x="280" y="241" textAnchor="middle" fill="var(--color-amber)" fontSize="9" fontWeight="600">MSG 4 — ACK</text>
        <text x="280" y="251" textAnchor="middle" fill="var(--color-text-faint)" fontSize="8">Handshake complete — data begins</text>

        {/* Sniff label */}
        <text x="280" y="270" textAnchor="middle" fill="var(--color-red)" fontSize="9">⚡ Capturing MSG 2 (SNonce+MIC) allows offline dictionary attack</text>
      </svg>
    </div>
  )
}

/* ── Deauth Attack Diagram ────────────────────────────────────── */
export function DeauthDiagram() {
  return (
    <div className="diagram-bg rounded-xl p-5 my-6" style={{ border: '1px solid var(--color-border)' }}>
      <div className="text-[10px] font-mono uppercase tracking-widest mb-4" style={{ color: 'var(--color-text-faint)' }}>
        Deauthentication Attack — 802.11 Management Frame Abuse
      </div>
      <svg viewBox="0 0 580 200" className="w-full" style={{ maxHeight: '200px' }}>
        {/* Cardputer */}
        <rect x="10" y="65" width="110" height="70" rx="8" fill="oklch(14% 0.015 25 / 0.3)" stroke="var(--color-red)" strokeWidth="1.5"/>
        <text x="65" y="90" textAnchor="middle" fill="var(--color-red)" fontSize="10" fontFamily="var(--font-display)" fontWeight="700">Cardputer</text>
        <text x="65" y="105" textAnchor="middle" fill="var(--color-text-faint)" fontSize="8">Spoofs AP MAC</text>
        <text x="65" y="118" textAnchor="middle" fill="var(--color-text-faint)" fontSize="8">address</text>

        {/* Arrow to client */}
        <line x1="125" y1="130" x2="265" y2="150" stroke="var(--color-red)" strokeWidth="1.5"/>
        <polygon points="265,147 275,153 262,157" fill="var(--color-red)"/>
        <text x="195" y="135" textAnchor="middle" fill="var(--color-red)" fontSize="8" fontWeight="600">Deauth Frame</text>
        <text x="195" y="145" textAnchor="middle" fill="var(--color-text-faint)" fontSize="7">From: AP_MAC → To: Client_MAC</text>
        <text x="195" y="155" textAnchor="middle" fill="var(--color-text-faint)" fontSize="7">Reason: Class 3 frame recv'd (RC=7)</text>

        {/* Arrow to AP */}
        <line x1="125" y1="85" x2="265" y2="60" stroke="var(--color-red)" strokeWidth="1.5"/>
        <polygon points="265,57 275,62 262,66" fill="var(--color-red)"/>
        <text x="195" y="55" textAnchor="middle" fill="var(--color-red)" fontSize="8" fontWeight="600">Deauth Frame</text>
        <text x="195" y="65" textAnchor="middle" fill="var(--color-text-faint)" fontSize="7">From: Client_MAC → To: AP_MAC</text>
        <text x="195" y="75" textAnchor="middle" fill="var(--color-text-faint)" fontSize="7">Spoofs client's address too</text>

        {/* AP */}
        <rect x="275" y="28" width="100" height="55" rx="6" fill="oklch(14% 0.015 145 / 0.3)" stroke="var(--color-green)" strokeWidth="1.5"/>
        <text x="325" y="52" textAnchor="middle" fill="var(--color-green)" fontSize="10" fontFamily="var(--font-display)" fontWeight="600">AP</text>
        <text x="325" y="65" textAnchor="middle" fill="var(--color-text-faint)" fontSize="8">Disconnects client</text>
        <text x="325" y="75" textAnchor="middle" fill="var(--color-text-faint)" fontSize="7">(trusts deauth frames)</text>

        {/* Client */}
        <rect x="275" y="130" width="100" height="55" rx="6" fill="oklch(15% 0.015 220 / 0.3)" stroke="var(--color-steel)" strokeWidth="1.5"/>
        <text x="325" y="153" textAnchor="middle" fill="var(--color-steel)" fontSize="10" fontFamily="var(--font-display)" fontWeight="600">Client</text>
        <text x="325" y="166" textAnchor="middle" fill="var(--color-text-faint)" fontSize="8">Disconnected</text>
        <text x="325" y="176" textAnchor="middle" fill="var(--color-text-faint)" fontSize="7">Will re-connect → handshake</text>

        {/* Re-auth arrow */}
        <line x1="375" y1="155" x2="450" y2="130" stroke="var(--color-amber)" strokeWidth="1" strokeDasharray="4,3"/>
        <polygon points="450,127 460,132 448,136" fill="var(--color-amber)"/>

        {/* Handshake capture box */}
        <rect x="458" y="90" width="115" height="75" rx="6" fill="var(--color-amber-glow)" stroke="var(--color-amber-dim)" strokeWidth="1.5"/>
        <text x="515" y="110" textAnchor="middle" fill="var(--color-amber)" fontSize="9" fontWeight="700">Cardputer</text>
        <text x="515" y="122" textAnchor="middle" fill="var(--color-amber)" fontSize="8">Sniffs Handshake</text>
        <text x="515" y="134" textAnchor="middle" fill="var(--color-text-faint)" fontSize="7">Captures EAPOL</text>
        <text x="515" y="145" textAnchor="middle" fill="var(--color-text-faint)" fontSize="7">frames during</text>
        <text x="515" y="156" textAnchor="middle" fill="var(--color-text-faint)" fontSize="7">re-association</text>
      </svg>
      <div className="mt-3 text-[11px] p-3 rounded" style={{ background: 'oklch(14% 0.015 25 / 0.3)', border: '1px solid var(--color-red-dim)', color: 'var(--color-text-faint)' }}>
        <span style={{ color: 'var(--color-red)' }}>Key insight:</span> 802.11 management frames (including deauth) are <strong style={{ color: 'var(--color-text)' }}>unauthenticated by default</strong> in WPA2. Anyone can forge them. WPA3 introduces Management Frame Protection (MFP/802.11w) to address this.
      </div>
    </div>
  )
}

/* ── Evil Twin / Captive Portal ──────────────────────────────── */
export function EvilTwinDiagram() {
  return (
    <div className="diagram-bg rounded-xl p-5 my-6" style={{ border: '1px solid var(--color-border)' }}>
      <div className="text-[10px] font-mono uppercase tracking-widest mb-4" style={{ color: 'var(--color-text-faint)' }}>
        Evil Twin + Captive Portal Attack Chain
      </div>
      <svg viewBox="0 0 580 230" className="w-full" style={{ maxHeight: '230px' }}>
        {/* Steps numbered */}
        {[
          { n: '1', x: 30,  y: 30,  label: 'Scan & Clone', sub: 'Copy real AP SSID' },
          { n: '2', x: 165, y: 30,  label: 'Deauth Client', sub: 'Kick from real AP' },
          { n: '3', x: 300, y: 30,  label: 'Client Connects', sub: 'Joins evil twin' },
          { n: '4', x: 435, y: 30,  label: 'Captive Portal', sub: 'Fake login page' },
        ].map(s => (
          <g key={s.n}>
            <circle cx={s.x + 45} cy={s.y + 15} r="14" fill="oklch(14% 0.015 55 / 0.5)" stroke="var(--color-amber)" strokeWidth="1.5"/>
            <text x={s.x + 45} y={s.y + 20} textAnchor="middle" fill="var(--color-amber)" fontSize="10" fontWeight="700" fontFamily="var(--font-display)">{s.n}</text>
            <text x={s.x + 45} y={s.y + 42} textAnchor="middle" fill="var(--color-text)" fontSize="9" fontWeight="600">{s.label}</text>
            <text x={s.x + 45} y={s.y + 53} textAnchor="middle" fill="var(--color-text-faint)" fontSize="8">{s.sub}</text>
          </g>
        ))}
        {/* Connecting arrows between steps */}
        {[120, 255, 390].map(x => (
          <line key={x} x1={x} y1={45} x2={x + 30} y2={45} stroke="var(--color-amber-dim)" strokeWidth="1" strokeDasharray="3,2"/>
        ))}

        {/* Network topology */}
        {/* Real AP */}
        <rect x="20" y="110" width="90" height="50" rx="6" fill="oklch(14% 0.015 145 / 0.3)" stroke="var(--color-green-dim)" strokeWidth="1"/>
        <text x="65" y="132" textAnchor="middle" fill="var(--color-green)" fontSize="9" fontWeight="600">Real AP</text>
        <text x="65" y="144" textAnchor="middle" fill="var(--color-text-faint)" fontSize="7">HomeWifi, ch6</text>
        <text x="65" y="154" textAnchor="middle" fill="var(--color-text-faint)" fontSize="7">-70 dBm signal</text>

        {/* Evil AP (Cardputer) */}
        <rect x="155" y="105" width="105" height="60" rx="6" fill="oklch(14% 0.015 25 / 0.3)" stroke="var(--color-red)" strokeWidth="1.5"/>
        <text x="207" y="127" textAnchor="middle" fill="var(--color-red)" fontSize="9" fontWeight="700">Evil Twin AP</text>
        <text x="207" y="139" textAnchor="middle" fill="var(--color-amber)" fontSize="8">HomeWifi, ch6</text>
        <text x="207" y="149" textAnchor="middle" fill="var(--color-text-faint)" fontSize="7">Same SSID, no password</text>
        <text x="207" y="158" textAnchor="middle" fill="var(--color-red)" fontSize="7">-40 dBm (stronger!)</text>

        {/* Client */}
        <rect x="320" y="115" width="90" height="45" rx="6" fill="oklch(15% 0.015 220 / 0.3)" stroke="var(--color-steel)" strokeWidth="1"/>
        <text x="365" y="137" textAnchor="middle" fill="var(--color-steel)" fontSize="9" fontWeight="600">Client</text>
        <text x="365" y="149" textAnchor="middle" fill="var(--color-text-faint)" fontSize="7">Auto-connects to</text>
        <text x="365" y="157" textAnchor="middle" fill="var(--color-text-faint)" fontSize="7">strongest signal</text>

        {/* Captive portal */}
        <rect x="450" y="105" width="120" height="60" rx="6" fill="var(--color-amber-glow)" stroke="var(--color-amber-dim)" strokeWidth="1.5"/>
        <text x="510" y="127" textAnchor="middle" fill="var(--color-amber)" fontSize="9" fontWeight="700">Fake Login</text>
        <text x="510" y="139" textAnchor="middle" fill="var(--color-text-faint)" fontSize="7">Cloned from:</text>
        <text x="510" y="149" textAnchor="middle" fill="var(--color-text-faint)" fontSize="7">ISP/hotel portal</text>
        <text x="510" y="159" textAnchor="middle" fill="var(--color-amber)" fontSize="7">Creds saved to SD</text>

        {/* Arrows */}
        <line x1="260" y1="135" x2="318" y2="137" stroke="var(--color-red)" strokeWidth="1.5"/>
        <polygon points="318,133 329,137 318,141" fill="var(--color-red)"/>
        <line x1="410" y1="138" x2="448" y2="138" stroke="var(--color-amber)" strokeWidth="1.5"/>
        <polygon points="448,134 460,138 448,142" fill="var(--color-amber)"/>

        {/* Credential exfil */}
        <text x="290" y="190" textAnchor="middle" fill="var(--color-text-faint)" fontSize="8">HTTP POST credentials →</text>
        <line x1="365" y1="182" x2="220" y2="195" stroke="var(--color-amber)" strokeWidth="1" strokeDasharray="3,2"/>
        <polygon points="220,192 208,197 222,200" fill="var(--color-amber)"/>
        <text x="190" y="215" textAnchor="middle" fill="var(--color-amber)" fontSize="8">Logged to /SD/evil/credentials.txt</text>
      </svg>
    </div>
  )
}

/* ── DHCP Starvation ─────────────────────────────────────────── */
export function DHCPDiagram() {
  return (
    <div className="diagram-bg rounded-xl p-5 my-6" style={{ border: '1px solid var(--color-border)' }}>
      <div className="text-[10px] font-mono uppercase tracking-widest mb-4" style={{ color: 'var(--color-text-faint)' }}>
        DHCP Protocol & Starvation Attack
      </div>
      <svg viewBox="0 0 580 220" className="w-full" style={{ maxHeight: '220px' }}>
        {/* Normal DHCP flow (top) */}
        <text x="10" y="20" fill="var(--color-green)" fontSize="10" fontWeight="600" fontFamily="var(--font-display)">Normal DHCP (DORA)</text>

        {/* DHCP server */}
        <rect x="420" y="28" width="140" height="60" rx="6" fill="oklch(14% 0.015 145 / 0.3)" stroke="var(--color-green)" strokeWidth="1.5"/>
        <text x="490" y="50" textAnchor="middle" fill="var(--color-green)" fontSize="10" fontWeight="600">DHCP Server</text>
        <text x="490" y="62" textAnchor="middle" fill="var(--color-text-faint)" fontSize="8">Pool: 192.168.1.100–200</text>
        <text x="490" y="74" textAnchor="middle" fill="var(--color-text-faint)" fontSize="7">(100 available leases)</text>

        {/* DORA arrows */}
        {[
          { y: 32, label: '1. DISCOVER (broadcast)', dir: 'right' },
          { y: 46, label: '2. OFFER (192.168.1.100)', dir: 'left' },
          { y: 60, label: '3. REQUEST (I want .100)', dir: 'right' },
          { y: 74, label: '4. ACK (It\'s yours!)', dir: 'left' },
        ].map((msg, i) => (
          <g key={i}>
            {msg.dir === 'right' ? (
              <>
                <line x1="100" y1={msg.y + 8} x2="418" y2={msg.y + 8} stroke="var(--color-steel)" strokeWidth="1" strokeDasharray="3,2" className="flow-arrow"/>
                <polygon points={`418,${msg.y+4} 430,${msg.y+8} 418,${msg.y+12}`} fill="var(--color-steel)"/>
              </>
            ) : (
              <>
                <line x1="418" y1={msg.y + 8} x2="100" y2={msg.y + 8} stroke="var(--color-green)" strokeWidth="1" strokeDasharray="3,2" className="flow-arrow"/>
                <polygon points={`100,${msg.y+4} 88,${msg.y+8} 100,${msg.y+12}`} fill="var(--color-green)"/>
              </>
            )}
            <text x="260" y={msg.y + 5} textAnchor="middle" fill="var(--color-text-faint)" fontSize="8">{msg.label}</text>
          </g>
        ))}

        {/* Client */}
        <rect x="10" y="28" width="85" height="60" rx="6" fill="oklch(15% 0.015 220 / 0.3)" stroke="var(--color-steel)" strokeWidth="1"/>
        <text x="52" y="55" textAnchor="middle" fill="var(--color-steel)" fontSize="9" fontWeight="600">Client</text>
        <text x="52" y="67" textAnchor="middle" fill="var(--color-text-faint)" fontSize="7">Needs IP addr</text>
        <text x="52" y="77" textAnchor="middle" fill="var(--color-text-faint)" fontSize="7">from network</text>

        {/* Divider */}
        <line x1="10" y1="105" x2="570" y2="105" stroke="var(--color-border)" strokeWidth="1"/>
        <text x="10" y="120" fill="var(--color-red)" fontSize="10" fontWeight="600" fontFamily="var(--font-display)">Starvation Attack — Cardputer floods with fake MAC Discover requests</text>

        {/* Pool exhausted */}
        <rect x="420" y="130" width="140" height="60" rx="6" fill="oklch(14% 0.015 25 / 0.3)" stroke="var(--color-red)" strokeWidth="1.5"/>
        <text x="490" y="152" textAnchor="middle" fill="var(--color-red)" fontSize="10" fontWeight="600">DHCP Server</text>
        <text x="490" y="164" textAnchor="middle" fill="var(--color-red)" fontSize="8">Pool: EXHAUSTED</text>
        <text x="490" y="175" textAnchor="middle" fill="var(--color-text-faint)" fontSize="7">100/100 leases used</text>
        <text x="490" y="185" textAnchor="middle" fill="var(--color-text-faint)" fontSize="7">by fake MACs</text>

        {/* Cardputer flood */}
        <rect x="10" y="130" width="100" height="60" rx="6" fill="oklch(14% 0.015 25 / 0.3)" stroke="var(--color-red)" strokeWidth="1.5"/>
        <text x="60" y="154" textAnchor="middle" fill="var(--color-red)" fontSize="9" fontWeight="600">Cardputer</text>
        <text x="60" y="165" textAnchor="middle" fill="var(--color-text-faint)" fontSize="7">Sends 100+ DHCP</text>
        <text x="60" y="175" textAnchor="middle" fill="var(--color-text-faint)" fontSize="7">DISCOVER frames</text>
        <text x="60" y="185" textAnchor="middle" fill="var(--color-text-faint)" fontSize="7">with random MACs</text>

        {/* Flood arrows */}
        {[138, 150, 162, 174, 186].map((y, i) => (
          <line key={i} x1="112" y1={y} x2="418" y2={y} stroke="var(--color-red)" strokeWidth={i === 2 ? 1.5 : 0.8} opacity={1 - i * 0.15} strokeDasharray="3,2"/>
        ))}

        {/* Real client denied */}
        <rect x="230" y="155" width="100" height="40" rx="5" fill="oklch(14% 0.015 25 / 0.2)" stroke="var(--color-red-dim)" strokeWidth="1"/>
        <text x="280" y="172" textAnchor="middle" fill="var(--color-text-muted)" fontSize="8" fontWeight="600">Real Client</text>
        <text x="280" y="183" textAnchor="middle" fill="var(--color-red)" fontSize="7">DISCOVER → No OFFER</text>
        <text x="280" y="192" textAnchor="middle" fill="var(--color-text-faint)" fontSize="7">Network DoS!</text>
      </svg>
    </div>
  )
}

/* ── NTLM / Responder diagram ─────────────────────────────────── */
export function NTLMDiagram() {
  return (
    <div className="diagram-bg rounded-xl p-5 my-6" style={{ border: '1px solid var(--color-border)' }}>
      <div className="text-[10px] font-mono uppercase tracking-widest mb-4" style={{ color: 'var(--color-text-faint)' }}>
        LLMNR/NBT-NS Poisoning + NTLM Credential Capture
      </div>
      <svg viewBox="0 0 580 230" className="w-full" style={{ maxHeight: '230px' }}>
        {/* Client */}
        <rect x="10" y="85" width="100" height="60" rx="6" fill="oklch(15% 0.015 220 / 0.3)" stroke="var(--color-steel)" strokeWidth="1.5"/>
        <text x="60" y="110" textAnchor="middle" fill="var(--color-steel)" fontSize="9" fontWeight="600">Windows Client</text>
        <text x="60" y="122" textAnchor="middle" fill="var(--color-text-faint)" fontSize="7">Types: \\FILESERVER\share</text>
        <text x="60" y="133" textAnchor="middle" fill="var(--color-text-faint)" fontSize="7">DNS fails → LLMNR</text>

        {/* Step 1: broadcast */}
        <line x1="112" y1="110" x2="200" y2="110" stroke="var(--color-steel)" strokeWidth="1.5" strokeDasharray="4,3" className="flow-arrow"/>
        <polygon points="200,106 212,110 200,114" fill="var(--color-steel)"/>
        <text x="156" y="100" textAnchor="middle" fill="var(--color-steel)" fontSize="8">LLMNR broadcast</text>
        <text x="156" y="123" textAnchor="middle" fill="var(--color-text-faint)" fontSize="7">"Who is FILESERVER?"</text>

        {/* Broadcast cloud */}
        <ellipse cx="258" cy="110" rx="50" ry="30" fill="oklch(16% 0.01 240)" stroke="var(--color-border)" strokeWidth="1"/>
        <text x="258" y="107" textAnchor="middle" fill="var(--color-text-faint)" fontSize="8">Multicast</text>
        <text x="258" y="118" textAnchor="middle" fill="var(--color-text-faint)" fontSize="8">224.0.0.252</text>

        {/* Responder (Cardputer) replies */}
        <line x1="310" y1="110" x2="390" y2="110" stroke="var(--color-red)" strokeWidth="1.5" className="flow-arrow" strokeDasharray="4,3"/>
        <polygon points="390,106 403,110 390,114" fill="var(--color-red)"/>
        <text x="350" y="100" textAnchor="middle" fill="var(--color-red)" fontSize="8">Poison Response</text>
        <text x="350" y="123" textAnchor="middle" fill="var(--color-text-faint)" fontSize="7">"I am FILESERVER!" (Cardputer)</text>

        {/* Cardputer Responder */}
        <rect x="405" y="75" width="130" height="70" rx="6" fill="oklch(14% 0.015 25 / 0.3)" stroke="var(--color-red)" strokeWidth="1.5"/>
        <text x="470" y="98" textAnchor="middle" fill="var(--color-red)" fontSize="9" fontWeight="700">Cardputer</text>
        <text x="470" y="109" textAnchor="middle" fill="var(--color-amber)" fontSize="8">Responder Module</text>
        <text x="470" y="120" textAnchor="middle" fill="var(--color-text-faint)" fontSize="7">NBT-NS + LLMNR</text>
        <text x="470" y="131" textAnchor="middle" fill="var(--color-text-faint)" fontSize="7">poisoning active</text>

        {/* NTLM challenge */}
        <line x1="113" y1="128" x2="403" y2="138" stroke="var(--color-amber)" strokeWidth="1.5"/>
        <polygon points="403,135 415,140 402,144" fill="var(--color-amber)"/>
        <text x="260" y="150" textAnchor="middle" fill="var(--color-amber)" fontSize="8">NTLM Auth Request → Challenge → Response</text>

        {/* Hash captured */}
        <rect x="160" y="168" width="260" height="50" rx="6" fill="var(--color-amber-glow)" stroke="var(--color-amber-dim)" strokeWidth="1.5"/>
        <text x="290" y="188" textAnchor="middle" fill="var(--color-amber)" fontSize="9" fontWeight="700">NTLMv2 Hash Captured!</text>
        <text x="290" y="200" textAnchor="middle" fill="var(--color-text-faint)" fontSize="7">admin::WORKGROUP:a3f7b2...  (saved to SD card)</text>
        <text x="290" y="211" textAnchor="middle" fill="var(--color-text-faint)" fontSize="7">Crack offline with hashcat -m 5600</text>
      </svg>
    </div>
  )
}

/* ── Channel Spectrum ────────────────────────────────────────── */
export function ChannelSpectrum() {
  const channels2g = [1,2,3,4,5,6,7,8,9,10,11,12,13,14]
  return (
    <div className="diagram-bg rounded-xl p-5 my-6" style={{ border: '1px solid var(--color-border)' }}>
      <div className="text-[10px] font-mono uppercase tracking-widest mb-4" style={{ color: 'var(--color-text-faint)' }}>
        2.4 GHz Channel Spectrum — 22 MHz wide channels (only 1, 6, 11 are non-overlapping)
      </div>
      <svg viewBox="0 0 560 160" className="w-full" style={{ maxHeight: '160px' }}>
        {/* Background */}
        <rect x="30" y="10" width="520" height="100" rx="4" fill="oklch(12% 0.01 240)" opacity="0.5"/>
        {/* Channels as bell curves (simplified as trapezoids) */}
        {channels2g.map((ch, i) => {
          const centerX = 30 + (i / 13) * 500 + 20
          const w = 76 // ~22 MHz per channel in this scale
          const isNonOverlap = ch === 1 || ch === 6 || ch === 11
          const col = isNonOverlap ? 'var(--color-green)' : 'var(--color-red)'
          const alpha = isNonOverlap ? '0.3' : '0.1'
          return (
            <g key={ch}>
              {/* Bell curve simplified */}
              <path
                d={`M ${centerX - w/2} 110 Q ${centerX - w/4} 30 ${centerX} 25 Q ${centerX + w/4} 30 ${centerX + w/2} 110 Z`}
                fill={`${col}`}
                fillOpacity={alpha}
                stroke={col}
                strokeWidth={isNonOverlap ? 1.5 : 0.5}
                strokeOpacity={isNonOverlap ? 0.8 : 0.3}
              />
              <text x={centerX} y="125" textAnchor="middle" fill={isNonOverlap ? col : 'var(--color-text-faint)'} fontSize={isNonOverlap ? 9 : 7} fontWeight={isNonOverlap ? '700' : '400'}>
                {ch}
              </text>
              {isNonOverlap && (
                <text x={centerX} y="18" textAnchor="middle" fill={col} fontSize="8" fontWeight="700">✓</text>
              )}
            </g>
          )
        })}
        {/* Frequency axis */}
        <line x1="30" y1="112" x2="552" y2="112" stroke="var(--color-border)" strokeWidth="1"/>
        <text x="30" y="140" fill="var(--color-text-faint)" fontSize="8">2.400 GHz</text>
        <text x="290" y="140" textAnchor="middle" fill="var(--color-text-faint)" fontSize="8">Frequency</text>
        <text x="552" y="140" textAnchor="end" fill="var(--color-text-faint)" fontSize="8">2.495 GHz</text>
        {/* Legend */}
        <circle cx="80" cy="152" r="4" fill="var(--color-green)" opacity="0.5"/>
        <text x="88" y="156" fill="var(--color-green)" fontSize="8">Non-overlapping (use these for AP placement)</text>
        <circle cx="370" cy="152" r="4" fill="var(--color-red)" opacity="0.3"/>
        <text x="378" y="156" fill="var(--color-text-faint)" fontSize="8">Overlapping (causes interference)</text>
      </svg>
    </div>
  )
}

/* ── Network Topology: MITM ──────────────────────────────────── */
export function MITMDiagram() {
  return (
    <div className="diagram-bg rounded-xl p-5 my-6" style={{ border: '1px solid var(--color-border)' }}>
      <div className="text-[10px] font-mono uppercase tracking-widest mb-4" style={{ color: 'var(--color-text-faint)' }}>
        Man-in-the-Middle via Rogue DHCP + DNS Hijack
      </div>
      <svg viewBox="0 0 560 180" className="w-full" style={{ maxHeight: '180px' }}>
        {/* Internet */}
        <circle cx="70" cy="90" r="35" fill="oklch(14% 0.01 240)" stroke="var(--color-border)" strokeWidth="1"/>
        <text x="70" y="87" textAnchor="middle" fill="var(--color-text-faint)" fontSize="9">Internet</text>
        <text x="70" y="98" textAnchor="middle" fill="var(--color-text-faint)" fontSize="8">8.8.8.8</text>

        {/* Router */}
        <rect x="145" y="65" width="80" height="50" rx="5" fill="oklch(14% 0.015 145 / 0.3)" stroke="var(--color-green)" strokeWidth="1.5"/>
        <text x="185" y="86" textAnchor="middle" fill="var(--color-green)" fontSize="9" fontWeight="600">Router</text>
        <text x="185" y="97" textAnchor="middle" fill="var(--color-text-faint)" fontSize="7">192.168.1.1</text>
        <text x="185" y="107" textAnchor="middle" fill="var(--color-text-faint)" fontSize="7">DHCP server</text>

        {/* Normal flow */}
        <line x1="107" y1="90" x2="143" y2="90" stroke="var(--color-green)" strokeWidth="1.5" strokeDasharray="3,2" className="flow-arrow"/>

        {/* Cardputer (evil) */}
        <rect x="255" y="55" width="120" height="70" rx="5" fill="oklch(14% 0.015 25 / 0.3)" stroke="var(--color-red)" strokeWidth="1.5"/>
        <text x="315" y="77" textAnchor="middle" fill="var(--color-red)" fontSize="9" fontWeight="700">Cardputer</text>
        <text x="315" y="89" textAnchor="middle" fill="var(--color-amber)" fontSize="8">Rogue DHCP</text>
        <text x="315" y="99" textAnchor="middle" fill="var(--color-text-faint)" fontSize="7">Sends: GW=192.168.1.1</text>
        <text x="315" y="109" textAnchor="middle" fill="var(--color-red)" fontSize="7">DNS=Cardputer IP ← poison</text>
        <text x="315" y="119" textAnchor="middle" fill="var(--color-text-faint)" fontSize="7">Routes traffic through self</text>

        {/* Client */}
        <rect x="420" y="65" width="100" height="50" rx="5" fill="oklch(15% 0.015 220 / 0.3)" stroke="var(--color-steel)" strokeWidth="1.5"/>
        <text x="470" y="86" textAnchor="middle" fill="var(--color-steel)" fontSize="9" fontWeight="600">Victim</text>
        <text x="470" y="97" textAnchor="middle" fill="var(--color-text-faint)" fontSize="7">Gets poisoned</text>
        <text x="470" y="107" textAnchor="middle" fill="var(--color-text-faint)" fontSize="7">DHCP lease</text>

        {/* MITM arrows */}
        <line x1="225" y1="83" x2="253" y2="83" stroke="var(--color-red)" strokeWidth="2"/>
        <polygon points="253,79 265,83 253,87" fill="var(--color-red)"/>
        <line x1="375" y1="90" x2="418" y2="90" stroke="var(--color-red)" strokeWidth="2"/>
        <polygon points="418,86 430,90 418,94" fill="var(--color-red)"/>

        {/* MITM traffic flows */}
        <text x="315" y="148" textAnchor="middle" fill="var(--color-amber)" fontSize="9">All victim traffic: Internet → Cardputer → Router → Internet</text>
        <text x="315" y="162" textAnchor="middle" fill="var(--color-text-faint)" fontSize="8">HTTP visible in plaintext · DNS resolved to fake IPs · Cookies sniffable</text>
      </svg>
    </div>
  )
}
