import { ModuleHeader, SectionH, SubH, Callout, Code, IC, SpecTable, Divider } from '../components/UI'

export default function ModuleAdvanced() {
  return (
    <div>
      <ModuleHeader
        num="08"
        title="Advanced Topics"
        subtitle="IMSI catchers, GPS wardriving, SkyJack, FindMyEvil, EvilChatMesh, SIP/VoIP attacks, CCTV exploitation, and RF signal replay."
      />

      <SectionH>IMSI Catcher — Mobile Network Interception Theory</SectionH>
      <Callout kind="danger">
        <strong>Legal note:</strong> Deploying a real IMSI catcher (StingRay) to intercept cellular traffic is illegal without specific law enforcement authorization in almost all jurisdictions. The Cardputer's IMSI Catcher feature is a <em>passive educational demonstration</em> of the concept using the 2.4 GHz WiFi radio — not a true cellular IMSI catcher. This section explains how real IMSI catchers work for educational awareness.
      </Callout>

      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        An <strong style={{ color: 'var(--color-text)' }}>IMSI (International Mobile Subscriber Identity)</strong> is a
        unique identifier stored on a SIM card, identifying a subscriber in the cellular network. It is 15 digits:
        MCC (3 digits country code) + MNC (2-3 digits network code) + MSIN (subscriber number).
      </p>

      <SubH>How Real IMSI Catchers Work</SubH>
      <div className="p-4 rounded-lg my-5" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div>
            <div className="mb-2" style={{ color: 'var(--color-amber)', fontWeight: 700 }}>STEP 1: Impersonate Base Station</div>
            <div style={{ color: 'var(--color-text-faint)', lineHeight: '1.8' }}>
              Fake BTS (Base Transceiver Station) broadcasts stronger signal than real towers.
              Phones prefer strongest signal → connect to fake tower.
            </div>
          </div>
          <div>
            <div className="mb-2" style={{ color: 'var(--color-amber)', fontWeight: 700 }}>STEP 2: Force Identity Disclosure</div>
            <div style={{ color: 'var(--color-text-faint)', lineHeight: '1.8' }}>
              GSM (2G) Identity Request forces phone to send IMSI in plaintext.
              3G/4G/5G use TMSI (temporary) but IMSI can be extracted via downgrade.
            </div>
          </div>
          <div>
            <div className="mb-2" style={{ color: 'var(--color-red)', fontWeight: 700 }}>STEP 3: Decrypt Traffic</div>
            <div style={{ color: 'var(--color-text-faint)', lineHeight: '1.8' }}>
              GSM A5/1 cipher is broken. Modern IMSIs catchers can disable encryption entirely (A5/0) and relay calls/SMS in plaintext.
            </div>
          </div>
          <div>
            <div className="mb-2" style={{ color: 'var(--color-green)', fontWeight: 700 }}>DEFENSE</div>
            <div style={{ color: 'var(--color-text-faint)', lineHeight: '1.8' }}>
              4G LTE and 5G SA use mutual authentication. 5G NR encrypts the SUCI (Subscription Concealed Identifier). Disable 2G/3G in phone settings for better protection.
            </div>
          </div>
        </div>
      </div>

      <SubH>Cardputer IMSI Catcher Feature</SubH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        The Cardputer's IMSI feature creates a WiFi captive portal that:
      </p>
      <div className="space-y-1 my-3">
        {[
          'Presents itself as a legitimate WiFi network with a portal page',
          'Requests the user\'s phone number / IMSI through the portal (social engineering)',
          'Can serve as a demo of the concept without actual cellular radio manipulation',
          'Educational tool to show how user identifiers can be harvested through captive portals',
        ].map((s, i) => (
          <div key={i} className="flex gap-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            <span style={{ color: 'var(--color-amber)', flexShrink: 0 }}>→</span> {s}
          </div>
        ))}
      </div>

      <Divider />

      <SectionH>SkyJack — Drone WiFi Hijacking</SectionH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        Many consumer drones (especially older DJI models, Parrot, and hobbyist drones) use WiFi as the primary
        control protocol. The drone creates a WiFi AP and the controller app connects to it over a private IP range.
        The <strong style={{ color: 'var(--color-text)' }}>SkyJack</strong> module:
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
        {[
          { step: 'Scan', detail: 'Scans for WiFi APs with drone-characteristic SSIDs (ARDRONE, Parrot-AR, DJI-PHANTOM, etc.)' },
          { step: 'Deauth controller', detail: 'Sends deauth frames to disconnect the legitimate controller app from the drone AP' },
          { step: 'Connect to drone', detail: 'Connects Cardputer to the drone\'s WiFi AP — now in control network position' },
          { step: 'Send control commands', detail: 'Uses drone SDK/API (Parrot AR.Drone uses simple UDP commands) to issue flight instructions — land, hover, or navigate' },
        ].map(s => (
          <div key={s.step} className="p-3 rounded-lg" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-subtle)' }}>
            <div className="text-xs font-bold mb-1" style={{ color: 'var(--color-violet)', fontFamily: 'var(--font-display)' }}>{s.step}</div>
            <div className="text-[11px]" style={{ color: 'var(--color-text-faint)', lineHeight: '1.6' }}>{s.detail}</div>
          </div>
        ))}
      </div>
      <Callout kind="warn">
        DJI drones now use encrypted, proprietary control protocols (Lightbridge, OcuSync) that are not WiFi-based. SkyJack works only against older WiFi-based consumer drones. Newer models require dedicated RF hardware to interfere with.
      </Callout>

      <Divider />

      <SectionH>FindMyEvil — Apple Find My Network Abuse</SectionH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        Apple's <strong style={{ color: 'var(--color-text)' }}>Find My</strong> network uses hundreds of millions of Apple
        devices as anonymous relays. Any Bluetooth device advertising the Find My BLE advertisement format will be detected
        by nearby iPhones/Macs and its location encrypted and uploaded to Apple's servers.
      </p>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8', marginTop: '10px' }}>
        The <strong style={{ color: 'var(--color-text)' }}>FindMyEvil</strong> module repurposes this system for covert tracking:
      </p>
      <Code label="How FindMyEvil works conceptually">{`1. Cardputer generates a valid EC public key (per Apple's Find My crypto)
2. Broadcasts BLE advertisement in Apple's "Lost Mode" format
3. Nearby iPhones upload the encrypted location to Apple CDN
4. If you control the corresponding private key, you can:
   - Query Apple's servers for the encrypted location
   - Decrypt it to get precise GPS coordinates

= Covert GPS tracking via Apple's infrastructure
  without Apple's knowledge or authorization`}</Code>
      <Callout kind="info">
        This technique was originally described in the "Who Can Find My Devices?" academic paper (Usenix Security 2021). Apple has since added rate limiting and additional verification steps that partially mitigate abuse. Still interesting as a demonstration of how advertising infrastructure can be co-opted.
      </Callout>

      <Divider />

      <SectionH>WiFi Dead Drop</SectionH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        A <strong style={{ color: 'var(--color-text)' }}>dead drop</strong> is a spy tradecraft concept: a covert location
        where parties can exchange information without direct contact. The WiFi Dead Drop implements this digitally:
      </p>
      <div className="p-4 rounded-lg my-5" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
        <div className="text-xs font-mono" style={{ lineHeight: '2', color: 'var(--color-text-faint)' }}>
          <div style={{ color: 'var(--color-amber)' }}>How it works:</div>
          <div>1. Cardputer broadcasts a WiFi AP with a specific SSID (<IC>"DeadDrop_NODE1"</IC>)</div>
          <div>2. Party A connects, uploads file to /SD/evil/drops/ via HTTP</div>
          <div>3. Cardputer stores file on SD card</div>
          <div>4. Party B connects later, downloads the file</div>
          <div>5. No direct network connection between A and B needed</div>
          <div style={{ color: 'var(--color-steel)', marginTop: '8px' }}>Use case: covert message exchange in a location with shared physical presence</div>
        </div>
      </div>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        The WiFi signal only radiates ~20–50 meters. Both parties must be in the same building/area at different times.
        Files are stored only on the SD card — there's no internet connection or cloud storage involved.
      </p>

      <Divider />

      <SectionH>EvilChatMesh</SectionH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        <strong style={{ color: 'var(--color-text)' }}>EvilChatMesh</strong> creates an encrypted peer-to-peer mesh network
        between multiple Cardputer devices using ESP-NOW (Espressif's WiFi-based direct device protocol). Features:
      </p>
      <SpecTable rows={[
        ['Protocol', 'ESP-NOW — operates at 802.11 management frame level, bypasses AP association'],
        ['Range', '~100m line-of-sight, ~50m through walls'],
        ['Encryption', 'AES-128 encryption of message payload'],
        ['Topology', 'Peer-to-peer mesh — messages hop between devices'],
        ['Infrastructure', 'No AP, router, or internet required — completely off-grid'],
        ['Use case', 'Covert coordination between multiple operators during a pentest engagement'],
      ]} />

      <Divider />

      <SectionH>SIP Toolkit — VoIP Attacks</SectionH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        <strong style={{ color: 'var(--color-text)' }}>SIP (Session Initiation Protocol)</strong> is the signaling protocol
        used by most VoIP systems. The Cardputer's SIP Toolkit:
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
        {[
          { name: 'SIP User Enumeration', desc: 'Brute-force SIP extension numbers to discover valid accounts on a PBX.' },
          { name: 'SIP REGISTER Flood', desc: 'Exhaust SIP server resources with fake REGISTER requests — denial of service against VoIP infrastructure.' },
          { name: 'Fake Caller ID', desc: 'Send SIP INVITE with spoofed "From:" header to impersonate any number on SIP trunks with no authentication.' },
          { name: 'SIP Auth Capture', desc: 'Man-in-the-middle SIP authentication challenges to capture SIP credentials (MD5 digest).' },
        ].map(item => (
          <div key={item.name} className="p-3 rounded-lg" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-subtle)' }}>
            <div className="text-xs font-bold mb-1" style={{ color: 'var(--color-green)', fontFamily: 'var(--font-display)' }}>{item.name}</div>
            <div className="text-[11px]" style={{ color: 'var(--color-text-faint)', lineHeight: '1.6' }}>{item.desc}</div>
          </div>
        ))}
      </div>

      <Divider />

      <SectionH>CCTV Toolkit</SectionH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        IP cameras on the network are frequently misconfigured with default credentials or no authentication. The CCTV Toolkit:
      </p>
      <SpecTable rows={[
        ['Camera discovery', 'Scans network for IP cameras (ports 80, 554 RTSP, 8080)'],
        ['Default creds', 'Tests common default credentials: admin/admin, admin/12345, admin/password, root/root'],
        ['RTSP streams', 'Connects to RTSP video streams to view live footage'],
        ['Snapshot capture', 'Saves still frames from camera streams to SD card'],
        ['Brands covered', 'Hikvision, Dahua, Axis, Foscam, Reolink (common brands with known vulnerabilities)'],
      ]} />
      <Callout kind="info">
        A 2023 Shodan study found over 20 million internet-exposed IP cameras. On internal networks, misconfigured cameras are even more common — often on isolated VLANs but reachable from the WiFi guest network, making them easy Cardputer targets.
      </Callout>

      <Divider />

      <SectionH>Send Tesla Code with RFUnit</SectionH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        Requires the M5Stack RF Unit module (CC1101 sub-GHz transceiver). The CC1101 operates on 315/433/868/915 MHz —
        frequencies used by key fobs, garage doors, and some wireless sensors.
      </p>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8', marginTop: '10px' }}>
        <strong style={{ color: 'var(--color-text)' }}>"Tesla Code"</strong> refers to rolling code RF protocols used by Tesla vehicles
        (and other modern keyless entry systems). The feature demonstrates RF signal capture and replay:
      </p>
      <div className="p-4 rounded-lg my-4 font-mono text-xs" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', lineHeight: '2' }}>
        <div style={{ color: 'var(--color-text-faint)' }}>Simple RF replay (fixed code — older systems):</div>
        <div>1. Capture: record key fob RF signal</div>
        <div>2. Replay: retransmit same signal → door opens</div>
        <div className="mt-1" style={{ color: 'var(--color-text-faint)' }}>Rolling code (Keeloq — modern systems):</div>
        <div>Each press uses a new code <span style={{ color: 'var(--color-red)' }}>→</span> simple replay doesn't work</div>
        <div>Requires relay attack or RollJam technique <span style={{ color: 'var(--color-amber)' }}>(advanced, requires 2 radios)</span></div>
      </div>
      <Callout kind="warn">
        Interfering with vehicle access systems is illegal. This feature is for educational understanding of RF security concepts and should only be tested on personal equipment with permission.
      </Callout>

      <Divider />

      <SectionH>LLM Chat Stream</SectionH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        Requires the M5Stack LLM Module connected via Grove/UART. Runs a local quantized LLM (language model) directly
        on the device — no internet connection. Provides:
      </p>
      <div className="space-y-1 my-3">
        {[
          'Offline AI chat interface directly on the Cardputer display',
          'Query for attack techniques, payload generation, and target research — without internet',
          'Useful in RF-isolated environments or when internet connectivity is unavailable',
          'Models available: Qwen, LLaMA variants optimized for the M5Stack LLM hardware',
        ].map((s, i) => (
          <div key={i} className="flex gap-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            <span style={{ color: 'var(--color-amber)', flexShrink: 0 }}>▸</span> {s}
          </div>
        ))}
      </div>

      <Divider />

      <SectionH>PwnGrid Spam</SectionH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        <strong style={{ color: 'var(--color-text)' }}>Pwnagotchi</strong> is a Raspberry Pi-based WiFi pentest device that
        passively captures WPA2 handshakes and uses AI to optimize its capture strategy. Multiple Pwnagotchi devices
        can communicate via the PwnGrid mesh network.
      </p>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8', marginTop: '10px' }}>
        The Cardputer's PwnGrid Spam feature broadcasts fake Pwnagotchi advertisement frames, appearing as dozens of
        Pwnagotchi devices to anyone monitoring the PwnGrid channel. Mostly used for trolling other pentesters in
        CTF/competition environments.
      </p>

      <Divider />

      <SectionH>CIW Zero-Click Attack</SectionH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        <strong style={{ color: 'var(--color-text)' }}>Zero-click attacks</strong> are exploits that require no user interaction —
        the attack succeeds just by being near the target device. The CIW (Client-Initiated WiFi) Zero-Click module
        exploits vulnerabilities in the WiFi driver's handling of specific management frame sequences that some devices
        process before fully authenticating.
      </p>
      <Callout kind="danger">
        Zero-click WiFi vulnerabilities are extremely serious and typically CVE-tracked. Examples: FragAttacks (CVE-2020-26139 through CVE-2020-26145), various iPhone WiFi driver bugs. These require no user interaction to execute code on a target device within WiFi range. Keep your devices fully patched. The Cardputer feature demonstrates the concept using publicly known proof-of-concept techniques.
      </Callout>

      <Divider />

      <SectionH>UART Shell</SectionH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        The <strong style={{ color: 'var(--color-text)' }}>UART Shell</strong> gives a serial terminal interface accessible
        via the Cardputer's USB-C port at <strong style={{ color: 'var(--color-text)' }}>115200 baud</strong>. Use this for:
      </p>
      <Code label="Connect via serial terminal">{`# macOS / Linux:
screen /dev/tty.usbserial-* 115200
# or:
minicom -b 115200 -D /dev/ttyUSB0

# Windows:
# PuTTY → Serial → COM port → 115200 baud

# What you get:
# Real-time attack output
# File system access (read/write SD card)
# Debug output from firmware
# Direct command execution`}</Code>
    </div>
  )
}
