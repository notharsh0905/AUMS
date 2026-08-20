# Security Policy

## Supported Versions

The table below details which versions of the **AUMS (AI Powered Autonomous Management System)** codebase currently receive security patches and updates:

| Version | Supported | Notes |
| :--- | :--- | :--- |
| `v1.0.1` | :white_check_mark: Yes | Current stable release baseline (`aums-v1.0.1`) |
| `v1.0.0` | :x: No | Legacy initial release |
| `< v1.0.0` | :x: No | Unsupported development versions |

---

## Reporting a Vulnerability

We take the security of AUMS seriously. If you discover a security vulnerability, please report it responsibly:

> [!IMPORTANT]
> **Do NOT publicly report security vulnerabilities via public GitHub Issues, Discussion boards, or Pull Requests.**

### Private Vulnerability Reporting Mechanism
1. Navigate to the main repository page on GitHub: [`https://github.com/notharsh0905/AUMS`](https://github.com/notharsh0905/AUMS).
2. Click on the **Security** tab.
3. Select **Report a vulnerability** to submit a private security advisory directly to the project maintainers.

### What to Include in a Security Report
To help us evaluate and patch the issue quickly, please provide:
- A clear description of the vulnerability and its potential impact.
- Step-by-step reproduction steps or a minimal Proof of Concept (PoC).
- Affected routes, parameters, components, or services.
- Suggested mitigations or code fixes if available.

---

## Development & Demo Credentials Disclaimer

> [!WARNING]
> The AUMS repository includes pre-seeded development accounts (e.g. `admin@aums.com`, `faculty.cse1@aums.edu`, `student1@aums.edu` with password `Admin@123`) and default local secret keys (`aums-super-secret-key-change-in-production`).
>
> **These credentials and default keys exist strictly for offline local development and demonstration purposes.**
> They are NOT production vulnerabilities. Deployments to production environments must override default secrets via environment variables and purge demo database entries.
