# Kure Monitor — Kubernetes Failure Diagnosis & AI Assistant for Grafana

![Kure Monitor Logo](https://raw.githubusercontent.com/igor-koricanac/kure-monitor/main/docs/images/kure_monitor_logo_white_background.svg)

**Kure Monitor** is a powerful Grafana App Plugin designed to proactively detect Kubernetes pod failures and provide instant, AI-driven root-cause analysis and actionable remediation steps—right inside your operational dashboards.

---

## 🌟 Key Features

1. **Real-Time Failure Feed & Pod Monitoring**
   - Automatically monitors and highlights pods in critical failure states, including:
     - `CrashLoopBackOff`
     - `ImagePullBackOff`
     - `Pending`
     - `OOMKilled`
     - `Evicted`
     - `RunContainerError` / `CreateContainerError`
     - `NodeLost`
   - View structured failure reasons, exit codes, restart counts, and recent container logs in a clean, unified feed.

2. **Interactive AI Chatbot Troubleshooting**
   - Direct integration with your Kure Monitor backend to analyze pod manifests, events, and log tails using advanced LLMs (OpenAI, Anthropic, Gemini, Groq, Ollama, GitHub Copilot, or custom providers).
   - Ask conversational questions about failing pods (e.g., *"Why did this container OOMKill?"* or *"What does exit code 137 mean here?"*) and receive immediate, context-aware remediation commands.

3. **Persistent Troubleshooting History**
   - A dedicated **History Tab** stores past troubleshooting sessions and AI diagnoses.
   - Enables DevOps and SRE teams to collaborate, review past incidents, and maintain a clear audit trail of resolved pod failures.

4. **Secure & Multi-Tenant Architecture**
   - Communicates securely with your Kure FastAPI backend using custom `X-Service-Token` headers.
   - Built-in user and workspace isolation ensures that cluster logs and AI chat histories remain strictly segregated and protected.

---

## 🚀 Getting Started

### 1. Prerequisites
- A running instance of the **Kure Monitor Backend** and **Kure Agent** in your Kubernetes cluster.
- Grafana v10.0.0 or later.

### 2. Installation
1. Install the plugin into your Grafana instance's plugins directory:
   ```bash
   grafana-cli plugins install kuremonitor-kure-app
   ```
2. Restart your Grafana server:
   ```bash
   systemctl restart grafana-server
   ```
3. Open Grafana and navigate to **Apps -> Kure Monitor**.

### 3. Configuration
1. In Grafana, go to **Administration -> Plugins -> Kure Monitor**.
2. Click on the **Configuration** tab.
3. Enter your **Kure Monitor Backend API URL** (e.g., `http://kure-backend.kure-system.svc:8000`).
4. Enter your **Service Token** (matching the `SERVICE_TOKEN` configured in your Kubernetes cluster).
5. Click **Save & Test** to verify connectivity.

---

## 📚 Documentation & Support

- **Official Documentation & Setup Guide:** [https://igor-koricanac.github.io/kure-monitor/](https://igor-koricanac.github.io/kure-monitor/)
- **GitHub Repository:** [https://github.com/igor-koricanac/kure-monitor](https://github.com/igor-koricanac/kure-monitor)
- **Issue Tracker:** [https://github.com/igor-koricanac/kure-monitor/issues](https://github.com/igor-koricanac/kure-monitor/issues)

---

## 📄 License
This plugin is licensed under the **Apache License 2.0**. See the [LICENSE](https://github.com/igor-koricanac/kure-monitor/blob/main/LICENSE) file for details.
Copyright © 2026 Igor Koricanac. All rights reserved.
