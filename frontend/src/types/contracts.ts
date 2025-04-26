export type Address = string;
export type Hash = string;
export type Bytes32 = string;

export interface GraphStorageContract {
  createEdge(
    nodeA: Address,
    nodeB: Address,
    weight: bigint,
    relationshipHash: Bytes32
  ): Promise<Bytes32>;
  
  updateEdgeWeight(edgeId: Bytes32, newWeight: bigint): Promise<void>;
  
  deactivateEdge(edgeId: Bytes32): Promise<void>;
  
  getNodeEdges(node: Address): Promise<Bytes32[]>;
  
  getEdge(edgeId: Bytes32): Promise<{
    nodeA: Address;
    nodeB: Address;
    weight: bigint;
    timestamp: bigint;
    relationshipHash: Bytes32;
    active: boolean;
  }>;
  
  isEdgeActive(edgeId: Bytes32): Promise<boolean>;
}

export interface AetherRegistryContract {
  registerNode(metadata: string): Promise<void>;
  
  updateNodeMetadata(metadata: string): Promise<void>;
  
  deactivateNode(): Promise<void>;
  
  createRelationship(
    to: Address,
    weight: bigint,
    relationshipHash: Bytes32
  ): Promise<Bytes32>;
  
  isNodeActive(nodeAddress: Address): Promise<boolean>;
  
  getNode(nodeAddress: Address): Promise<{
    nodeAddress: Address;
    metadata: string;
    registeredAt: bigint;
    active: boolean;
  }>;
}

export interface ReputationManagerContract {
  initializeReputation(node: Address): Promise<void>;
  
  updateReputation(node: Address, newScore: bigint): Promise<void>;
  
  batchUpdateReputation(
    nodes: Address[],
    scores: bigint[]
  ): Promise<void>;
  
  applyDecay(node: Address): Promise<void>;
  
  getReputation(node: Address): Promise<bigint>;
  
  getReputationDetails(node: Address): Promise<{
    score: bigint;
    lastUpdated: bigint;
    updateCount: bigint;
  }>;
}

export interface LinkProofVerifierContract {
  submitProof(
    proofHash: Bytes32,
    publicInputs: bigint[]
  ): Promise<Bytes32>;
  
  verifyProof(
    proofId: Bytes32,
    nodeA: Address,
    nodeB: Address,
    isValid: boolean
  ): Promise<void>;
  
  isConnectionVerified(nodeA: Address, nodeB: Address): Promise<boolean>;
  
  getProof(proofId: Bytes32): Promise<{
    proofHash: Bytes32;
    prover: Address;
    timestamp: bigint;
    verified: boolean;
  }>;
  
  isProofVerified(proofId: Bytes32): Promise<boolean>;
}
