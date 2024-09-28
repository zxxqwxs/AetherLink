# Deployment Guide

## Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- MetaMask or other Web3 wallet
- Infura/Alchemy API key (for testnet/mainnet deployment)
- The Graph account (for subgraph deployment)

## Environment Setup

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/aetherlink/aetherlink.git
cd aetherlink
npm install
```

### 2. Install Dependencies for Each Module

```bash
# Install contract dependencies
cd contracts && npm install && cd ..

# Install circuit dependencies
cd circuits && npm install && cd ..

# Install frontend dependencies
cd frontend && npm install && cd ..

# Install subgraph dependencies
cd subgraph && npm install && cd ..
```

### 3. Configure Environment Variables

Create `.env` files in respective directories:

#### contracts/.env
```env
PRIVATE_KEY=your_private_key_here
POLYGON_MUMBAI_RPC=https://polygon-mumbai.infura.io/v3/YOUR_INFURA_KEY
POLYGON_ZKEVM_RPC=https://polygonzkevm-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
POLYGONSCAN_API_KEY=your_polygonscan_api_key
REPORT_GAS=true
```

#### frontend/.env.local
```env
NEXT_PUBLIC_GRAPH_STORAGE_ADDRESS=0x...
NEXT_PUBLIC_AETHER_REGISTRY_ADDRESS=0x...
NEXT_PUBLIC_REPUTATION_MANAGER_ADDRESS=0x...
NEXT_PUBLIC_LINK_PROOF_VERIFIER_ADDRESS=0x...
NEXT_PUBLIC_SUBGRAPH_URL=https://api.thegraph.com/subgraphs/name/...
```

## Smart Contract Deployment

### Local Development (Hardhat Network)

```bash
cd contracts

# Start local node
npx hardhat node

# Deploy contracts (in another terminal)
npx hardhat run scripts/deploy.js --network localhost
```

### Testnet Deployment (Polygon Mumbai)

```bash
cd contracts

# Compile contracts
npm run compile

# Deploy to Mumbai
npx hardhat run scripts/deploy.js --network polygonMumbai

# Verify contracts
npx hardhat verify --network polygonMumbai DEPLOYED_ADDRESS
```

### Mainnet Deployment (Polygon zkEVM)

```bash
cd contracts

# Deploy to mainnet
npx hardhat run scripts/deploy.js --network polygonZkEVM

# Verify contracts
npx hardhat verify --network polygonZkEVM DEPLOYED_ADDRESS
```

**⚠️ Important:** Save the deployed contract addresses from `deployment.json`

## Circuit Compilation

### Compile Circom Circuits

```bash
cd circuits

# Install circom compiler (if not already installed)
npm install -g circom

# Compile circuits
npm run build

# This will generate:
# - build/pathProof.r1cs
# - build/pathProof.wasm
# - build/pathProof_js/
```

### Generate Proving and Verification Keys

```bash
cd circuits

# Download Powers of Tau ceremony file (one-time setup)
wget https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_15.ptau

# Generate zkey
snarkjs groth16 setup build/pathProof.r1cs powersOfTau28_hez_final_15.ptau build/pathProof_0000.zkey

# Contribute to ceremony (optional but recommended)
snarkjs zkey contribute build/pathProof_0000.zkey build/pathProof_final.zkey --name="First contribution"

# Export verification key
snarkjs zkey export verificationkey build/pathProof_final.zkey build/verification_key.json

# Generate Solidity verifier (if using on-chain verification)
snarkjs zkey export solidityverifier build/pathProof_final.zkey contracts/contracts/PathProofVerifier.sol
```

## Subgraph Deployment

### 1. Update Subgraph Configuration

Edit `subgraph/subgraph.yaml` with deployed contract addresses:

```yaml
dataSources:
  - kind: ethereum
    name: AetherRegistry
    network: polygon-mumbai
    source:
      address: "YOUR_DEPLOYED_REGISTRY_ADDRESS"
      abi: AetherRegistry
      startBlock: YOUR_DEPLOYMENT_BLOCK_NUMBER
```

### 2. Generate ABI Files

```bash
cd subgraph

# Copy ABIs from contracts
mkdir -p abis
cp ../contracts/artifacts/contracts/AetherRegistry.sol/AetherRegistry.json abis/
cp ../contracts/artifacts/contracts/ReputationManager.sol/ReputationManager.json abis/
cp ../contracts/artifacts/contracts/LinkProofVerifier.sol/LinkProofVerifier.json abis/
```

### 3. Deploy Subgraph

#### Deploy to The Graph Hosted Service

```bash
cd subgraph

# Authenticate
graph auth --product hosted-service YOUR_ACCESS_TOKEN

# Generate types
npm run codegen

# Build subgraph
npm run build

