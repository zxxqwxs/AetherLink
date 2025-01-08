# Frequently Asked Questions (FAQ)

## General Questions

### What is AetherLink?
AetherLink is a decentralized social trust protocol that uses zero-knowledge proofs to enable privacy-preserving relationship verification and reputation management on blockchain networks.

### Why do we need AetherLink?
Traditional social networks store your data centrally and can be censored or shut down. AetherLink gives you control over your social graph while preserving privacy through cryptographic proofs.

### Which blockchains does AetherLink support?
Currently, AetherLink is optimized for:
- Polygon zkEVM (mainnet)
- Polygon Mumbai (testnet)
- Ethereum (planned)

## Technical Questions

### How do zero-knowledge proofs work in AetherLink?
ZK proofs allow you to prove you have a connection to someone without revealing who the intermediate connections are. For example, you can prove you're connected to Alice through Bob without revealing Bob's identity.

### What is the reputation system based on?
AetherLink uses a modified EigenTrust algorithm with time decay. Your reputation score is calculated based on your relationships and degrades over time if not maintained.

### How is data stored?
- **On-chain**: Relationship edges, reputation scores, proof verification status
- **Off-chain**: Node metadata (stored on IPFS)
- **Indexed**: The Graph protocol for efficient queries

### Can I delete my data?
Yes, you can deactivate your node and relationships at any time. However, historical transactions remain on the blockchain due to its immutable nature.

## Privacy & Security

### Is my social graph private?
Yes and no. Your relationships are stored on-chain (public), but ZK proofs allow you to prove connections without revealing paths. You control what information you share.

### Who can see my reputation score?
Reputation scores are public by design to enable trust assessments. However, you can choose not to initialize your reputation.

### What happens if someone tries to game the system?
The protocol includes several anti-gaming mechanisms:
- Time decay prevents score inflation
- Oracle-based updates prevent self-boosting
- ZK proof verification prevents fake connections

## Development

### How do I integrate AetherLink into my dApp?
See our [API Documentation](API.md) for integration guides. You can use our smart contracts, subgraph, or frontend SDK.

### Can I run my own oracle?
Yes, but you'll need to be granted the ORACLE_ROLE by contract admins. Contact us for more information.

### Is there a testnet faucet?
Yes, you can get test tokens from:
- Polygon Mumbai: https://faucet.polygon.technology/

## Economics

### What are the gas costs?
Approximate costs on Polygon Mumbai:
- Node registration: ~0.01 MATIC
- Create relationship: ~0.015 MATIC
- Submit ZK proof: ~0.02 MATIC
- Update reputation: ~0.008 MATIC

### Are there any tokens?
No native token yet. All transactions use network gas (MATIC on Polygon).

### Will there be a governance token?
This is under consideration for future releases.

## Troubleshooting

### My wallet won't connect
1. Ensure you're on the correct network (Polygon Mumbai for testnet)
2. Try refreshing the page
3. Clear your browser cache
4. Make sure MetaMask is updated

### Transaction failed
Common reasons:
- Insufficient gas
- Wrong network
- Contract interaction limit reached
- Try increasing gas limit

### Subgraph not returning data
- Check if the subgraph is fully synced
- Verify you're using the correct subgraph URL
- Try the query in The Graph playground first

## Community

### How can I contribute?
See our [Contributing Guidelines](../CONTRIBUTING.md).

### Where can I get help?
- GitHub Issues: Bug reports and feature requests
- Discord: Community support (coming soon)
- Email: support@aetherlink.io

### Is there a bug bounty program?
Yes, we reward security researchers. See our security policy or email security@aetherlink.io.

## Future Plans

### What's on the roadmap?
- Lens Protocol integration
- Cross-chain bridges
- Mobile app
- Recursive ZK proofs
- DAO governance

### When will mainnet launch?
We're currently in testnet phase. Mainnet launch is planned for Q2 2025 pending security audits.

---

Have more questions? Open a Discussion on GitHub or ask in our Discord!

