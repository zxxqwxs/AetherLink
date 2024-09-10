# AetherLink API Documentation

## Smart Contract APIs

### GraphStorage Contract

#### createEdge
Creates a new relationship edge between two nodes.

```solidity
function createEdge(
    address nodeA,
    address nodeB,
    uint256 weight,
    bytes32 relationshipHash
) external returns (bytes32 edgeId)
```

**Parameters:**
- `nodeA`: First node address
- `nodeB`: Second node address
- `weight`: Relationship strength (must be > 0)
- `relationshipHash`: Hash of relationship metadata

**Returns:** Unique edge identifier

**Events:** `EdgeCreated(bytes32 indexed edgeId, address indexed nodeA, address indexed nodeB, uint256 weight, uint256 timestamp)`

**Requirements:**
- Both addresses must be valid (non-zero)
- Cannot create self-loops
- Weight must be positive

---

#### updateEdgeWeight
Updates the weight of an existing edge.

```solidity
function updateEdgeWeight(
    bytes32 edgeId,
    uint256 newWeight
) external
```

**Access:** Either node participant

**Events:** `EdgeUpdated(bytes32 indexed edgeId, uint256 newWeight, uint256 timestamp)`

---

#### getNodeEdges
Retrieves all edges connected to a node.

```solidity
function getNodeEdges(address node) external view returns (bytes32[] memory)
```

**Returns:** Array of edge IDs

---

### AetherRegistry Contract

#### registerNode
Registers a new node in the network.

```solidity
function registerNode(string memory metadata) external
```

**Parameters:**
- `metadata`: IPFS hash or JSON metadata

**Events:** `NodeRegistered(address indexed nodeAddress, uint256 timestamp)`

**Requirements:**
- Node not already registered
- Metadata not empty

---

#### createRelationship
Creates a relationship between two registered nodes.

```solidity
function createRelationship(
    address to,
    uint256 weight,
    bytes32 relationshipHash
) external returns (bytes32 edgeId)
```

**Access:** Registered active nodes only

**Events:** `RelationshipCreated(address indexed from, address indexed to, bytes32 edgeId, uint256 weight)`

---

#### isNodeActive
Checks if a node is registered and active.

```solidity
function isNodeActive(address nodeAddress) external view returns (bool)
```

---

### ReputationManager Contract

#### initializeReputation
Initializes reputation for a newly registered node.

```solidity
function initializeReputation(address node) external
```

**Initial Score:** 500,000 (0.5 on 0-1 scale)

**Events:** `ReputationUpdated(address indexed node, uint256 oldScore, uint256 newScore, uint256 timestamp)`

---

#### updateReputation
Updates a node's reputation score.

```solidity
function updateReputation(
    address node,
    uint256 newScore
) external onlyRole(ORACLE_ROLE)
```

**Access:** Oracle role only

**Score Range:** 0 to 1,000,000

---

#### batchUpdateReputation
Efficiently updates multiple reputations.

```solidity
function batchUpdateReputation(
    address[] calldata nodes,
    uint256[] calldata scores
) external onlyRole(ORACLE_ROLE)
```

---

#### getReputation
Gets current reputation with decay applied.

```solidity
function getReputation(address node) external view returns (uint256)
```

**Note:** Automatically calculates time-based decay

---

#### applyDecay
Manually applies time decay to a reputation score.

```solidity
function applyDecay(address node) public
```

**Decay Formula:** `newScore = oldScore * (decayRate ^ periods)`

---

### LinkProofVerifier Contract

#### submitProof
Submits a zero-knowledge proof for verification.

```solidity
function submitProof(
    bytes32 proofHash,
    uint256[] calldata publicInputs
) external returns (bytes32 proofId)
```

**Events:** `ProofSubmitted(bytes32 indexed proofId, address indexed prover, uint256 timestamp)`

---

#### verifyProof
Verifies a submitted proof.

```solidity
function verifyProof(
    bytes32 proofId,
    address nodeA,
    address nodeB,
    bool isValid
) external onlyRole(VERIFIER_ROLE)
```

**Access:** Verifier role only

**Events:** `ProofVerified(bytes32 indexed proofId, address indexed nodeA, address indexed nodeB)` or `ProofInvalidated(bytes32 indexed proofId)`

---

#### isConnectionVerified
Checks if a connection between two nodes is verified.

```solidity
function isConnectionVerified(
    address nodeA,
    address nodeB
) external view returns (bool)
```

---

## Subgraph GraphQL API

### Queries

