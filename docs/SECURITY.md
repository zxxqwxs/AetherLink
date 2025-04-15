# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to security@aetherlink.io.

You should receive a response within 48 hours. If for some reason you do not, please follow up via email to ensure we received your original message.

Please include the requested information listed below to help us better understand the nature and scope of the possible issue:

- Type of issue (e.g., buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

This information will help us triage your report more quickly.

## Preferred Languages

We prefer all communications to be in English.

## Disclosure Policy

We follow a coordinated disclosure process:

1. Security report received
2. Confirm the vulnerability
3. Determine impact and severity
4. Develop and test a patch
5. Prepare advisory
6. Release patch and advisory
7. Public disclosure (minimum 90 days after report or when patch is available)

## Security Measures

### Smart Contracts

- All contracts undergo thorough testing
- External audits before mainnet deployment
- Time-locked admin functions
- Multi-signature requirements for critical operations
- Pausable functionality for emergency stops

### Frontend

- Content Security Policy (CSP) headers
- HTTPS enforced
- No sensitive data in localStorage
- Input validation and sanitization
- Rate limiting on API calls

### Zero-Knowledge Proofs

- Trusted setup ceremonies
- Proof verification on-chain
- Secure key management
- Circuit audit by cryptography experts

## Known Issues

None at this time.

## Bug Bounty Program

We offer rewards for security researchers who responsibly disclose vulnerabilities:

- **Critical**: Up to $10,000
- **High**: Up to $5,000
- **Medium**: Up to $2,000
- **Low**: Up to $500

Rewards are paid in USDC or ETH at our discretion.

### Scope

**In Scope:**
- Smart contracts (all deployed contracts)
- Frontend application
- Subgraph implementation
- ZK circuits

**Out of Scope:**
- Third-party dependencies
- Social engineering
- Physical attacks
- DDoS attacks

## Contact

- Email: security@aetherlink.io
- PGP Key: [Coming soon]

