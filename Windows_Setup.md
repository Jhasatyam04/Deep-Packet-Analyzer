# Windows Setup Guide

This guide covers everything you need to install on Windows to build and run the **Deep Packet Analyzer** (Java Backend + React.js Frontend).

---

## 1. Install Npcap (Required for Packet Sniffing)

The Java backend uses Pcap4J to sniff the network wire. On Windows, this requires **Npcap**.

1. Download **Npcap**: [https://npcap.com/#download](https://npcap.com/#download)
2. Run the installer.
3. **CRITICAL STEP**: During installation, you MUST check the box that says:
   ✅ **"Install Npcap in WinPcap API-compatible Mode"**
4. Finish the installation.

---

## 2. Install Java Development Kit (JDK 21)

The backend is built with Spring Boot and requires Java 21.

1. Download **Eclipse Adoptium JDK 21**: [https://adoptium.net/](https://adoptium.net/)
   - Ensure you select **Java 21 (LTS)**
2. Run the installer.
3. During installation, make sure the following features are enabled (set to "Will be installed on local hard drive"):
   - ✅ **Add to PATH**
   - ✅ **Set JAVA_HOME variable**
4. Finish the installation.
5. Verify installation by opening PowerShell and running:
   ```powershell
   java -version
   ```
   *You should see output mentioning Java version "21.x.x".*

---

## 3. Install Node.js (For the Frontend)

The React.js (Expo) frontend requires Node.js.

1. Download **Node.js**: [https://nodejs.org/](https://nodejs.org/) (Choose the LTS version).
2. Run the installer and accept all default settings (ensure "Add to PATH" is enabled).
3. Verify installation by opening PowerShell and running:
   ```powershell
   node -v
   npm -v
   ```

---

## 4. Running the Application

Once the prerequisites above are installed, you can start the application.

### Start the Java Backend
You **must** run the backend with Administrator privileges, otherwise Pcap4J will not have permission to bind to your Wi-Fi/Ethernet adapter.

1. Open **PowerShell as Administrator**.
2. Navigate to the project backend folder:
   ```powershell
   cd C:\path\to\Packet_analyzer\dpi_engine
   ```
3. Run the Spring Boot application using the provided Maven wrapper:
   ```powershell
   .\mvnw.cmd clean install
   .\mvnw.cmd spring-boot:run
   ```

### Start the React.js Frontend
You can run this in a standard (non-admin) terminal.

1. Open a new PowerShell window.
2. Navigate to the frontend folder:
   ```powershell
   cd C:\path\to\Packet_analyzer\dpi_dashboard
   ```
3. Install dependencies:
   ```powershell
   npm install
   ```
4. Start the web dashboard:
   ```powershell
   npm run web
   ```
5. Press `w` to open it in your browser (or manually visit `http://localhost:8081`).

---

## Troubleshooting

- **Error: "Failed to load pcap library" or `UnsatisfiedLinkError` in Java**
  - *Fix:* You forgot to check "Install Npcap in WinPcap API-compatible Mode" when installing Npcap. Uninstall Npcap and reinstall it with that box checked.
  
- **Error: "No active network interface found for live capture"**
  - *Fix:* Ensure your Wi-Fi or Ethernet adapter is active. The engine explicitly filters out VMware/VirtualBox virtual adapters.

- **Frontend is stuck on a white screen**
  - *Fix:* Ensure the Java backend is running on `localhost:8080` before starting the frontend, as the React app needs the Live Stats API to render.
