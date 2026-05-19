import { ModuleHeader, SectionH, SubH, Callout, Code, IC, SpecTable, Divider } from '../components/UI'
import { DHCPDiagram, NTLMDiagram, MITMDiagram } from '../components/Diagrams'

export default function ModuleNetworkAttacks() {
  return (
    <div>
      <ModuleHeader
        num="06"
        title="Network Layer Attacks"
        subtitle="DHCP starvation, rogue DHCP, DNS hijacking, NTLM credential capture, WPAD abuse, and lateral movement tools — attacking the infrastructure once you're on the network."
      />

      <SectionH>Network Scanning — The First Step After Association</SectionH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        Once the Cardputer is associated with a target network (or acting as its gateway), the first step is reconnaissance:
        map the live hosts, open ports, and running services.
      </p>
      <SpecTable rows={[
        ['Scan Network & Port', 'Ping sweep + port scan against a CIDR range. Identifies live hosts and open TCP ports.'],
        ['Full Network Scan',   'Comprehensive enumeration: OS fingerprinting, service version detection, topology mapping.'],
        ['Web Crawler',         'Enumerate web resources on discovered HTTP/HTTPS services.'],
        ['UPnP Mapping',        'Discover UPnP-enabled devices and their exposed services (printers, NAS, smart TVs, routers).'],
      ]} />
      <Code label="What to look for in scan results">{`# High-value discovery targets:
Port 80/443  → Web applications (potential credential capture)
Port 445     → SMB (Windows file sharing → NTLM relay target)
Port 389     → LDAP (Active Directory → LDAPDump)
Port 139     → NetBIOS → NBT-NS poisoning
Port 22      → SSH (credential brute force or key-based entry)
Port 3389    → RDP (Windows Remote Desktop)
Port 631     → IPP printers (Printer Attack)
Port 1900    → UPnP SSDP discovery
Port 5353    → mDNS (Apple devices, local service discovery)
Port 5985    → WinRM (Windows Remote Management)`}</Code>

      <Divider />

      <SectionH>DHCP Protocol & Starvation Attack</SectionH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        The <strong style={{ color: 'var(--color-text)' }}>Dynamic Host Configuration Protocol (DHCP)</strong> automatically
        assigns IP addresses to devices joining a network. It follows the DORA sequence:
        <strong style={{ color: 'var(--color-amber)' }}> Discover → Offer → Request → Acknowledge</strong>.
        DHCP servers maintain a finite pool of IP addresses to lease.
      </p>
      <DHCPDiagram />

      <SubH>DHCP Starvation</SubH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        The Cardputer sends hundreds of DHCP Discover frames with <strong style={{ color: 'var(--color-text)' }}>randomly generated source MAC addresses</strong>.
        Each unique MAC gets a lease, exhausting the DHCP pool. Legitimate clients then receive
        <IC>No DHCP server found</IC> errors and cannot obtain an IP address — effectively a network denial-of-service.
      </p>
      <Callout kind="info">
        <strong>Why random MACs work:</strong> DHCP servers allocate leases based on MAC address. Since each spoofed MAC is unique, the server believes each request is from a different device and dutifully hands out a lease. Standard lease times are 24 hours, so starvation persists even after the attack stops.
      </Callout>

      <SubH>Rogue DHCP Server</SubH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        The Cardputer starts its own DHCP server on the network. Any client whose DHCP Discover reaches the Cardputer
        first gets a lease with:
      </p>
      <div className="p-4 rounded-lg my-4 font-mono text-xs" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', lineHeight: '2' }}>
        <div>IP Address: <span style={{ color: 'var(--color-steel)' }}>192.168.1.x</span> (valid range)</div>
        <div>Default Gateway: <span style={{ color: 'var(--color-amber)' }}>192.168.1.254</span> (Cardputer — NOT the real router)</div>
        <div>DNS Server: <span style={{ color: 'var(--color-red)' }}>192.168.1.254</span> (Cardputer — poisoned DNS)</div>
        <div>Subnet Mask: <span style={{ color: 'var(--color-text-muted)' }}>255.255.255.0</span></div>
      </div>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        The victim's device has no way to distinguish a legitimate DHCP server from a rogue one — DHCP has no authentication.
        The first <IC>DHCPOFFER</IC> received wins. This is why many enterprise switches implement <strong style={{ color: 'var(--color-text)' }}>DHCP snooping</strong>:
        only specific trusted ports are allowed to send DHCP offers.
      </p>
      <MITMDiagram />

      <Divider />

      <SectionH>DNS Switch / Network Hijacking</SectionH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        <strong style={{ color: 'var(--color-text)' }}>DNS (Domain Name System)</strong> translates human-readable domain names
        (google.com) into IP addresses (142.250.x.x). By controlling the DNS server a client uses (via rogue DHCP),
        the Cardputer can respond to DNS queries with arbitrary IP addresses — redirecting any domain to any server.
      </p>
      <Code label="DNS Hijacking in action">{`# Client wants to visit google.com:
Client: DNS query → "What is google.com?"
Cardputer DNS: "google.com = 192.168.4.1"  ← lies!

# Client opens browser → navigates to 192.168.4.1
# Cardputer serves fake Google login page
# User enters Google credentials → captured

# Can be applied to any domain:
# bank.com → fake bank page
# mail.company.com → fake OWA/webmail → NTLM trigger`}</Code>

      <SubH>Switch DNS</SubH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        <strong style={{ color: 'var(--color-text)' }}>Switch DNS</strong> modifies the DNS configuration on the local network
        by altering DHCP lease options mid-session (via DHCP NAK/reconfiguration) to point to the Cardputer's DNS server.
        Works on networks where the Cardputer already has a foothold or acting as gateway.
      </p>

      <Divider />

      <SectionH>Responder — LLMNR / NBT-NS Poisoning + NTLM Capture</SectionH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        The <strong style={{ color: 'var(--color-text)' }}>Responder</strong> feature is a port of the famous
        Windows credential capture tool to the Cardputer. It exploits two Windows name resolution fallback protocols:
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
        <div className="p-4 rounded-lg" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-violet)33' }}>
          <div className="text-sm font-bold mb-2" style={{ color: 'var(--color-violet)', fontFamily: 'var(--font-display)' }}>LLMNR</div>
          <div className="text-xs" style={{ color: 'var(--color-text-faint)', lineHeight: '1.6' }}>
            Link-Local Multicast Name Resolution. Used by Windows when DNS fails. Broadcasts a multicast query to 224.0.0.252 on port 5355 asking "Who is {'{hostname}'}?"
          </div>
        </div>
        <div className="p-4 rounded-lg" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-steel)33' }}>
          <div className="text-sm font-bold mb-2" style={{ color: 'var(--color-steel)', fontFamily: 'var(--font-display)' }}>NBT-NS</div>
          <div className="text-xs" style={{ color: 'var(--color-text-faint)', lineHeight: '1.6' }}>
            NetBIOS Name Service. Older Windows name resolution. Broadcasts over UDP port 137. Still enabled by default on modern Windows for compatibility.
          </div>
        </div>
      </div>
      <NTLMDiagram />

      <SubH>NTLM Authentication Challenge-Response</SubH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        When the Cardputer responds "I am FILESERVER", Windows automatically attempts to authenticate using{' '}
        <strong style={{ color: 'var(--color-text)' }}>NTLM (NT LAN Manager)</strong> challenge-response:
      </p>
      <div className="p-4 rounded-lg my-4 font-mono text-xs" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', lineHeight: '2' }}>
        <div>1. Client → Cardputer: <span style={{ color: 'var(--color-steel)' }}>NTLM Negotiate</span></div>
        <div>2. Cardputer → Client: <span style={{ color: 'var(--color-amber)' }}>NTLM Challenge</span> (random 8-byte nonce)</div>
        <div>3. Client → Cardputer: <span style={{ color: 'var(--color-red)' }}>NTLM Authenticate</span></div>
        <div>   Contains: Username, Domain, <span style={{ color: 'var(--color-red)' }}>NTHash(nonce + password)</span></div>
        <div style={{ color: 'var(--color-amber)', marginTop: '4px' }}>Cardputer captures: NTLMv2 hash → save to SD card</div>
      </div>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        The captured NTLMv2 hash can be cracked offline with hashcat (<IC>-m 5600</IC>) to recover the plaintext password,
        or relayed to authenticate against another service (Pass-the-Hash).
      </p>
      <Code label="Crack NTLMv2 hash (offline)">{`# Hash format saved by Responder:
# username::domain:challenge:response:response_ex
# admin::WORKGROUP:1122334455667788:a3f7b2...

hashcat -m 5600 ntlm_hashes.txt /wordlists/rockyou.txt

# With rules (much better coverage):
hashcat -m 5600 ntlm_hashes.txt rockyou.txt -r best64.rule

# The Cardputer also has an on-device NTLMv2 cracker:
# Menu → Crack NTLMv2 → loads hash from SD → runs dictionary`}</Code>

      <Callout kind="tip">
        <strong>Crack NTLMv2</strong> is also available directly on the Cardputer — it loads the captured NTLMv2 hashes from the SD card and runs a built-in dictionary attack on-device. Speed is slow compared to GPU cracking but requires no laptop.
      </Callout>

      <Divider />

      <SectionH>WPAD Abuse</SectionH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        <strong style={{ color: 'var(--color-text)' }}>WPAD (Web Proxy Auto-Discovery)</strong> is a protocol Windows uses
        to automatically find a proxy server. When enabled, Windows broadcasts a DHCP/DNS request for{' '}
        <IC>http://wpad.domain.local/wpad.dat</IC>. If the real WPAD server doesn't respond, LLMNR/NBT-NS broadcast queries
        follow — which Responder can poison.
      </p>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8', marginTop: '10px' }}>
        The Cardputer's WPAD Abuse feature:
      </p>
      <div className="space-y-1 my-3">
        {[
          'Responds to WPAD LLMNR queries claiming to be the WPAD server',
          'Serves a malicious wpad.dat file that routes all HTTP/HTTPS through the Cardputer as proxy',
          'Captures all proxy-relayed HTTP credentials and cookies',
          'Combined with SSDP poisoning for broader coverage',
        ].map((s, i) => (
          <div key={i} className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            <span style={{ color: 'var(--color-amber)' }}>→</span> {s}
          </div>
        ))}
      </div>

      <Divider />

      <SectionH>SSDP Poisoning & UPnP Exploitation</SectionH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        <strong style={{ color: 'var(--color-text)' }}>SSDP (Simple Service Discovery Protocol)</strong> is the discovery
        layer of UPnP. Devices like smart TVs, printers, NAS boxes, and IoT devices announce themselves via SSDP multicast on 239.255.255.250 port 1900.
      </p>
      <SpecTable rows={[
        ['SSDP Poisoning', 'Respond to SSDP M-SEARCH requests with fake service descriptions, redirecting device discovery to attacker-controlled URLs.'],
        ['UPnP Mapping',   'Enumerate all UPnP-enabled devices on the network and their exposed XML device descriptions.'],
        ['UPnP NAT',       'Abuse UPnP\'s AddPortMapping action to punch holes in the router\'s NAT — creating persistent port forwarding rules without authentication. Some routers allow this over WiFi.'],
      ]} />
      <Callout kind="info">
        UPnP NAT exploitation can create a backdoor into the internal network from the internet. If the router's WAN-facing UPnP is exposed (misconfiguration), an attacker on the LAN can create rules that tunnel inbound connections to internal hosts — all without a password.
      </Callout>

      <Divider />

      <SectionH>LDAPDump</SectionH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        On networks with Active Directory, the Cardputer's <strong style={{ color: 'var(--color-text)' }}>LDAPDump</strong> feature
        connects to the LDAP (Lightweight Directory Access Protocol) service (port 389) and attempts to extract:
      </p>
      <div className="grid grid-cols-2 gap-2 my-4">
        {[
          { item: 'User accounts', detail: 'All AD user accounts, email addresses, display names' },
          { item: 'Groups', detail: 'Security groups and their members' },
          { item: 'OUs', detail: 'Organizational Unit structure of the domain' },
          { item: 'Password policies', detail: 'Min length, complexity requirements, lockout policy' },
          { item: 'SPNs', detail: 'Service Principal Names — targets for Kerberoasting' },
          { item: 'Admin accounts', detail: 'Members of Domain Admins / Enterprise Admins' },
        ].map(r => (
          <div key={r.item} className="p-2.5 rounded" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-subtle)' }}>
            <div className="text-[11px] font-mono font-bold" style={{ color: 'var(--color-amber)' }}>{r.item}</div>
            <div className="text-[10px] mt-0.5" style={{ color: 'var(--color-text-faint)' }}>{r.detail}</div>
          </div>
        ))}
      </div>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        Anonymous LDAP bind is often enabled on misconfigured AD servers — no credentials needed. If credentials are available
        (from Responder capture), authenticated bind provides full directory access.
      </p>

      <Divider />

      <SectionH>Reverse TCP Tunnel & SSH Shell</SectionH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        The <strong style={{ color: 'var(--color-text)' }}>Reverse TCP Tunnel</strong> establishes an outbound TCP connection
        from the Cardputer to a remote C2 (command and control) server. Since outbound connections typically bypass firewalls,
        this provides persistent remote access from behind NAT:
      </p>
      <Code label="Conceptual reverse tunnel flow">{`# C2 Server (internet-facing):
nc -lvp 4444     # Listen for incoming connection

# Cardputer (inside target network):
# Menu → Reverse TCP → Enter C2 IP:port
# Establishes: Cardputer → NAT → Internet → C2 Server

# C2 now has a shell on the Cardputer and can
# relay commands into the internal network`}</Code>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8', marginTop: '10px' }}>
        <strong style={{ color: 'var(--color-text)' }}>SSH Shell</strong> provides an interactive shell via SSH for remote
        management of the Cardputer itself — useful for running commands, managing files, and controlling attacks from a laptop.
      </p>

      <Divider />

      <SectionH>Web Siphoning / Cookie Theft</SectionH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        <strong style={{ color: 'var(--color-text)' }}>Web Siphoning Cookie</strong> intercepts HTTP session cookies from
        unencrypted traffic passing through the Cardputer's MITM position. In practice:
      </p>
      <SpecTable rows={[
        ['HTTP traffic', 'Completely visible — all cookies, form data, page content readable in plaintext.'],
        ['HTTPS traffic', 'Encrypted end-to-end (TLS). Cookie values NOT readable without SSL stripping.'],
        ['SSL Stripping', 'Not implemented in Evil-M5, but HSTS preloading and modern browsers make this largely ineffective anyway.'],
        ['Captured format', 'Cookie: session=abc123; user=admin (saved to SD card)'],
      ]} />
      <Callout kind="info">
        Session cookies can be replayed in a browser (using developer tools) to assume the victim's authenticated session without knowing their password. This is called <strong>session hijacking</strong> or <strong>cookie replay</strong>.
      </Callout>

      <Divider />

      <SectionH>Printer Attack</SectionH>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        Network printers are frequently overlooked in security assessments. The Cardputer's <strong style={{ color: 'var(--color-text)' }}>Printer Attack</strong> module:
      </p>
      <div className="space-y-2 my-4">
        {[
          'Discovers printers via UPnP/SSDP and port 9100/631/80',
          'Exploits printers with no authentication or default credentials',
          'Reads print job history and documents from printer storage',
          'Retrieves printer address book (contains internal phone/email directory)',
          'Can send print jobs or trigger network print to capture NTLMv2 auth',
          'Extracts WiFi credentials stored in printer config (many printers save WiFi PSK)',
        ].map((s, i) => (
          <div key={i} className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            <span style={{ color: 'var(--color-red)', flexShrink: 0 }}>▸</span> {s}
          </div>
        ))}
      </div>
      <Callout kind="warn">
        Enterprise printers (Xerox, Ricoh, Konica) often store scanned documents and print job history. Administrative credentials (admin/admin, admin/password) on the web interface are common default configurations rarely changed by IT. They also frequently join Active Directory — making them targets for credential extraction.
      </Callout>
    </div>
  )
}
