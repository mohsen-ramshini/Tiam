🚀 Tiam Project

👤 Author: Mohsen Ramshini
📧 Email: rsmohsen20@gmail.com


📋 Overview
Tiam Project is a robust, distributed monitoring system designed to ensure the availability, reliability, and performance of nationwide data center services. By continuously monitoring DNS resolutions, HTTP(S) endpoints, port statuses, and network routing from multiple geographic locations, Tiam empowers organizations to proactively detect and resolve service disruptions.

In today’s digital world, uninterrupted access to online services is critical. Service outages or network inconsistencies can lead to revenue loss, damage to reputation, and user dissatisfaction. Tiam addresses these challenges, including network filtering and region-specific connectivity issues, to maintain seamless service delivery. 🌍✨

⭐ Key Features
📡 Distributed Probes: Lightweight probes deployed across multiple data centers conduct scheduled tests on DNS, HTTP(S), ports, and routing.

🔐 Centralized Data Aggregation: Securely collects and analyzes probe data in real time.

🛣️ TCP Traceroute by Service/Port: Identifies network blocks and unusual routing paths.

🕒 Domain & SSL Monitoring: Tracks domain and SSL certificate expirations with timely alerts.

📊 Intuitive Web Dashboard: Dynamic charts, maps, and tables for quick insights.

🚨 Real-Time Alerts: Instant notifications for DNS failures, service interruptions, or SSL issues.

🏗️ System Architecture
Probes
Distributed lightweight servers (physical, virtual, or containerized) deployed across diverse data centers perform network tests and report results via secure RESTful APIs.

Central Server
Aggregates and processes probe data using scalable NoSQL databases and advanced algorithms to detect anomalies and regional inconsistencies.

Web Dashboard
A clean, responsive UI built with React and modern libraries, offering comprehensive visualization and filtering tools.

## ⚙️ Getting Started

### 🔧 Prerequisites

- [Node.js](https://nodejs.org/) (توصیه‌شده: نسخه سازگار با Yarn 4.6.0)
- [Yarn](https://yarnpkg.com/) package manager

### 📦 Install Dependencies

```bash
yarn install
```

### 🧪 Start Development Server

```bash
yarn start
```

### 🚀 Build for Production

```bash
yarn build
```

### 🧪 Build for Staging

```bash
yarn build-stage
```

### 🔍 Preview Production Build

```bash
yarn preview
```

---

### 🛠️ Useful Scripts

| Script        | Description                             |
| ------------- | --------------------------------------- |
| `start`       | Start the development server            |
| `build`       | Build the app for production            |
| `build-stage` | Build the app using staging config      |
| `preview`     | Preview the production build locally    |
| `lint`        | Run ESLint to check code quality        |
| `lint:fix`    | Auto-fix linting issues                 |
| `prettier`    | Format code with Prettier               |
| `knip`        | Detect unused dependencies              |

🧰 Technology Stack
React 18, Vite 6

Ant Design & Material UI components

React Router DOM for routing

Axios for HTTP communications

React Hook Form & Formik for form handling

Chart.js & Recharts for data visualization

Leaflet & React-Leaflet for interactive maps

SWR & React Query for data fetching and caching

ESLint & Prettier for code quality

📞 Contact
For more info or support, feel free to reach out! 🙌

Mohsen Ramshini
📧 rsmohsen20@gmail.com
🌐 https://mantisdashboard.io/free
