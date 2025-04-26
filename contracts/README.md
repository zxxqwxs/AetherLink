# AetherLink Smart Contracts

Solidity smart contracts for the AetherLink decentralized social trust protocol.

## Contracts

- **GraphStorage.sol**: On-chain relationship edge storage
- **AetherRegistry.sol**: Node registration and management
- **ReputationManager.sol**: EigenTrust-based reputation system
- **LinkProofVerifier.sol**: Zero-knowledge proof verification

## Development

```bash
npm install
npm run compile
npm test
npm run coverage
```

## Deployment

```bash
# Local
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost

# Testnet
npx hardhat run scripts/deploy.js --network polygonMumbai

# Verification
npx hardhat run scripts/verifyContracts.js --network polygonMumbai

# Grant Roles
npx hardhat run scripts/grantRoles.js --network polygonMumbai
```

## Testing

All contracts have comprehensive test coverage. Run tests with:

```bash
npm test
```

Generate coverage report:

```bash
npm run coverage
```

## Security

Contracts follow OpenZeppelin standards and best practices. See [SECURITY.md](../docs/SECURITY.md) for security policy.

