export interface Node {
  id: string;
  address: string;
  metadata: string;
  registeredAt: number;
  active: boolean;
  reputation: number;
  reputationLastUpdated: number;
}

export interface Edge {
  id: string;
  nodeA: string;
  nodeB: string;
  weight: number;
  timestamp: number;
  relationshipHash: string;
  active: boolean;
}

export interface Relationship {
  id: string;
  from: Node;
  to: Node;
  edgeId: string;
  weight: number;
  createdAt: number;
  active: boolean;
}

export interface Proof {
  id: string;
  proofId: string;
  proofHash: string;
  prover: string;
  nodeA?: string;
  nodeB?: string;
  submittedAt: number;
  verified: boolean;
  verifiedAt?: number;
}

export interface ReputationScore {
  score: number;
  lastUpdated: number;
  updateCount: number;
}

export interface VerifiedConnection {
  id: string;
  nodeA: string;
  nodeB: string;
  proofId: string;
  verifiedAt: number;
}
