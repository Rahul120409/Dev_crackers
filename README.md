# CapitalGuard | Intelligent Asset & Capital Controls

CapitalGuard is an institutional-grade Asset & Capital Management platform built for financial institutions. It provides real-time capital balance tracking, Markowitz portfolio optimization, statutory Basel III liquidity risk controls (LCR/NSFR), live market intelligence feeds, and automated governance decision history.

---

## Architecture Overview

- **Backend (`/finance`)**:
  - **Framework**: Spring Boot 4.1.1 (Java 21)
  - **Security**: Spring Security with HTTP Basic / Token Authentication
  - **Persistence**: Hibernate JPA & PostgreSQL (Cloud Supabase)
  - **Default Port**: `8082`

- **Frontend (`/ft`)**:
  - **Framework**: Next.js 16.3.4 (App Router) & React 19
  - **Styling**: Tailwind CSS v4 with dark/light institutional themes (Defaults to Dark Mode)
  - **Icons & Visuals**: Lucide React
  - **Default Port**: `3000`

---

## Prerequisites

Ensure you have the following installed on your machine:
1. **Java JDK 21+** (e.g. OpenLogic, Temurin, or Oracle JDK 21)
   - Verify: `java -version`
2. **Node.js 18.18+ or 20+** and **npm**
   - Verify: `node -v` and `npm -v`
3. **Git**
   - Verify: `git --version`

---

## Quick Start Guide

### 1. Start the Backend Server (Port 8082)

The backend is pre-configured with cloud PostgreSQL (Supabase) in `finance/src/main/resources/application.properties`. No local database installation is required.

Open a terminal in the project root:

**On Windows (PowerShell or Command Prompt):**
```powershell
cd finance
.\mvnw.cmd spring-boot:run
```

**On macOS / Linux:**
```bash
cd finance
chmod +x mvnw
./mvnw spring-boot:run
```

The Spring Boot backend will start at:
- **API URL**: `http://localhost:8082`
- **Health Check**: `http://localhost:8082/api/risk`

---

### 2. Start the Frontend Application (Port 3000)

Open a **separate** terminal window:

```bash
cd ft
npm install
npm run dev
```

The Next.js development server will start at:
- **Web App**: `http://localhost:3000`

---
please get sign up to acess the further things 

## Application Modules & Routes

| Route | Module | Description |
| :--- | :--- | :--- |
| `/dashboard` | **Executive Dashboard** | Real-time capital balance, HHI concentration, 95% VaR, and Basel III liquidity buffer |
| `/portfolio` | **Portfolio & Assets** | Tranche breakdown, interactive donut charts, and custom capital rebalancing |
| `/market` | **Market Intelligence** | Live market trends, ticker performance, and institutional asset indices |
| `/risk` | **Risk Center** | Risk metrics, active limit breaches, VaR analysis, and statutory limits |
| `/optimization` | **Capital Optimizer** | Markowitz-inspired risk-return rebalancing engine with statutory constraints |
| `/simulator` | **Stress Testing** | Shock simulation (interest rate spikes, market drawdown, liquidity freeze) |
| `/alerts` | **System Alerts** | Active regulatory warnings and concentration limit breaches |
| `/decisions` | **Decision History** | Automated audit trail and governance execution records |
| `/settings` | **System Settings** | Model weights, API endpoints, telemetry, and platform diagnostics |

---

## Theme & Appearance

- **Default**: The application is configured to **always open in Dark Mode** automatically on initial launch and refresh.
- **In-Session Toggle**: Click the **Light / Dark** toggle button in the top header anytime to switch themes during your session.

---

## Production Build & Verification

To verify or produce production bundles:

### Backend Build (Clean & Package)
```powershell
cd finance
.\mvnw.cmd clean package -DskipTests
```

### Frontend Build (Next.js Static/Dynamic Compilation)
```bash
cd ft
npm run build
```

---

## Troubleshooting

- **Port 8082 already in use**:
  - Windows: `netstat -ano | findstr :8082` then `taskkill /PID <PID> /F`
  - Linux/Mac: `lsof -i :8082` then `kill -9 <PID>`
- **Port 3000 already in use**:
  - Next.js will automatically prompt to run on port `3001` or you can terminate the existing node process.
- **Backend Database Connection**:
  - Verify internet access as the project connects to the cloud-hosted Supabase PostgreSQL instance specified in `application.properties`.
