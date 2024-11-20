# AetherLink

> A decentralized social trust protocol based on Zero-Knowledge Graph algorithms for building privacy-preserving relationship networks.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-blue)](https://soliditylang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.0-black)](https://nextjs.org/)

## 🌟 Overview

AetherLink is a privacy-focused social graph protocol that leverages zero-knowledge proofs to enable verifiable relationship attestations without revealing the underlying connection paths. Built on Polygon zkEVM, it combines cutting-edge cryptographic techniques with decentralized infrastructure to create a trust layer for Web3 social applications.

## ✨ Features

- 🔒 **Privacy-Preserving Proofs**: Prove relationships without revealing connection paths
- ⭐ **Reputation System**: EigenTrust-based scoring with time decay
- 🌐 **Decentralized Storage**: On-chain graph data with IPFS metadata
- 🔍 **Queryable Graphs**: The Graph protocol for efficient data indexing
- 🎨 **Interactive Visualization**: D3.js force-directed graph rendering
- ⚡ **Gas Optimized**: Batch operations and efficient storage patterns

## 🏗️ Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Wallet    │────▶│ AetherRegistry│────▶│GraphStorage │
└─────────────┘     └──────────────┘     └─────────────┘
                            │                     │
                            ▼                     ▼
                    ┌──────────────┐     ┌─────────────┐
                    │  ZK Prover   │────▶│  Verifier   │
                    └──────────────┘     └─────────────┘
                            │                     │
                            ▼                     ▼
                    ┌──────────────┐     ┌─────────────┐
                    │  Reputation  │◀───▶│  Subgraph   │
                    │   Manager    │     │   Indexer   │
                    └──────────────┘     └─────────────┘
                            │                     │
                            ▼                     ▼
                    ┌─────────────────────────────────┐
                    │     Frontend (Next.js + D3)     │
                    └─────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- MetaMask wallet

### Installation

```bash
# Clone the repository
git clone https://github.com/aetherlink/aetherlink.git
cd aetherlink

# Install dependencies
npm run install:all

# Copy environment files
cp contracts/.env.example contracts/.env
cp frontend/.env.example frontend/.env.local

# Compile contracts
cd contracts && npm run compile

# Run tests
npm test

# Start local development
cd ../frontend && npm run dev
```

Visit `http://localhost:3000` to see the application.

## 📦 Project Structure

```
aetherlink/
├── contracts/          # Solidity smart contracts
│   ├── contracts/     # Contract source files
│   │   ├── AetherRegistry.sol
│   │   ├── GraphStorage.sol
│   │   ├── ReputationManager.sol
│   │   └── LinkProofVerifier.sol
│   ├── test/          # Contract tests
│   └── scripts/       # Deployment scripts
├── circuits/           # Circom ZK circuits
│   └── src/
│       └── pathProof.circom
├── frontend/           # Next.js frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Next.js pages
│   │   ├── utils/       # Utility functions
│   │   └── styles/      # CSS styles
├── subgraph/           # The Graph indexer
│   ├── schema.graphql   # GraphQL schema
│   └── src/mapping.ts   # Event handlers
└── docs/               # Documentation
    ├── ARCHITECTURE.md
    ├── API.md
    └── DEPLOYMENT.md
```

## 🔑 Core Components

### Smart Contracts

- **GraphStorage**: On-chain relationship edge storage with weight tracking
- **AetherRegistry**: Node registration and relationship management
- **ReputationManager**: EigenTrust-based reputation scoring with decay
- **LinkProofVerifier**: Zero-knowledge proof verification for privacy-preserving connections

### ZK Circuits

- **PathProof**: Proves path existence without revealing intermediate nodes
- **RelationshipProof**: Proves relationship weight meets threshold without revealing exact value

### Frontend

- Interactive graph visualization using D3.js force simulation
- Web3 wallet integration (MetaMask, WalletConnect)
- Real-time reputation updates
- ZK proof generation and submission

### Subgraph

- Indexes all contract events
- Provides GraphQL API for efficient queries
- Tracks reputation history and verified connections

## 🛠️ Development

### Running Tests

```bash
# Contract tests
cd contracts && npm test

# Frontend tests
cd frontend && npm test

# Coverage report
cd contracts && npm run coverage
```

### Deployment

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed deployment instructions.

```bash
# Deploy to Polygon Mumbai testnet
cd contracts
npx hardhat run scripts/deploy.js --network polygonMumbai

# Verify contracts
npx hardhat run scripts/verifyContracts.js --network polygonMumbai

# Grant roles
npx hardhat run scripts/grantRoles.js --network polygonMumbai
```

## 📚 Documentation

- [Architecture Overview](docs/ARCHITECTURE.md)
- [API Reference](docs/API.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Contributing Guidelines](CONTRIBUTING.md)

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to get started.

## 🔐 Security

For security concerns, please email security@aetherlink.io. Do not open public issues for vulnerabilities.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌐 Links

- **Website**: Coming soon
- **Discord**: Coming soon
- **Twitter**: Coming soon
- **Documentation**: [docs/](docs/)

## 🙏 Acknowledgments

- **EigenTrust**: P2P reputation algorithm
- **Circom**: Circuit compiler for ZK proofs
- **The Graph**: Decentralized indexing protocol
- **Polygon**: Layer 2 scaling solution
- **OpenZeppelin**: Secure smart contract library

---

Built with ❤️ by the AetherLink team

