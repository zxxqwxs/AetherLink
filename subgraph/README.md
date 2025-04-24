# AetherLink Subgraph

The Graph indexer for querying AetherLink social graph data.

## Schema

- **Node**: Registered network participants
- **Relationship**: Connections between nodes
- **Proof**: Submitted ZK proofs
- **VerifiedConnection**: Verified relationships
- **ReputationHistory**: Historical reputation changes
- **GlobalStats**: Network-wide statistics

## Deployment

```bash
npm install
npm run codegen
npm run build
graph deploy --node https://api.thegraph.com/deploy/ your-name/aetherlink
```

## Queries

### Get Node
```graphql
query {
  node(id: "0x...") {
    address
    reputation
    relationships {
      to { address }
      weight
    }
  }
}
```

### Get Network Stats
```graphql
query {
  globalStats(id: "global") {
    totalNodes
    totalRelationships
    totalProofs
  }
}
```

## Development

Update `subgraph.yaml` with deployed contract addresses before deploying.

