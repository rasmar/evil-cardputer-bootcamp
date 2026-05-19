import { ModuleHeader, SectionH, SubH, Steps, Callout, Code, IC, SpecTable, Divider } from '../components/UI'

export default function ModuleInstallation() {
  return (
    <div>
      <ModuleHeader
        num="02"
        title="Installation & Setup"
        subtitle="Flash the firmware, prepare your SD card, and configure your Cardputer for first operation."
      />

      <SectionH>Three Installation Methods</SectionH>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-5">
        {[
          { n: 'A', name: 'M5Burner', best: 'Best for beginners', desc: 'GUI tool, no command line needed. Download M5Burner from M5Stack, search "evil-", select and flash.', color: 'var(--color-green)' },
          { n: 'B', name: 'Community Launcher', best: 'Best for multi-firmware', desc: 'Flash a launcher that lets you switch between multiple firmwares without a PC. Supports Evil-M5, Bruce, and others.', color: 'var(--color-amber)' },
          { n: 'C', name: 'Arduino IDE', best: 'Best for developers', desc: 'Compile from source. Enables customization, debugging, and contributing. Requires library management.', color: 'var(--color-steel)' },
        ].map(m => (
          <div key={m.n} className="p-4 rounded-lg" style={{ background: 'var(--color-surface)', border: `1px solid ${m.color}44` }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: m.color + '33', color: m.color, fontFamily: 'var(--font-mono)' }}>{m.n}</span>
              <span className="text-sm font-bold" style={{ color: m.color, fontFamily: 'var(--font-display)' }}>{m.name}</span>
            </div>
            <div className="text-[10px] mb-1" style={{ color: m.color + 'aa' }}>{m.best}</div>
            <div className="text-xs" style={{ color: 'var(--color-text-faint)', lineHeight: '1.6' }}>{m.desc}</div>
          </div>
        ))}
      </div>

      <Divider />

      <SectionH>Method A — M5Burner (Recommended for Beginners)</SectionH>
      <Steps steps={[
        {
          title: 'Download M5Burner',
          body: <>Download M5Burner from the official M5Stack website (m5stack.com). Available for Windows, macOS, and Linux. Install and launch it.</>
        },
        {
          title: 'Connect the Cardputer via USB-C',
          body: <>Use a data-capable USB-C cable (not charge-only). The Cardputer will appear as a COM port (Windows) or <IC>/dev/ttyUSB0</IC> or <IC>/dev/tty.usbserial-*</IC> (macOS/Linux). If it doesn't appear, install the CP2104 or CH9102 USB driver.</>
        },
        {
          title: 'Find the Evil-M5 firmware',
          body: <>In M5Burner, select "Cardputer" from the device dropdown. In the search bar type <IC>evil-</IC>. You should see "Evil-M5Project" appear. Select it and click Download.</>
        },
        {
          title: 'Flash the firmware',
          body: <>Once downloaded, click "Burn". M5Burner will erase the existing firmware and flash Evil-M5Project. The process takes 30–60 seconds. Do not disconnect during flashing.</>
        },
        {
          title: 'Prepare the SD card (next section)',
          body: <>Firmware alone is not enough. The device will show an error on boot if the SD card is absent or mis-configured. Prepare it before first boot.</>
        },
      ]} />

      <Callout kind="tip">
        If setting up multiple devices at once: pre-flash each Cardputer and prepare SD cards in advance. Flashing via M5Burner over a shared WiFi network can be slow. Use a USB hub with multiple ports.
      </Callout>

      <SectionH>Method C — Arduino IDE (Source Compilation)</SectionH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8', marginBottom: '12px' }}>
        Compiling from source gives access to unreleased features and lets participants understand the codebase. This is the recommended deep-dive path.
      </p>

      <SubH>Required Arduino Libraries</SubH>
      <SpecTable rows={[
        ['Adafruit NeoPixel',  'LED control — install via Library Manager'],
        ['ArduinoJson',        'JSON parsing — v6.x, install via Library Manager'],
        ['ESPping',            'ICMP ping support — install via Library Manager'],
        ['IniFile',            'INI config file parser — install via Library Manager'],
        ['M5GFX',             'M5Stack display driver — install via Library Manager'],
        ['M5Unified',         'M5Stack hardware abstraction — install via Library Manager'],
        ['TinyGPSPlus',       'GPS NMEA parsing — install via Library Manager (for GPS module)'],
        ['ESP32 Board Package', 'Espressif ESP32 Arduino core v2.1.4 or earlier'],
      ]} />

      <Code label="Arduino IDE compile settings for Cardputer">{`Board:              M5Stack-Cardputer
CPU Frequency:      240 MHz (WiFi/BT)
Flash Mode:         QIO
Flash Size:         8MB (64Mb)
Partition Scheme:   8M with spiffs (3MB APP/1.5MB SPIFFS)
PSRAM:              Disabled  ← IMPORTANT: must be off
Upload Speed:       921600
Port:               /dev/ttyUSB0 (or your port)`}</Code>

      <Callout kind="danger">
        Using ESP32 Arduino core <strong>v2.1.5 or later</strong> breaks compatibility. Stick to v2.1.4 or below. The issue is with changes to the esp_wifi_80211_tx() function used for frame injection.
      </Callout>

      <Divider />

      <SectionH>SD Card Preparation (Mandatory)</SectionH>
      <Steps steps={[
        {
          title: 'Format as FAT32',
          body: <>On Windows: right-click drive → Format → FAT32. On macOS: <IC>diskutil eraseDisk FAT32 EVIL /dev/diskX</IC>. On Linux: <IC>mkfs.fat -F32 /dev/sdX</IC>. Use 32 KB allocation unit size for performance.</>
        },
        {
          title: 'Create the directory structure',
          body: <>Create these exact folders. Evil-M5Project will not function without them.</>
        },
        {
          title: 'Copy captive portal templates',
          body: <>Download the Evil-M5Project GitHub repository. Copy the <IC>/SD/evil/sites/</IC> folder contents to your SD card. Each subfolder contains an index.html portal template.</>
        },
        {
          title: 'Copy NTLM payload files',
          body: <>Copy the contents of <IC>/SD/evil/NTLM/</IC> from the repo. These contain the NTLM relay challenge files used by the Responder module.</>
        },
        {
          title: 'Insert and verify',
          body: <>Insert the SD card before powering on. After boot, navigate to FileManager in the Evil-M5 menu to verify the directory structure was detected correctly.</>
        },
      ]} />

      <Code label="SD card — full directory structure">{`/SD/evil/
├── IMG/
│   └── (portal images, .jpg/.png)
├── sites/
│   ├── isp_login/
│   │   ├── index.html
│   │   └── style.css
│   ├── hotel_wifi/
│   │   └── index.html
│   ├── google_auth/
│   │   └── index.html
│   └── (custom portals...)
├── NTLM/
│   └── (NTLM relay files)
├── config/
│   └── theme.ini    ← optional, Cardputer only
├── probes/
│   └── (probe log .txt files)
├── handshakes/
│   └── (captured .pcap files)
└── logs/
    └── (credential captures)`}</Code>

      <Divider />

      <SectionH>Enable Frame Injection (Required for Deauth)</SectionH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        By default, Espressif's ROM firmware blocks direct 802.11 management frame injection (the <IC>esp_wifi_80211_tx()</IC> function
        returns an error). The Evil-M5Project repository includes a patch script that replaces the relevant ROM functions.
        Run it once after flashing:
      </p>
      <Code label="Terminal — patch for deauth capability">{`# From the Evil-M5Project repository root:
cd utilities/
./deauth_prerequisites

# On Windows, run the .bat equivalent:
deauth_prerequisites.bat`}</Code>

      <Callout kind="warn">
        This patches the Espressif ROM. Re-flashing stock firmware removes the patch. You'll need to re-apply it if you reflash. The patch is device-specific — it won't damage anything, but only works on the exact firmware version you're running.
      </Callout>

      <SectionH>BadUSB Library Setup (Optional)</SectionH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        The BadUSB/HID attack feature requires an additional Arduino library for USB HID emulation. Without it,
        the BadUSB menu item will appear but fail to execute payloads.
      </p>
      <Code label="BadUSB library installation">{`# From the Evil-M5Project repository:
cd utilities/Bad_Usb_Lib/
# Follow the README.md in that folder for library placement

# The library goes into your Arduino libraries folder:
# macOS:   ~/Documents/Arduino/libraries/
# Windows: C:\Users\<user>\Documents\Arduino\libraries\
# Linux:   ~/Arduino/libraries/`}</Code>

      <SectionH>Custom Theming (Cardputer Only)</SectionH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8', marginBottom: '12px' }}>
        The Cardputer version supports a <IC>theme.ini</IC> file on the SD card for custom color palettes:
      </p>
      <Code label="/SD/evil/config/theme.ini">{`[theme]
background=0x0000     ; black background (RGB565)
text=0xFFFF           ; white text
accent=0xFD20         ; orange accent
border=0x2945         ; dark border
highlight=0x07FF      ; cyan highlight`}</Code>
      <p className="text-xs mt-1" style={{ color: 'var(--color-text-faint)' }}>Colors are in RGB565 hex format. Use an online RGB565 converter for custom colors.</p>

      <Divider />

      <SectionH>First Boot Checklist</SectionH>
      <div className="space-y-2 my-4">
        {[
          'SD card formatted FAT32, directory structure present',
          'Portal templates copied to /SD/evil/sites/',
          'NTLM files copied to /SD/evil/NTLM/',
          'Device connected via USB-C (data cable, not charge-only)',
          'M5Burner shows firmware version in device info',
          'On boot: main menu appears (Scan WiFi / Captive Portal / Deauther / etc.)',
          'FileManager in menu shows /evil/ directory',
          'Keyboard navigation: G key = go/confirm, arrow keys = navigate',
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            <span className="flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center text-[10px] mt-0.5" style={{ border: '1px solid var(--color-green)', color: 'var(--color-green)' }}>✓</span>
            {item}
          </div>
        ))}
      </div>

      <SectionH>Navigation Basics</SectionH>
      <SpecTable rows={[
        ['Arrow keys',       'Navigate menus up/down/left/right'],
        ['G (Enter/Go)',     'Select / confirm action'],
        ['Esc / Back',       'Return to previous menu'],
        ['Fn + key',         'Special functions (varies by feature)'],
        ['USB-C connected',  'Serial console at 115200 baud for debug output'],
      ]} />
    </div>
  )
}
