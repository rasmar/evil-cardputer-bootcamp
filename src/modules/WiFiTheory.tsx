import { ModuleHeader, SectionH, SubH, Callout, SpecTable, Divider, Tag } from '../components/UI'
import { OSIModel, WiFiFrameDiagram, FrameTypeTable, ProbeRequestFlow, HandshakeDiagram, ChannelSpectrum } from '../components/Diagrams'

export default function ModuleWiFiTheory() {
  return (
    <div>
      <ModuleHeader
        num="03"
        title="WiFi Theory"
        subtitle="Deep dive into 802.11: how frames work, why probe requests leak information, and how WPA2 authentication can be exploited. This module gives you the mental model needed to understand every attack in the following sections."
      />

      <SectionH>The OSI Model and Where WiFi Lives</SectionH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        The OSI model divides network communication into 7 abstract layers. Understanding where WiFi fits helps you
        understand which attacks target which layers — and why an attack at layer 2 can compromise data at layer 7.
      </p>
      <OSIModel />
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        WiFi operates at <strong style={{ color: 'var(--color-amber)' }}>Layer 1 (Physical)</strong> — modulating radio waves at 2.4 or 5 GHz —
        and <strong style={{ color: 'var(--color-amber)' }}>Layer 2 (Data Link)</strong> — defining the 802.11 MAC frame format, addressing,
        and association protocols. Most Evil-M5Project attacks exploit weaknesses at <strong style={{ color: 'var(--color-amber)' }}>Layer 2</strong>:
        unauthenticated management frames, weak SSID-based trust, and probe request privacy leaks.
      </p>

      <Divider />

      <SectionH>The 802.11 Frame Structure</SectionH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        Everything transmitted over WiFi is a <strong style={{ color: 'var(--color-text)' }}>frame</strong> — a structured binary
        packet with specific fields. The 802.11 MAC header is 24–30 bytes, followed by a variable-length payload and a 4-byte Frame Check Sequence (FCS).
      </p>
      <WiFiFrameDiagram />

      <SubH>Frame Categories</SubH>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
        {[
          { name: 'Management Frames', desc: 'Control the relationship between client and AP. Beacons, probe requests, authentication, association, deauthentication. These are the primary attack surface for Evil-M5.', color: 'var(--color-amber)', tag: 'Attack Surface' },
          { name: 'Control Frames', desc: 'Low-level coordination: ACK (acknowledgement), RTS/CTS (collision avoidance), Block ACK. These ensure reliable frame delivery.', color: 'var(--color-steel)', tag: 'Infrastructure' },
          { name: 'Data Frames', desc: 'Carry the actual payload — user traffic (websites, email, etc.). Encrypted with CCMP/AES in WPA2. The ultimate goal of most attacks is to read or modify these.', color: 'var(--color-green)', tag: 'Payload' },
        ].map(f => (
          <div key={f.name} className="p-4 rounded-lg" style={{ background: 'var(--color-surface)', border: `1px solid ${f.color}33` }}>
            <div className="text-sm font-bold mb-1" style={{ color: f.color, fontFamily: 'var(--font-display)' }}>{f.name}</div>
            <div className="text-xs mb-2" style={{ color: 'var(--color-text-faint)', lineHeight: '1.6' }}>{f.desc}</div>
            <Tag color={f.color === 'var(--color-amber)' ? 'amber' : f.color === 'var(--color-steel)' ? 'steel' : 'green'}>{f.tag}</Tag>
          </div>
        ))}
      </div>

      <FrameTypeTable />

      <Divider />

      <SectionH>Beacons: How APs Announce Themselves</SectionH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        Every 802.11 AP broadcasts a <strong style={{ color: 'var(--color-text)' }}>Beacon frame</strong> approximately every{' '}
        <strong style={{ color: 'var(--color-amber)' }}>100 milliseconds</strong> (10 beacons per second). The beacon contains:
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 my-4">
        {[
          { f: 'SSID', d: 'Network name (or empty for hidden SSID)' },
          { f: 'BSSID', d: 'AP\'s MAC address — globally unique' },
          { f: 'Channel', d: 'Current operating channel (1–13 for 2.4 GHz)' },
          { f: 'Supported Rates', d: '802.11b/g/n capabilities' },
          { f: 'RSN / WPA IE', d: 'Security: WPA2-PSK, WPA3, Open, etc.' },
          { f: 'Timestamp', d: 'AP uptime counter for synchronization' },
        ].map(r => (
          <div key={r.f} className="p-2.5 rounded" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-subtle)' }}>
            <div className="text-[11px] font-mono font-bold" style={{ color: 'var(--color-amber)' }}>{r.f}</div>
            <div className="text-[10px] mt-0.5" style={{ color: 'var(--color-text-faint)' }}>{r.d}</div>
          </div>
        ))}
      </div>
      <Callout kind="info">
        <strong>Hidden SSIDs are not truly hidden.</strong> When a client with the hidden SSID saved connects, it sends a Probe Request with the SSID in plaintext. The Cardputer's probe sniffing catches this. Additionally, the AP still sends beacons — just with an empty SSID field. The BSSID remains visible.
      </Callout>

      <Divider />

      <SectionH>Probe Requests: Your Device is Advertising Itself</SectionH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        When a WiFi device is disconnected (or even just idle with WiFi enabled), it sends out{' '}
        <strong style={{ color: 'var(--color-red)' }}>Probe Request</strong> frames — actively asking the air
        "is [network name] around?" for every network in its Preferred Network List (PNL). This is a fundamental
        privacy leak built into the 802.11 protocol.
      </p>
      <ProbeRequestFlow />

      <SubH>Why Probe Requests Matter for Attacks</SubH>
      <div className="space-y-3 my-4">
        {[
          {
            title: 'Network enumeration',
            detail: 'By passively listening for probes, you learn the SSIDs of every saved network on every nearby device — without the device connecting to anything. Home network names, corporate SSIDs, hotel names, etc. are all exposed.',
            icon: '📡'
          },
          {
            title: 'Targeted Evil Twin / Karma',
            detail: 'Once you know a device is looking for "HomeNetwork_5G", you can create an AP with that exact name. The device may auto-connect without any user interaction — especially if the network has no password (open) or matches a remembered open hotspot.',
            icon: '🎯'
          },
          {
            title: 'Device fingerprinting',
            detail: 'The probe request source MAC (theoretically random with MAC randomization, but often predictable), the specific SSIDs in the PNL, and the supported capabilities all together can uniquely fingerprint a device and its owner.',
            icon: '🔍'
          },
          {
            title: 'Wardriving context',
            detail: 'Passively capturing probes while moving through a city builds a map of which people (devices) were in which locations, and what networks they frequent. This is the basis of SSID-based location tracking.',
            icon: '🗺️'
          },
        ].map(item => (
          <div key={item.title} className="p-3 rounded-lg flex gap-3" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-subtle)' }}>
            <span className="text-lg flex-shrink-0">{item.icon}</span>
            <div>
              <div className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-display)' }}>{item.title}</div>
              <div className="text-xs" style={{ color: 'var(--color-text-faint)', lineHeight: '1.6' }}>{item.detail}</div>
            </div>
          </div>
        ))}
      </div>

      <Callout kind="warn">
        Modern iOS (14+) and Android (10+) use <strong>MAC address randomization</strong> for probe requests, sending a random MAC instead of the hardware MAC. This mitigates tracking, but the SSID list in probes still leaks. Some implementations of randomization are also predictable or re-use the same random MAC per SSID.
      </Callout>

      <Divider />

      <SectionH>WiFi Channels and the 2.4 GHz Band</SectionH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        The 2.4 GHz band is divided into overlapping channels. In the US/EU, channels 1–13 are available (Japan adds ch14).
        Each channel is 22 MHz wide, but they're spaced only 5 MHz apart — meaning most channels overlap with their neighbors
        and cause interference. Only channels <strong style={{ color: 'var(--color-green)' }}>1, 6, and 11</strong> are non-overlapping.
      </p>
      <ChannelSpectrum />
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        For the Cardputer: when sniffing for all networks, it must <strong style={{ color: 'var(--color-text)' }}>channel hop</strong>. Evil-M5 scans all channels sequentially with ~100ms dwell time. When performing a targeted attack (evil twin, deauth), the Cardputer locks to the target's channel.
      </p>

      <Divider />

      <SectionH>WPA2 Authentication: The 4-Way Handshake</SectionH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        WPA2-PSK (Pre-Shared Key) authentication works via a{' '}
        <strong style={{ color: 'var(--color-amber)' }}>4-way EAPOL handshake</strong> that proves both the client and AP know
        the password without transmitting it. Understanding this handshake is critical because it's the target of
        Handshake Master and the combination Deauther + Handshake capture workflow.
      </p>
      <HandshakeDiagram />

      <SubH>The PTK Key Derivation Chain</SubH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        The <strong style={{ color: 'var(--color-text)' }}>Pairwise Transient Key (PTK)</strong> is derived using:
      </p>
      <div className="p-4 rounded-lg my-4 font-mono text-xs" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
        <div>PMK = PBKDF2-HMAC-SHA1(<span style={{ color: 'var(--color-amber)' }}>Password</span>, <span style={{ color: 'var(--color-steel)' }}>SSID</span>, 4096 iterations)</div>
        <div className="mt-1">PTK = PRF-512(PMK, "Pairwise key expansion",</div>
        <div className="ml-8"><span style={{ color: 'var(--color-green)' }}>min(AP_MAC, Client_MAC)</span> || <span style={{ color: 'var(--color-green)' }}>max(AP_MAC, Client_MAC)</span> ||</div>
        <div className="ml-8"><span style={{ color: 'var(--color-violet)' }}>ANonce</span> || <span style={{ color: 'var(--color-violet)' }}>SNonce</span>)</div>
      </div>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        The PTK is never transmitted. The MIC (Message Integrity Code) in message 2 proves the client derived the same PTK.
        An attacker who captures the 4-way handshake (MSG 1 + MSG 2) can brute-force the password offline: try each candidate
        password → compute PMK → compute PTK → verify MIC. No network interaction needed after capture.
      </p>
      <Callout kind="danger">
        The 4-way handshake can be captured without actively attacking: just monitor the channel and wait for a client to naturally connect. Or force a reconnect with a Deauth frame. Either way, once captured and saved as a .pcap, it can be cracked with tools like hashcat or aircrack-ng on a powerful GPU.
      </Callout>

      <Divider />

      <SectionH>PMKID Attack (WPA2 Without a Client)</SectionH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        In 2018, Jens Steube (hashcat developer) discovered that a <strong style={{ color: 'var(--color-text)' }}>PMKID</strong> is
        included in the first EAPOL message sent by an AP in response to any association request. The PMKID is derived from:
      </p>
      <div className="p-4 rounded-lg my-4 font-mono text-xs" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
        <div>PMKID = HMAC-SHA1-128(<span style={{ color: 'var(--color-amber)' }}>PMK</span>, "PMK Name" || <span style={{ color: 'var(--color-steel)' }}>AP_MAC</span> || <span style={{ color: 'var(--color-violet)' }}>Client_MAC</span>)</div>
      </div>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        Since the PMK depends only on the password and SSID, an attacker can associate with the AP, grab the PMKID from message 1,
        and crack it offline — <strong style={{ color: 'var(--color-red)' }}>without any client present</strong>. This is
        what the Handshake Master's PMKID feature uses.
      </p>

      <Divider />

      <SectionH>WPA3: What Changed and What Didn't</SectionH>
      <SpecTable rows={[
        ['SAE (Dragonfly)',     'Replaces PSK with a zero-knowledge proof. Offline dictionary attacks against captured handshakes are no longer possible.'],
        ['PMF (802.11w)',       'Management Frame Protection: deauth and disassoc frames are now authenticated. Deauth attacks fail against WPA3 or WPA2+PMF clients.'],
        ['OWE',                 'Opportunistic Wireless Encryption: open networks (cafés) now get encrypted traffic without a password.'],
        ['Still vulnerable to', 'Downgrade attacks (evil twin with WPA2-only), side-channel attacks on SAE, Dragonblood vulnerabilities (patched in modern firmware).'],
        ['Cardputer vs WPA3',  'Most WPA3 features require hardware support beyond ESP32-S3. Evil-M5 operates in WPA2 space. WPA3-only clients are not targetable.'],
      ]} />

      <Callout kind="info">
        In practice (2024–2025), most home/SMB routers use WPA2 or WPA2/WPA3 transitional mode. Pure WPA3 networks are still rare. Evil-M5's attacks remain highly effective against the majority of real-world networks.
      </Callout>
    </div>
  )
}
