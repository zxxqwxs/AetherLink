# AetherLink Circuits

Zero-knowledge circuits for privacy-preserving social graph proofs.

## Circuits

### PathProof Circuit

Proves that a path exists between two nodes without revealing intermediate nodes.

**Public Inputs:**
- `startNode`: Starting node address
- `endNode`: Ending node address
- `pathHash`: Hash of the entire path

**Private Inputs:**
- `pathNodes[maxDepth]`: Array of nodes in the path
- `pathWeights[maxDepth]`: Weights of each edge
- `pathLength`: Actual length of the path

**Constraints:**
- Start and end nodes match path array
- Path length within bounds
- All weights are positive
- Path hash is valid

### RelationshipProof Circuit

Proves a relationship exists with sufficient weight without revealing the exact weight.

**Public Inputs:**
- `nodeA`: First node
- `nodeB`: Second node  
- `minWeight`: Minimum required weight
- `relationshipHash`: Commitment to relationship

**Private Inputs:**
- `actualWeight`: Real weight value
- `salt`: Random salt for hiding

## Building

```bash
npm install
npm run build
```

## Testing

```bash
npm test
```

## Generating Keys

See [DEPLOYMENT.md](../docs/DEPLOYMENT.md) for key generation instructions.