# Deploy
graph deploy --product hosted-service YOUR_USERNAME/aetherlink
```

#### Deploy to Decentralized Network

```bash
cd subgraph

# Codegen and build
npm run codegen
npm run build

# Deploy to The Graph Network
graph deploy --node https://api.thegraph.com/deploy/ aetherlink/social-graph
```

## Frontend Deployment

### Local Development

```bash
cd frontend

# Start development server
npm run dev

# Open http://localhost:3000
```

### Production Build

```bash
cd frontend

# Build for production
npm run build

# Test production build locally
npm start
```

### Deploy to Vercel

```bash
cd frontend

# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Deploy to Other Platforms

#### Netlify
```bash
cd frontend
npm run build
# Upload .next folder to Netlify
```

#### AWS S3 + CloudFront
```bash
cd frontend
npm run build
npm run export
# Upload out/ folder to S3
```

## Post-Deployment Configuration

### 1. Update Frontend Environment

After deploying contracts and subgraph, update `frontend/.env.local`:

```env
NEXT_PUBLIC_GRAPH_STORAGE_ADDRESS=<deployed_address>
NEXT_PUBLIC_AETHER_REGISTRY_ADDRESS=<deployed_address>
NEXT_PUBLIC_REPUTATION_MANAGER_ADDRESS=<deployed_address>
NEXT_PUBLIC_LINK_PROOF_VERIFIER_ADDRESS=<deployed_address>
NEXT_PUBLIC_SUBGRAPH_URL=<your_subgraph_url>
```

### 2. Grant Roles

```bash
cd contracts

# Create a script to grant roles
npx hardhat run scripts/grantRoles.js --network polygonMumbai
```

Example `scripts/grantRoles.js`:
```javascript
async function main() {
  const registry = await ethers.getContractAt("AetherRegistry", REGISTRY_ADDRESS);
  const reputationManager = await ethers.getContractAt("ReputationManager", REPUTATION_ADDRESS);
  
  // Grant oracle role
  const oracleRole = await reputationManager.ORACLE_ROLE();
  await reputationManager.grantRole(oracleRole, ORACLE_ADDRESS);
  
  console.log("Roles granted successfully!");
}
```

### 3. Initialize Test Data (Optional)

```bash
cd contracts
npx hardhat run scripts/seedData.js --network polygonMumbai
```

## Monitoring and Maintenance

### Contract Monitoring

- Use Etherscan/Polygonscan to monitor transactions
- Set up alerts for unusual activity
- Monitor gas costs

### Subgraph Health

```bash
# Check indexing status
curl https://api.thegraph.com/index-node/graphql \
  -X POST \
  -d '{"query": "{indexingStatusForCurrentVersion(subgraphName: \"aetherlink/social-graph\") { synced health fatalError { message } }}"}'
```

### Frontend Monitoring

- Use Vercel Analytics or similar
- Monitor Web3 connection issues
- Track user transactions

## Troubleshooting

### Contract Deployment Fails

```bash
# Check gas price
npx hardhat run scripts/checkGas.js

# Increase gas limit in hardhat.config.js
```

### Subgraph Not Syncing

- Check contract addresses in `subgraph.yaml`
- Verify startBlock is correct
- Check ABIs are up to date

### Frontend Connection Issues

- Verify contract addresses in environment variables
- Check wallet network matches deployment network
- Ensure subgraph is fully synced

## Security Checklist

- [ ] Private keys stored securely (never commit to git)
- [ ] Contract ownership transferred to multisig
- [ ] Role-based access properly configured
- [ ] Frontend validates all user inputs
- [ ] Rate limiting enabled on RPC endpoints
- [ ] Subgraph queries have reasonable limits
- [ ] All contracts verified on block explorer

## Upgrade Strategy

### Contract Upgrades

AetherLink contracts are not upgradeable by design for security. To upgrade:

1. Deploy new contract versions
2. Migrate data if necessary
3. Update frontend and subgraph configurations
4. Communicate changes to users

### Subgraph Updates

```bash
cd subgraph
# Make changes to schema or mappings
npm run codegen
npm run build
graph deploy --product hosted-service YOUR_USERNAME/aetherlink
```

## Cost Estimation

### Polygon Mumbai (Testnet)
- GraphStorage deployment: ~0.5 test MATIC
- AetherRegistry deployment: ~0.8 test MATIC
- ReputationManager deployment: ~1.0 test MATIC
- LinkProofVerifier deployment: ~0.9 test MATIC

### Polygon zkEVM (Mainnet)
- Total deployment cost: ~$50-100 USD (varies with gas prices)
- Ongoing transaction costs: Significantly lower than Ethereum mainnet

## Additional Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [The Graph Documentation](https://thegraph.com/docs)
- [Circom Documentation](https://docs.circom.io)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Polygon zkEVM Docs](https://wiki.polygon.technology/docs/zkEVM)

