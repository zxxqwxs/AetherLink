# AetherLink Frontend

Next.js frontend application for AetherLink social trust protocol.

## Features

- Web3 wallet connection (MetaMask, WalletConnect)
- Interactive social graph visualization (D3.js)
- Node registration and relationship management
- ZK proof generation and submission
- Real-time reputation tracking

## Getting Started

```bash
npm install
cp .env.example .env.local
# Edit .env.local with contract addresses
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Build

```bash
npm run build
npm start
```

## Technology Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Ethers.js v6
- D3.js
- Zustand (state management)

## Project Structure

```
src/
├── components/     # React components
├── pages/         # Next.js pages
├── utils/         # Utility functions
└── styles/        # CSS styles
```

## Deployment

### Vercel
```bash
npm install -g vercel
vercel --prod
```

### Other platforms
```bash
npm run build
# Deploy .next folder
```

