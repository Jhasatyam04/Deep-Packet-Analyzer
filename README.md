# Deep Packet Analyser

> An enterprise-grade passive Intrusion Prevention System (IPS) and Deep Packet Inspection (DPI) engine built with Java and React.js.

## The Problem

Traditional network monitoring tools are often purely passive loggers (like Wireshark) or require complex, inline firewall routing configurations to actively block threats. Getting real-time visibility into application-layer traffic (like TLS Server Name Indication) while having the ability to dynamically drop connections without being inline is notoriously difficult.

## The Solution

**Deep Packet Analyser** is a passive, out-of-band DPI engine that sniffs traffic directly on the wire, extracts TLS SNI in real-time, and actively kills unauthorized connections by injecting forged TCP Reset (RST) packets. All telemetry and threat mitigations are streamed to a stunning, modern dark-navy flat-design React.js dashboard.

| Component | Responsibility |
|-----------|----------------|
| **Security Engine (Java)** | High-performance packet capture, connection tracking, and SNI extraction. |
| **TCP RST Injector** | Actively forges and injects TCP Reset packets to tear down blocked connections. |
| **Network Protection Dashboard** | Real-time visualization of network health, processed packets, and blocked threats. |

## System Architecture

### 1. High-Performance Packet Sniffing
**Bind locally, process globally.** 
Using Pcap4J, the Security Engine binds directly to physical network interfaces (Wi-Fi/Ethernet) in promiscuous mode, capturing thousands of raw network packets per second without impeding actual network throughput.

### 2. Multi-Threaded Fast Path
**Scale processing horizontally.**
Raw packets are load-balanced across multiple Fast Path (FP) threads. Each thread parses the Ethernet, IPv4, and TCP layers independently, tracking the state of every single network flow concurrently.

### 3. Deep Packet Inspection & SNI Extraction
**Inspect before encryption.**
When a client connects to a website, the engine intercepts the initial `TLS Client Hello` handshake. It extracts the Server Name Indication (SNI) string (e.g., `github.com`) in real-time before encryption begins, classifying the application layer traffic accurately.

### 4. Active Threat Mitigation
**Passive sniffing, active blocking.**
Instead of just logging traffic, the engine acts as an active Intrusion Prevention System (IPS). When it detects a blacklisted domain, it calculates the required TCP Sequence and Acknowledgment numbers, swaps the Source/Destination IPs and MACs, and fires forged TCP Reset packets to aggressively destroy the connection.

## Installation & Setup

### Requirements
* **Java 21** (or higher)
* **Node.js** (for the frontend)
* **Npcap** (Windows) or **libpcap** (Linux/macOS)

### 1. Start the Security Engine (Backend)
```bash
cd dpi_engine
./mvnw clean install
./mvnw spring-boot:run
```
*Note: Ensure you are running your terminal with Administrator/Root privileges so Pcap4J can bind to the network adapters.*

### 2. Start the Network Protection Dashboard (Frontend)
```bash
cd dpi_dashboard
npm install
npm run web
```

### 3. Usage
1. Open the dashboard at `http://localhost:8081`
2. Click **Start Monitoring** to begin sniffing your active network adapter.
3. In the **Access Control** section, add a domain.
4. Attempt to visit the domain in an Incognito browser window and watch the connection get instantly reset (`ERR_CONNECTION_RESET`).

## Important Networking Limitations

* **HTTP/3 (QUIC):** Modern browsers aggressively use QUIC (UDP) for sites like Google, YouTube, and Reddit. Because QUIC encrypts the SNI payload and uses connectionless UDP, a passive out-of-band injector cannot easily "reset" the connection. To test blocking on QUIC-enabled sites, you must disable the `Experimental QUIC protocol` flag in your browser to force a fallback to standard TCP TLS 1.3.