#### Get Node Details
```graphql
query GetNode($address: Bytes!) {
  node(id: $address) {
    id
    address
    metadata
    registeredAt
    active
    reputation
    reputationLastUpdated
    relationships {
      id
      to {
        address
      }
      weight
      createdAt
    }
  }
}
```

---

#### Get Network Statistics
```graphql
query GetGlobalStats {
  globalStats(id: "global") {
    totalNodes
    totalRelationships
    totalProofs
    totalVerifiedProofs
  }
}
```

---

#### Get Reputation History
```graphql
query GetReputationHistory($nodeAddress: Bytes!) {
  reputationHistories(
    where: { node: $nodeAddress }
    orderBy: timestamp
    orderDirection: desc
  ) {
    id
    oldScore
    newScore
    timestamp
    transactionHash
  }
}
```

---

#### Get Verified Connections
```graphql
query GetVerifiedConnections($nodeAddress: Bytes!) {
  verifiedConnections(
    where: {
      or: [
        { nodeA: $nodeAddress }
        { nodeB: $nodeAddress }
      ]
    }
  ) {
    id
    nodeA
    nodeB
    proofId
    verifiedAt
  }
}
```

---

#### Search Relationships
```graphql
query GetRelationships($minWeight: BigInt!) {
  relationships(
    where: { weight_gte: $minWeight, active: true }
    orderBy: weight
    orderDirection: desc
  ) {
    id
    from {
      address
      reputation
    }
    to {
      address
      reputation
    }
    weight
    createdAt
  }
}
```

---

## Frontend Utility Functions

### Contract Interaction

#### Get Contract Instance
```typescript
import { getAetherRegistryContract } from '@/utils/contracts';

const registry = await getAetherRegistryContract();
```

---

#### Register Node
```typescript
const registry = await getAetherRegistryContract();
const tx = await registry.registerNode("ipfs://Qm...");
await tx.wait();
```

---

### ZK Proof Generation

#### Generate Path Proof
```typescript
import { generatePathProof } from '@/utils/zkProofs';

const { proof, publicInputs } = await generatePathProof(
  startNodeAddress,
  endNodeAddress,
  pathNodes,
  pathWeights
);
```

---

#### Verify Proof Locally
```typescript
import { verifyProofLocally } from '@/utils/zkProofs';

const isValid = await verifyProofLocally(proof, publicInputs);
```

---

## Error Codes

### Smart Contract Errors

| Error | Code | Description |
|-------|------|-------------|
| `Invalid node address` | GRAPH_001 | Address is zero or invalid |
| `Cannot create self-loop` | GRAPH_002 | Same address for both nodes |
| `Weight must be positive` | GRAPH_003 | Edge weight is zero |
| `Node already registered` | REG_001 | Duplicate registration attempt |
| `Sender node not active` | REG_002 | Caller not registered |
| `Score out of bounds` | REP_001 | Score not in valid range |
| `Proof already verified` | PROOF_001 | Attempting to verify twice |
| `Not authorized` | AUTH_001 | Missing required role/permission |

---

## Rate Limits

### Subgraph Queries
- **Max queries per minute:** 100
- **Max query depth:** 10
- **Max results per query:** 1000

### Contract Calls
- **Gas limits:** Standard Ethereum limits
- **Batch operations:** Max 100 items per batch

---

## Examples

### Complete Node Registration Flow
```javascript
// 1. Connect wallet
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

// 2. Get contract
const registry = await getAetherRegistryContract();

// 3. Register node
const metadata = JSON.stringify({
  name: "Alice",
  bio: "Web3 enthusiast"
});
const tx = await registry.registerNode(metadata);
await tx.wait();

// 4. Initialize reputation
const reputationManager = await getReputationManagerContract();
const tx2 = await reputationManager.initializeReputation(signer.address);
await tx2.wait();

console.log("Node registered successfully!");
```

---

### Submit and Verify ZK Proof
```javascript
// 1. Generate proof
const { proof, publicInputs } = await generatePathProof(
  "0xAlice...",
  "0xBob...",
  ["0xAlice...", "0xCarol...", "0xBob..."],
  [80, 90]
);

// 2. Submit proof
const verifier = await getLinkProofVerifierContract();
const proofHash = ethers.keccak256(proof);
const tx = await verifier.submitProof(proofHash, publicInputs);
const receipt = await tx.wait();

// 3. Get proof ID from event
const event = receipt.logs.find(log => 
  log.fragment?.name === "ProofSubmitted"
);
const proofId = event.args[0];

console.log("Proof submitted:", proofId);
```

---

## Versioning

Current API Version: **v0.1.0**

Breaking changes will increment the major version number.

