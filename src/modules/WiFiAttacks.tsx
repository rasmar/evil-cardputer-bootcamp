import { ModuleHeader, SectionH, SubH, Callout, Code, IC, SpecTable, Divider, Steps } from '../components/UI'
import { DeauthDiagram, EvilTwinDiagram } from '../components/Diagrams'

export default function ModuleWiFiAttacks() {
  return (
    <div>
      <ModuleHeader
        num="05"
        title="WiFi Attacks"
        subtitle="Deauthentication, Karma, Evil Twin, captive portals, handshake capture — how each attack works, why it works, and how to deploy it from the Cardputer."
      />

      <Callout kind="danger">
        All attacks in this module affect real wireless infrastructure. Deauth attacks are a denial-of-service against legitimate users. Only perform these against devices and networks you own or have explicit written permission to test. Unauthorized use is illegal in most jurisdictions (e.g., CFAA in the US, Computer Misuse Act in the UK).
      </Callout>

      <SectionH>Deauthentication Attack</SectionH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        A <strong style={{ color: 'var(--color-text)' }}>deauthentication attack</strong> exploits a fundamental flaw in
        WPA2: management frames (including <IC>Deauthentication</IC> and <IC>Disassociation</IC>) are not authenticated.
        Any device can forge a deauth frame claiming to be from the AP, and the receiving client will believe it and disconnect.
      </p>
      <DeauthDiagram />

      <SubH>Why This Works</SubH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        The 802.11 standard (pre-802.11w) has no mechanism to verify the source of management frames.
        A deauth frame with reason code 7 ("Class 3 frame received from non-associated STA") or reason code 3 ("Deauthenticated because sending STA is leaving IBSS or ESS")
        is accepted by virtually all client devices and APs. The Cardputer spoofs the AP's MAC address to send these frames to clients, and/or spoofs the client's MAC to send them to the AP.
      </p>

      <SpecTable rows={[
        ['Deauther',      'Manual: select target AP and/or client, send continuous deauth frames'],
        ['Auto Deauther', 'Automated: scan all nearby APs and deauth all clients from all found APs — "spray" mode'],
        ['Client Sniff + Deauth', 'First sniff to find associated clients, then deauth them specifically — targeted'],
      ]} />

      <Callout kind="tip">
        <strong>Strategic use:</strong> Deauth + Handshake capture is the most common workflow. Force client disconnection, sniff the 802.11 channel on the same frequency, and capture the WPA2 handshake when the client reconnects. Automate this with Handshake Master.
      </Callout>

      <SubH>Protection Against Deauth</SubH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        <strong style={{ color: 'var(--color-green)' }}>802.11w Management Frame Protection (MFP)</strong> cryptographically signs management frames using the PTK key derived from the 4-way handshake.
        Deauth attacks fail against WPA3 networks or WPA2+PMF networks with 802.11w-capable clients. When both AP and client support 802.11w, the Cardputer's deauth frames are ignored.
      </p>

      <Divider />

      <SectionH>Beacon Spam</SectionH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        <strong style={{ color: 'var(--color-text)' }}>Beacon Spam</strong> floods the air with fake beacon frames announcing hundreds of non-existent SSIDs. Effects:
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
        {[
          { name: 'WiFi scanner pollution', desc: 'Any device scanning for networks sees a list of dozens/hundreds of fake networks — making it hard to find real ones. Useful for confusion.' },
          { name: 'Channel congestion', desc: 'Each beacon takes 802.11 airtime. Heavy beaconing on one channel forces other devices to wait longer (CSMA/CA backoff), degrading throughput for legitimate users.' },
          { name: 'SSID art / messages', desc: 'Custom SSIDs can spell out messages visible to anyone scanning nearby — a common CTF trick and demonstration.' },
          { name: 'RF fingerprinting evasion', desc: 'Flooding with many BSSIDs makes it harder for passive monitoring to attribute specific attack frames to a single physical device.' },
        ].map(item => (
          <div key={item.name} className="p-3 rounded-lg" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-subtle)' }}>
            <div className="text-xs font-bold mb-1" style={{ color: 'var(--color-amber)', fontFamily: 'var(--font-display)' }}>{item.name}</div>
            <div className="text-[11px]" style={{ color: 'var(--color-text-faint)', lineHeight: '1.6' }}>{item.desc}</div>
          </div>
        ))}
      </div>

      <Divider />

      <SectionH>Karma Attack</SectionH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        The <strong style={{ color: 'var(--color-text)' }}>Karma attack</strong> (named after the concept of "what you broadcast
        returns to you") responds to any Probe Request with a matching Probe Response, regardless of the SSID requested.
        The Cardputer listens for probe requests and impersonates every network any device is searching for.
      </p>

      <div className="p-4 rounded-lg my-5" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
        <div className="text-xs font-mono" style={{ color: 'var(--color-text-muted)', lineHeight: '2' }}>
          <div>Phone probes: <span style={{ color: 'var(--color-steel)' }}>"HomeNetwork"</span> → Cardputer responds: <span style={{ color: 'var(--color-red)' }}>"I'm HomeNetwork!"</span></div>
          <div>Laptop probes: <span style={{ color: 'var(--color-steel)' }}>"CoffeeShop_WiFi"</span> → Cardputer responds: <span style={{ color: 'var(--color-red)' }}>"I'm CoffeeShop_WiFi!"</span></div>
          <div>Tablet probes: <span style={{ color: 'var(--color-steel)' }}>"Hotel_Infinity"</span> → Cardputer responds: <span style={{ color: 'var(--color-red)' }}>"I'm Hotel_Infinity!"</span></div>
          <div style={{ color: 'var(--color-amber)' }}>All three devices connect to Cardputer → MITM position</div>
        </div>
      </div>

      <SpecTable rows={[
        ['Karma Attack',           'Manual karma — respond to probes you select, build your own SSID list'],
        ['Automated Karma Attack', 'Fully autonomous: passively collect probes, build SSID list, respond to all — no user interaction needed. Leave running and collect victims.'],
        ['Karma Spear',            'Targeted karma: only respond to probes for a specific SSID. Reduces noise and focuses the attack on one target network\'s clients.'],
      ]} />

      <Callout kind="info">
        Modern iOS (14+) and Android (10+) have partially mitigated Karma by using random MACs and only sending directed probe requests (not broadcast probes) for known networks in certain conditions. However, many IoT devices, laptops, and older phones remain vulnerable.
      </Callout>

      <Divider />

      <SectionH>Evil Twin Attack</SectionH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        An <strong style={{ color: 'var(--color-text)' }}>Evil Twin</strong> creates a rogue AP that impersonates a legitimate
        AP by using the same SSID (and optionally the same BSSID via MAC spoofing). The goal is to attract clients away
        from the real AP and into your controlled network.
      </p>
      <EvilTwinDiagram />

      <Steps steps={[
        { title: 'Scan and select target AP', body: 'Use Scan WiFi to find the target. Note the SSID, BSSID, channel, and security type. Stronger target signal = harder to beat. Move physically closer to the target client.' },
        { title: 'Clone the AP', body: 'Use Clone & Details to copy the AP identity. The Cardputer will spoof the BSSID and replicate the SSID exactly including case and any spaces/special characters.' },
        { title: 'Deauth clients from real AP', body: 'Run Deauther against the target AP to kick clients. Without deauth, you\'re competing for clients — with it, you\'re forcing the contest.' },
        { title: 'Start Evil Twin AP', body: 'The Cardputer creates an AP with identical SSID. Clients re-scanning will see two identical SSIDs — they typically choose the stronger signal.' },
        { title: 'Attach captive portal or route traffic', body: 'Either show a fake login page (credential harvest) or route internet via an upstream connection (MITM). The Admin WebUI lets you monitor connected clients.' },
      ]} />

      <Callout kind="warn">
        <strong>Open vs password-protected targets:</strong> If the real AP uses WPA2, you can create an open evil twin with the same SSID. Many clients will still connect — especially after being deauthed — because the device's OS shows both options and open networks are sometimes preferred for initial connection. Some OSes will warn the user that the network security changed.
      </Callout>

      <Divider />

      <SectionH>Captive Portal & Credential Harvesting</SectionH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        Once a client connects to your evil twin AP, the Cardputer acts as both a DHCP server and DNS resolver.
        Any HTTP request is intercepted and redirected to the captive portal — a fake login page served from the SD card.
      </p>

      <SubH>How the Redirect Works</SubH>
      <div className="p-4 rounded-lg my-4 font-mono text-xs" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)', lineHeight: '2' }}>
        <div>1. Client gets IP <span style={{ color: 'var(--color-amber)' }}>192.168.4.x</span> from Cardputer's DHCP server</div>
        <div>2. Client's DNS is set to <span style={{ color: 'var(--color-amber)' }}>192.168.4.1</span> (Cardputer)</div>
        <div>3. Client opens browser → requests <span style={{ color: 'var(--color-steel)' }}>http://example.com</span></div>
        <div>4. Cardputer DNS resolves ALL domains to <span style={{ color: 'var(--color-amber)' }}>192.168.4.1</span></div>
        <div>5. HTTP 302 redirect → <span style={{ color: 'var(--color-amber)' }}>http://192.168.4.1/portal</span></div>
        <div>6. Client sees: <span style={{ color: 'var(--color-red)' }}>fake login page</span> — enters credentials</div>
        <div>7. POST data → Cardputer saves to <span style={{ color: 'var(--color-amber)' }}>/SD/evil/logs/creds.txt</span></div>
      </div>

      <SubH>Portal Templates</SubH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        The <IC>/SD/evil/sites/</IC> directory contains portal templates. Each subfolder has an <IC>index.html</IC> file.
        Evil-M5 includes templates for:
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-4">
        {['ISP login pages', 'Hotel/Airport WiFi', 'Google OAuth', 'Facebook login', 'Corporate Outlook/OWA', 'Generic "Connect" page', 'Custom HTML/CSS', 'NTLM auth prompts'].map(t => (
          <div key={t} className="px-2 py-1.5 rounded text-[10px] text-center" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-subtle)', color: 'var(--color-text-faint)' }}>
            {t}
          </div>
        ))}
      </div>
      <Code label="Custom portal HTML template">{`<!-- /SD/evil/sites/custom/index.html -->
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Network Login</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <form method="POST" action="/cgi-bin/login.cgi">
    <h2>WiFi Authentication Required</h2>
    <input type="text"     name="username" placeholder="Username">
    <input type="password" name="password" placeholder="Password">
    <button type="submit">Connect</button>
  </form>
</body>
</html>

<!-- Credentials are captured server-side by the Evil-M5 HTTP handler -->
<!-- Saved to: /SD/evil/logs/credentials_YYYY-MM-DD.txt -->`}</Code>

      <SubH>Admin WebUI</SubH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        While the Cardputer is running an AP, connect your laptop to it and navigate to <IC>http://192.168.4.1/admin</IC> to access:
      </p>
      <SpecTable rows={[
        ['Connected clients', 'Real-time list of IPs/MACs connected to your evil twin'],
        ['Captured credentials', 'View credentials submitted to captive portals'],
        ['Portal selection', 'Switch between portal templates without touching the device'],
        ['Deauth control',  'Launch deauth attacks from the web UI'],
        ['Probe log viewer', 'Browse captured probe request history'],
      ]} />

      <Divider />

      <SectionH>Handshake Master</SectionH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        <strong style={{ color: 'var(--color-text)' }}>Handshake Master</strong> automates the deauth → reconnect → capture workflow:
      </p>
      <Steps steps={[
        { title: 'Select target AP', body: 'From the scan list, select the WPA2 AP you want to capture a handshake from.' },
        { title: 'Monitor the channel', body: 'The Cardputer locks to the AP\'s channel and enters promiscuous mode to capture EAPOL frames.' },
        { title: 'Deauth clients', body: 'Sends deauth frames to force clients to disconnect. When they reconnect, the 4-way EAPOL handshake is sent.' },
        { title: 'Capture and save', body: 'EAPOL frames are captured and saved as a .pcap file to /SD/evil/handshakes/. Status shows handshake count.' },
      ]} />
      <Code label="Cracking the captured handshake (offline, on laptop)">{`# Install hashcat and a wordlist (e.g., rockyou.txt)

# Convert .pcap to hashcat format with hcxtools:
hcxpcapngtool -o hash.hc22000 captured_handshake.pcap

# Crack with hashcat:
hashcat -m 22000 hash.hc22000 /usr/share/wordlists/rockyou.txt

# Dictionary + rules (much more effective):
hashcat -m 22000 hash.hc22000 rockyou.txt -r best64.rule

# Brute force (slow but thorough for short passwords):
hashcat -m 22000 hash.hc22000 -a 3 ?l?l?l?l?l?l?l?l

# PMKID capture mode (no client needed):
# Evil-M5 sends Assoc request → AP includes PMKID in EAPOL MSG1
# hashcat -m 22000 pmkid.hc22000 wordlist.txt`}</Code>

      <Callout kind="tip">
        GPU cracking speed for WPA2-PSK: GTX 1080 ~360,000 PMKs/sec, RTX 4090 ~1,500,000 PMKs/sec. An 8-character lowercase+digits password (~3 trillion combinations) would take ~25 days at 4090 speeds for pure brute force. A dictionary attack against common passwords takes seconds.
      </Callout>

      <Divider />

      <SectionH>Probe Attack & Sniffing Probes</SectionH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        <strong style={{ color: 'var(--color-text)' }}>Probes Attack</strong> is a targeted Karma attack that:
      </p>
      <div className="space-y-2 my-4">
        {[
          'Sniffs the air for probe requests from all nearby devices',
          'Builds a live SSID list of networks being searched for',
          'Immediately responds to each probe with a matching Probe Response',
          'Lures matching devices to connect to the Cardputer\'s AP',
          'Routes them to captive portal or MITM position',
        ].map((s, i) => (
          <div key={i} className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            <span style={{ color: 'var(--color-amber)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>{String(i+1).padStart(2,'0')}</span> {s}
          </div>
        ))}
      </div>

      <SubH>Handshakes/Deauth Detection</SubH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        This mode <em>detects</em> deauth attacks and EAPOL handshakes happening around you — useful for defensive awareness.
        When running this on a legitimate network, you'll see if someone nearby is attacking your WiFi infrastructure.
        Alerts on screen when deauth frames or complete EAPOL handshakes are observed.
      </p>

      <Divider />

      <SectionH>Honeypot</SectionH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        The <strong style={{ color: 'var(--color-text)' }}>Honeypot</strong> mode creates an intentionally attractive open AP
        that logs everything connecting to it. Unlike an evil twin, the honeypot doesn't impersonate a known network —
        it presents as something appealing (free WiFi) and waits for opportunistic connections.
      </p>
      <SpecTable rows={[
        ['SSID',    '"Free WiFi", "Airport_Free", "Hotel_Guest" etc.'],
        ['Security', 'Open — no password (maximum attractiveness)'],
        ['Logging', 'All client MACs, probe history, credential attempts'],
        ['Portal',  'Optional captive portal to harvest credentials'],
        ['Use case', 'Understand opportunistic WiFi behavior, test client security hygiene'],
      ]} />
    </div>
  )
}
