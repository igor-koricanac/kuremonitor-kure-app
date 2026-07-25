# Changelog

## 1.0.0 (2026-07-25)

### Added
- **Failure Feed & Pod Monitoring**: Real-time tracking and visualization of Kubernetes pod failures (`CrashLoopBackOff`, `ImagePullBackOff`, `Pending`, `OOMKilled`, `Evicted`, `RunContainerError`, `CreateContainerError`, `NodeLost`).
- **AI Chatbot Assistant**: Interactive, context-aware chatbot for instant root-cause analysis and remediation steps directly inside Grafana.
- **Troubleshooting History Tab**: Persistent chat history allowing teams to review past diagnoses, remediation suggestions, and investigated pods.
- **Secure Backend Integration**: All requests authenticate with the Kure Monitor backend via `X-Service-Token` headers for robust, multi-tenant cluster isolation.
- **Light Theme Enforced**: Cohesive, clean visual design optimized for readability across operational dashboards.
