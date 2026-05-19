import { ModuleHeader, SectionH, SubH, SpecTable, Callout, Code, Divider, Tag } from '../components/UI'

export default function ModuleHardware() {
  return (
    <div>
      <ModuleHeader
        num="01"
        title="Hardware Overview"
        subtitle="Understand the M5Stack Cardputer — its internals, limitations, and why it's the perfect pentesting pocket tool."
      />

      <SectionH>What is the M5Stack Cardputer?</SectionH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        The M5Stack Cardputer is a credit-card-sized computer built around an <strong style={{ color: 'var(--color-text)' }}>ESP32-S3</strong> microcontroller.
        It ships with a QWERTY keyboard, a 1.14" LCD display, a microphone, a USB-C port, and an infrared transmitter —
        all in a form factor that fits in a shirt pocket. At its heart it's a capable RF platform: the ESP32-S3's WiFi
        radio can be put into <strong style={{ color: 'var(--color-amber)' }}>promiscuous / monitor mode</strong>, meaning it can
        receive raw 802.11 frames rather than only frames addressed to itself.
      </p>

      <Callout kind="info">
        Unlike a laptop running Kali, the Cardputer draws ~150 mA from its 120 mAh battery — giving roughly 45–90 minutes
        of active operation, or much longer in passive/sniffing modes. An external USB power bank dramatically extends field time.
      </Callout>

      <SectionH>Core Specifications</SectionH>
      <SpecTable rows={[
        ['MCU',              'ESP32-S3FN8 (Xtensa LX7 dual-core, 240 MHz)'],
        ['Flash',            '8 MB on-chip Flash (SPIFFS partition for Evil-M5)'],
        ['PSRAM',            'None — ESP32-S3FN8 has no embedded PSRAM (set PSRAM: Disabled in Arduino IDE)'],
        ['WiFi',             '802.11 b/g/n 2.4 GHz (HT20/HT40), monitor mode capable'],
        ['Bluetooth',        'BLE 5.0 + Classic BT (Bluetooth HID supported)'],
        ['Display',          '1.14" IPS LCD, 240×135 px, ST7789V2 driver'],
        ['Keyboard',         '56-key QWERTY (SPI-connected M5GO keyboard)'],
        ['Storage',          'TF/MicroSD slot (mandatory for Evil-M5Project)'],
        ['USB',              'USB-C, OTG capable (BadUSB / HID emulation)'],
        ['Infrared',         'IR TX (850 nm) — not used by Evil-M5 by default'],
        ['Microphone',       'SPM1423 PDM mic (for audio/LLM module)'],
        ['Battery',          '120 mAh LiPo (internal), charges via USB-C'],
        ['Expansion Port',   'Grove (I2C+UART), GPIO header — add GPS, RF modules'],
      ]} />

      <Divider />

      <SectionH>ESP32-S3 WiFi Radio Deep Dive</SectionH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        The ESP32-S3's WiFi subsystem is handled by a dedicated RF chip layered with Espressif's closed-source
        PHY/MAC firmware. At the application level, developers access it through the esp-idf WiFi driver, which
        exposes several operating modes critical to Evil-M5Project:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-5">
        {[
          { mode: 'STA Mode', desc: 'Station — connects to an existing AP as a normal WiFi client. Used for network scanning and attacks that require being associated.', color: 'var(--color-steel)' },
          { mode: 'AP Mode', desc: 'Access Point — the device itself becomes a hotspot. Used for Evil Twin, Karma, captive portals, rogue DHCP.', color: 'var(--color-amber)' },
          { mode: 'AP+STA', desc: 'Simultaneous AP and STA. Allows Cardputer to serve a captive portal while relaying internet via an upstream AP.', color: 'var(--color-violet)' },
          { mode: 'Promiscuous', desc: 'Monitor/sniffer mode. Receives ALL 802.11 frames in range, not just those addressed to this device. Used for handshake capture, probe sniffing, raw sniffing.', color: 'var(--color-red)' },
        ].map(m => (
          <div key={m.mode} className="p-4 rounded-lg" style={{ background: 'var(--color-surface)', border: `1px solid ${m.color}44` }}>
            <div className="text-sm font-bold mb-1" style={{ color: m.color, fontFamily: 'var(--font-display)' }}>{m.mode}</div>
            <div className="text-xs" style={{ color: 'var(--color-text-faint)', lineHeight: '1.6' }}>{m.desc}</div>
          </div>
        ))}
      </div>

      <Callout kind="warn">
        <strong>Transmit power:</strong> The ESP32-S3 supports up to ~20 dBm (100 mW) TX power, which is legally permitted for WiFi in most regions.
        Evil-M5Project uses the maximum power by default to ensure evil twin APs appear more attractive than the real AP (stronger signal = higher priority in auto-connect).
      </Callout>

      <SectionH>The SD Card: Mandatory Storage Layer</SectionH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        Evil-M5Project requires an SD card at all times. It stores captive portal HTML/CSS files,
        captured credentials, probe logs, handshake (.pcap) captures, NTLM hashes, theme configuration,
        and GPS wardriving data. The required directory structure:
      </p>
      <Code label="/SD card structure">{`/SD/
└── evil/
    ├── IMG/          ← Captive portal images
    ├── sites/        ← Portal HTML templates (index.html per folder)
    ├── NTLM/         ← NTLM relay payloads
    ├── config/       ← Device config files
    ├── probes/       ← Probe request captures
    ├── handshakes/   ← .pcap handshake files
    └── logs/         ← General activity logs`}</Code>

      <SubH>SD Card Requirements</SubH>
      <SpecTable rows={[
        ['Capacity',     '4 GB minimum, 32 GB recommended'],
        ['Format',       'FAT32 (exFAT is NOT supported by the ESP32 SD driver)'],
        ['Speed class',  'Class 10 / UHS-I or better for reliable file writes during sniffing'],
        ['MicroSD type', 'TF/MicroSD — standard-size SD via adapter is fine'],
      ]} />

      <Divider />

      <SectionH>Expansion Modules</SectionH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        The Cardputer's Grove port enables powerful add-ons that unlock additional Evil-M5Project features:
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-5">
        {[
          { name: 'M5Stack GPS Module', feature: 'Wardriving Master — logs WiFi networks with GPS coordinates to .csv for Wigle.net mapping', tag: 'Wardriving', color: 'var(--color-green)' },
          { name: 'M5Stack RFUnit (CC1101)', feature: 'Sub-GHz RF attacks — Tesla code replay, 315/433/868/915 MHz signal analysis and replay', tag: 'RF', color: 'var(--color-violet)' },
          { name: 'LLM Module (M5Stack)', feature: 'Local language model over UART. Enables LLM Chat Stream feature for offline AI interaction', tag: 'AI', color: 'var(--color-amber)' },
        ].map(m => (
          <div key={m.name} className="p-3 rounded-lg" style={{ background: 'var(--color-surface)', border: `1px solid ${m.color}33` }}>
            <div className="text-xs font-bold mb-1" style={{ color: m.color, fontFamily: 'var(--font-display)' }}>{m.name}</div>
            <div className="text-[11px] mb-2" style={{ color: 'var(--color-text-faint)', lineHeight: '1.5' }}>{m.feature}</div>
            <Tag color={m.tag === 'Wardriving' ? 'green' : m.tag === 'RF' ? 'violet' : 'amber'}>{m.tag}</Tag>
          </div>
        ))}
      </div>

      <SectionH>Hardware Limitations to Know</SectionH>
      <div className="space-y-2 my-4">
        {[
          { limit: '2.4 GHz only', detail: 'The ESP32-S3 WiFi radio is 2.4 GHz only. Most modern routers are dual-band (2.4+5 GHz). You will not see 5 GHz networks. Evil twin attacks only work against clients that fall back to 2.4 GHz.' },
          { limit: 'No packet injection by default', detail: 'Espressif\'s firmware blocks raw packet injection. The Evil-M5Project includes a patched binary (deauth_prerequisites script) that enables the esp_wifi_80211_tx() function for management frame injection.' },
          { limit: 'Single channel at a time', detail: 'The radio can only monitor/operate on one channel at a time. Channel hopping with a dwell time of ~100ms is used for scanning, but you may miss short bursts on other channels.' },
          { limit: 'No 802.11ac/ax (WiFi 5/6)', detail: 'The ESP32-S3 supports 802.11 b/g/n only (WiFi 4, max 150 Mbps). Devices connected to 5 GHz 802.11ac APs will be invisible.' },
          { limit: 'Antenna', detail: 'The built-in PCB antenna provides ~3–5 meter range for injection. An external antenna via the U.FL connector (not on all models) significantly extends range.' },
        ].map(l => (
          <div key={l.limit} className="flex gap-3 p-3 rounded-lg" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-subtle)' }}>
            <span className="text-xs font-bold flex-shrink-0 mt-0.5" style={{ color: 'var(--color-red)', fontFamily: 'var(--font-display)', minWidth: '160px' }}>{l.limit}</span>
            <span className="text-xs" style={{ color: 'var(--color-text-faint)', lineHeight: '1.6' }}>{l.detail}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
