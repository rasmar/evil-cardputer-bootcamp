import { ModuleHeader, SectionH, SubH, Callout, Code, IC, SpecTable, Divider, Tag } from '../components/UI'

export default function ModuleScanning() {
  return (
    <div>
      <ModuleHeader
        num="04"
        title="Scanning & Reconnaissance"
        subtitle="Passive intelligence gathering — map the environment before acting. Understand probe requests, channel visualization, and wardriving before launching any attack."
      />

      <Callout kind="tip">
        <strong>Recon first, always.</strong> Every successful attack starts with intelligence. Rushing to deauth or evil-twin without understanding the target network usually fails or creates noisy, detectable activity. Spend 5 minutes scanning before 30 seconds attacking.
      </Callout>

      <SectionH>Scan WiFi — Active Network Discovery</SectionH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        The <strong style={{ color: 'var(--color-text)' }}>Scan WiFi</strong> feature sends Probe Request frames on each channel
        and collects Beacon frames from discovered APs. The result is a list of nearby networks with:
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 my-4">
        {[
          { f: 'SSID', d: 'Network name (empty = hidden)' },
          { f: 'BSSID', d: 'AP hardware MAC address' },
          { f: 'Channel', d: 'Operating channel (1–13)' },
          { f: 'RSSI', d: 'Signal strength in dBm (–30 strong → –90 weak)' },
          { f: 'Security', d: 'Open / WPA / WPA2 / WPA3' },
          { f: 'Clients', d: 'Number of associated stations (if visible)' },
        ].map(r => (
          <div key={r.f} className="p-2.5 rounded" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-subtle)' }}>
            <div className="text-[11px] font-mono font-bold" style={{ color: 'var(--color-amber)' }}>{r.f}</div>
            <div className="text-[10px] mt-0.5" style={{ color: 'var(--color-text-faint)' }}>{r.d}</div>
          </div>
        ))}
      </div>
      <SubH>Using RSSI</SubH>
      <SpecTable rows={[
        ['−30 dBm', 'Excellent — device is essentially on top of the AP'],
        ['−50 dBm', 'Strong — very reliable connection'],
        ['−70 dBm', 'Moderate — typical home network usage range'],
        ['−80 dBm', 'Weak — packet loss begins'],
        ['−90 dBm', 'Very weak — unreliable'],
        ['Below −90', 'Not useful for attacks'],
      ]} />
      <Callout kind="info">
        For evil twin attacks, your Cardputer AP should appear at a higher RSSI than the real AP. Being physically closer to the target client than the real AP is the single most effective way to win the signal contest.
      </Callout>

      <Divider />

      <SectionH>Clone & Details</SectionH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        After scanning, select any AP and use <strong style={{ color: 'var(--color-text)' }}>Clone & Details</strong> to:
      </p>
      <div className="space-y-2 my-4">
        {[
          { action: 'Clone AP Identity', detail: 'Copies the SSID, BSSID (MAC address spoofing), and channel of the real AP into the evil twin configuration. A perfect clone has identical SSID and a spoofed BSSID — clients cannot distinguish it from the real AP by any visible attribute.' },
          { action: 'View AP Details', detail: 'Shows the full Beacon frame contents: supported rates, capabilities, IE elements, country code, max TX power. Useful for crafting convincing responses.' },
          { action: 'Select Target', detail: 'Sets this AP as the target for subsequent deauth, handshake capture, and evil twin operations.' },
        ].map(item => (
          <div key={item.action} className="p-3 rounded-lg" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-subtle)' }}>
            <div className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-display)' }}>{item.action}</div>
            <div className="text-xs" style={{ color: 'var(--color-text-faint)', lineHeight: '1.6' }}>{item.detail}</div>
          </div>
        ))}
      </div>

      <Divider />

      <SectionH>Sniffing Probes — Passive Client Discovery</SectionH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        <strong style={{ color: 'var(--color-text)' }}>Sniffing Probes</strong> puts the Cardputer into promiscuous mode
        and passively listens for 802.11 Probe Request frames. No frames are transmitted — this is completely passive.
        Each entry captured shows:
      </p>
      <Code label="Captured probe log entry (SD card)">{`Timestamp: 2025-01-15 14:32:11
Source MAC: aa:bb:cc:dd:ee:ff  (randomized)
SSID: "HomeNetwork_2G"
RSSI: -62 dBm
Channel: 6 (hopped)
Sequence: 1847`}</Code>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8', marginTop: '12px' }}>
        A device probing for <IC>"HomeNetwork_2G"</IC> tells you: the owner has a home network on 2.4 GHz.
        Creating an evil twin with that exact SSID and running it on the same channel the probe was seen on will
        likely attract the device.
      </p>
      <Callout kind="warn">
        <strong>Privacy note for the classroom:</strong> Everyone in the room with WiFi enabled is broadcasting their network list. This is the nature of 802.11 probe requests. Demonstrating this live — capturing participants' SSIDs — is a powerful lesson in the real privacy implications of leaving WiFi on.
      </Callout>

      <Divider />

      <SectionH>WiFi Channel Visualizer</SectionH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        The <strong style={{ color: 'var(--color-text)' }}>WiFi Channel Visualizer</strong> shows a real-time bar chart of
        signal strength per channel. This is useful for:
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
        {[
          { use: 'Least congested channel', detail: 'Find which channel has the fewest APs. Place your evil twin AP on the same channel as the target for best performance.' },
          { use: 'Hidden AP detection', detail: 'APs with hidden SSIDs appear as signal activity without a name. The channel visualizer shows their presence even when the scanner shows no SSID.' },
          { use: 'Interference mapping', detail: 'If channels 1, 6, and 11 are all heavily loaded, you may experience 802.11 collisions that impact your attack performance.' },
          { use: 'Target confirmation', detail: 'After starting an evil twin, the target\'s channel should show increased activity as clients begin associating.' },
        ].map(item => (
          <div key={item.use} className="p-3 rounded-lg" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-subtle)' }}>
            <div className="text-xs font-semibold mb-1" style={{ color: 'var(--color-steel)', fontFamily: 'var(--font-display)' }}>{item.use}</div>
            <div className="text-[11px]" style={{ color: 'var(--color-text-faint)', lineHeight: '1.6' }}>{item.detail}</div>
          </div>
        ))}
      </div>

      <Divider />

      <SectionH>WiFi Raw Sniffing</SectionH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        <strong style={{ color: 'var(--color-text)' }}>WiFi Raw Sniffing</strong> captures all 802.11 frames on the current
        channel — management, control, and data frames — and saves them as a <strong style={{ color: 'var(--color-amber)' }}>.pcap</strong> file
        to the SD card. This file can be opened with Wireshark on a laptop for deep packet inspection.
      </p>
      <Code label="Analyzing the captured .pcap with Wireshark">{`# Open in Wireshark:
File → Open → /SD/evil/handshakes/capture.pcap

# Useful Wireshark filters for WiFi analysis:
wlan.fc.type_subtype == 4          # Probe requests only
wlan.fc.type_subtype == 8          # Beacon frames only
wlan.fc.type_subtype == 12         # Deauth frames
wlan.fc.type == 0                  # All management frames
eapol                              # EAPOL (WPA2 handshake)
wlan.addr == aa:bb:cc:dd:ee:ff     # Filter by specific MAC`}</Code>

      <SubH>Sniff Raw Client</SubH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        Similar to raw sniffing but focuses capture on frames from/to a specific client MAC. Reduces noise when
        monitoring a specific device and helps isolate:
      </p>
      <div className="space-y-1 my-3">
        {[
          'Which AP the client is associated with',
          'Retry rates (high retries = weak signal or interference)',
          'Data frame patterns (timing of web traffic, DNS queries)',
          'Association/disassociation events',
        ].map((s, i) => (
          <div key={i} className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            <span style={{ color: 'var(--color-amber)', flexShrink: 0 }}>→</span> {s}
          </div>
        ))}
      </div>

      <Divider />

      <SectionH>Wardriving</SectionH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        <strong style={{ color: 'var(--color-text)' }}>Wardriving</strong> is the practice of moving through physical space
        while scanning for WiFi networks — logging their SSID, BSSID, signal strength, and position. The Cardputer supports
        two wardriving modes:
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
        <div className="p-4 rounded-lg" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-steel)33' }}>
          <div className="text-sm font-bold mb-2" style={{ color: 'var(--color-steel)', fontFamily: 'var(--font-display)' }}>Wardriving</div>
          <div className="text-xs" style={{ color: 'var(--color-text-faint)', lineHeight: '1.6' }}>
            Basic mode without GPS. Logs SSID, BSSID, channel, and RSSI with a timestamp only. Useful for indoor environments or when GPS coverage is unavailable.
          </div>
          <div className="mt-2"><Tag color="steel">No GPS required</Tag></div>
        </div>
        <div className="p-4 rounded-lg" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-amber)33' }}>
          <div className="text-sm font-bold mb-2" style={{ color: 'var(--color-amber)', fontFamily: 'var(--font-display)' }}>Wardriving Master</div>
          <div className="text-xs" style={{ color: 'var(--color-text-faint)', lineHeight: '1.6' }}>
            Requires the GPS expansion module. Logs GPS coordinates with each network record. Output is Wigle-compatible CSV, loadable into Wigle.net for global mapping and correlation with existing wardrive data.
          </div>
          <div className="mt-2"><Tag color="amber">GPS module required</Tag></div>
        </div>
      </div>
      <Code label="Wardriving CSV output format">{`# /SD/evil/logs/wardrive_YYYY-MM-DD.csv
WigleWifi-1.4,appRelease=1.0,...
MAC,SSID,AuthMode,FirstSeen,Channel,RSSI,CurrentLatitude,CurrentLongitude,Type
AA:BB:CC:DD:EE:FF,HomeNetwork,[WPA2-PSK],[2025-01-15 14:33:00],6,-65,48.8566,2.3522,WIFI
...`}</Code>
      <Callout kind="info">
        The Wigle.net database contains over 1 billion wardrive records globally. By correlating your captures with Wigle, you can often identify what neighborhood or building a specific network belongs to — even if you don't know the address. This is why BSSIDs are used for geolocation in emergency services.
      </Callout>

      <Divider />

      <SectionH>Open WiFi Checker</SectionH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        Scans nearby networks and flags any that are <strong style={{ color: 'var(--color-red)' }}>open (no password)</strong>.
        Open networks are the easiest targets for evil twin attacks — clients auto-connect without any authentication challenge.
        They also represent the highest risk to users, since all traffic is transmitted without link-layer encryption.
      </p>
      <Callout kind="warn">
        Even WPA2 networks are only as secure as their link-layer encryption. HTTPS (TLS) is end-to-end and protects content regardless of WiFi security. However, DNS queries, non-HTTPS connections, and metadata remain exposed even on WPA2 networks to an on-path attacker.
      </Callout>
    </div>
  )
}
