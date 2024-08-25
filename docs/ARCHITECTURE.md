# AetherLink Architecture

## Overview

AetherLink is a decentralized social trust protocol that leverages zero-knowledge proofs to enable privacy-preserving relationship verification and reputation management.

## System Components

### 1. Smart Contracts (Ethereum/Polygon)

#### GraphStorage
- **Purpose**: On-chain storage of relationship edges
- **Data Structure**: `(addressA, addressB, weight, timestamp, relationshipHash)`
- **Key Functions**:
  - `createEdge()`: Creates new relationship edge
  - `updateEdgeWeight()`: Modifies edge weight
  - `getNodeEdges()`: Queries edges for a node
  - `deactivateEdge()`: Soft delete edges

#### AetherRegistry
- **Purpose**: Central registry for node management
- **Features**:
  - Node registration with metadata
  - Relationship creation orchestration
  - Access control (RBAC)
  - Integration with GraphStorage
- **Key Functions**:
  - `registerNode()`: Register new network participant
  - `createRelationship()`: Create verifiable connection
  - `isNodeActive()`: Check node status

#### ReputationManager
- **Purpose**: Manages trust scores using EigenTrust algorithm
- **Algorithm**: Modified EigenTrust with time decay
- **Score Range**: 0 to 1,000,000 (fixed-point representation)
- **Key Functions**:
  - `initializeReputation()`: Set initial score (0.5)
  - `updateReputation()`: Oracle-based score updates
  - `applyDecay()`: Time-based reputation decay
  - `batchUpdateReputation()`: Efficient batch processing

#### LinkProofVerifier
- **Purpose**: Verifies zero-knowledge relationship proofs
- **Proof System**: Compatible with Groth16/PLONK
- **Key Functions**:
  - `submitProof()`: Submit ZK proof for verification
  - `verifyProof()`: Validate proof and update connection status
  - `isConnectionVerified()`: Check verified relationships

### 2. Zero-Knowledge Circuits (circom)

#### PathProof Circuit
```
Inputs:
  - Public: startNode, endNode, pathHash
  - Private: pathNodes[], pathWeights[], pathLength

Constraints:
  - Path connects start to end
  - All weights > 0
  - Path length ≤ maxDepth
  - Poseidon hash verification
```

#### RelationshipProof Circuit
```
Inputs:
  - Public: nodeA, nodeB, minWeight, relationshipHash
  - Private: actualWeight, salt

Constraints:
  - actualWeight ≥ minWeight
  - Hash(nodeA, nodeB, actualWeight, salt) = relationshipHash
```

### 3. Indexing Layer (The Graph)

#### Subgraph Schema
- **Entities**: Node, Relationship, Proof, VerifiedConnection, ReputationHistory
- **Event Handlers**:
  - `handleNodeRegistered`: Index new nodes
  - `handleRelationshipCreated`: Track relationships
  - `handleProofVerified`: Record verified proofs
  - `handleReputationUpdated`: Store reputation changes

#### Query Capabilities
- Fetch node's social graph
- Get reputation history
- Query verified connections
- Aggregate network statistics

### 4. Frontend (Next.js + D3.js)

#### Components
- **ConnectWallet**: Web3 wallet integration
- **GraphVisualization**: Interactive D3.js force-directed graph
- **NodeRegistry**: Node registration interface
- **ProofSubmission**: ZK proof generation and submission

#### State Management
- Zustand for global state
- React Query for data fetching
- Ethers.js for blockchain interaction

## Data Flow

### Node Registration
```
User → Frontend → AetherRegistry.registerNode()
  → emit NodeRegistered
  → Subgraph indexes event
  → Frontend queries updated data
```

### Relationship Creation with ZK Proof
```
User → Generate ZK proof (client-side)
  → Submit to LinkProofVerifier
  → Verifier validates proof
  → If valid: update verifiedConnections
  → Create edge in GraphStorage via AetherRegistry
  → Subgraph indexes both events
```

### Reputation Update (Oracle-driven)
```
Off-chain Oracle → Compute EigenTrust scores
  → Submit batch to ReputationManager
  → Emit ReputationUpdated events
  → Subgraph tracks history
  → Frontend displays updated scores
```

## Security Considerations

### Privacy
- ZK proofs hide intermediate path nodes
- Relationship hashes prevent metadata leakage
- Client-side proof generation

### Access Control
- Role-based permissions (Admin, Oracle, Verifier)
- Owner-based edge modifications
- Time-locked admin functions

### Data Integrity
- Cryptographic commitment schemes
- Event-sourced state reconstruction
- Immutable proof records

## Scalability

### Layer 2 Deployment
- Optimized for Polygon zkEVM
- Gas-efficient batch operations
- Off-chain computation with on-chain verification

### Optimization Strategies
- Batch reputation updates
- Lazy evaluation of reputation decay
- Sparse Merkle trees for efficient state proofs

## Future Enhancements

1. **Cross-chain Bridge**: Enable multi-chain social graphs
2. **Privacy Pools**: Group-based reputation aggregation
3. **Recursive Proofs**: Compose multiple path proofs
4. **Lens Protocol Integration**: Import existing social connections
5. **Sign Protocol**: Verifiable attestations
6. **Sybil Resistance**: Advanced detection algorithms

## References

- EigenTrust: P2P reputation system
- Circom: Circuit compiler for ZK proofs
- The Graph: Decentralized indexing protocol
- Poseidon: ZK-friendly hash function

