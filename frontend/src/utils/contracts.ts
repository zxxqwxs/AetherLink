import { ethers } from 'ethers';

// Contract ABIs (simplified versions)
export const GRAPH_STORAGE_ABI = [
  'function createEdge(address nodeA, address nodeB, uint256 weight, bytes32 relationshipHash) external returns (bytes32)',
  'function updateEdgeWeight(bytes32 edgeId, uint256 newWeight) external',
  'function getNodeEdges(address node) external view returns (bytes32[])',
  'function getEdge(bytes32 edgeId) external view returns (tuple(address nodeA, address nodeB, uint256 weight, uint256 timestamp, bytes32 relationshipHash, bool active))',
  'event EdgeCreated(bytes32 indexed edgeId, address indexed nodeA, address indexed nodeB, uint256 weight, uint256 timestamp)',
];

export const AETHER_REGISTRY_ABI = [
  'function registerNode(string memory metadata) external',
  'function updateNodeMetadata(string memory metadata) external',
  'function createRelationship(address to, uint256 weight, bytes32 relationshipHash) external returns (bytes32)',
  'function isNodeActive(address nodeAddress) external view returns (bool)',
  'function getNode(address nodeAddress) external view returns (tuple(address nodeAddress, string metadata, uint256 registeredAt, bool active))',
  'event NodeRegistered(address indexed nodeAddress, uint256 timestamp)',
  'event RelationshipCreated(address indexed from, address indexed to, bytes32 edgeId, uint256 weight)',
];

export const REPUTATION_MANAGER_ABI = [
  'function initializeReputation(address node) external',
  'function updateReputation(address node, uint256 newScore) external',
  'function getReputation(address node) external view returns (uint256)',
  'function getReputationDetails(address node) external view returns (tuple(uint256 score, uint256 lastUpdated, uint256 updateCount))',
  'event ReputationUpdated(address indexed node, uint256 oldScore, uint256 newScore, uint256 timestamp)',
];

export const LINK_PROOF_VERIFIER_ABI = [
  'function submitProof(bytes32 proofHash, uint256[] calldata publicInputs) external returns (bytes32)',
  'function verifyProof(bytes32 proofId, address nodeA, address nodeB, bool isValid) external',
  'function isConnectionVerified(address nodeA, address nodeB) external view returns (bool)',
  'function getProof(bytes32 proofId) external view returns (tuple(bytes32 proofHash, address prover, uint256 timestamp, bool verified))',
  'event ProofSubmitted(bytes32 indexed proofId, address indexed prover, uint256 timestamp)',
  'event ProofVerified(bytes32 indexed proofId, address indexed nodeA, address indexed nodeB)',
];

// Contract addresses (will be updated after deployment)
export const CONTRACT_ADDRESSES = {
  graphStorage: process.env.NEXT_PUBLIC_GRAPH_STORAGE_ADDRESS || '',
  aetherRegistry: process.env.NEXT_PUBLIC_AETHER_REGISTRY_ADDRESS || '',
  reputationManager: process.env.NEXT_PUBLIC_REPUTATION_MANAGER_ADDRESS || '',
  linkProofVerifier: process.env.NEXT_PUBLIC_LINK_PROOF_VERIFIER_ADDRESS || '',
};

export function getProvider() {
  if (typeof window !== 'undefined' && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum);
  }
  throw new Error('No ethereum provider found');
}

export async function getGraphStorageContract() {
  const provider = getProvider();
  const signer = await provider.getSigner();
  return new ethers.Contract(
    CONTRACT_ADDRESSES.graphStorage,
    GRAPH_STORAGE_ABI,
    signer
  );
}

export async function getAetherRegistryContract() {
  const provider = getProvider();
  const signer = await provider.getSigner();
  return new ethers.Contract(
    CONTRACT_ADDRESSES.aetherRegistry,
    AETHER_REGISTRY_ABI,
    signer
  );
}

export async function getReputationManagerContract() {
  const provider = getProvider();
  const signer = await provider.getSigner();
  return new ethers.Contract(
    CONTRACT_ADDRESSES.reputationManager,
    REPUTATION_MANAGER_ABI,
    signer
  );
}

export async function getLinkProofVerifierContract() {
  const provider = getProvider();
  const signer = await provider.getSigner();
  return new ethers.Contract(
    CONTRACT_ADDRESSES.linkProofVerifier,
    LINK_PROOF_VERIFIER_ABI,
    signer
  );
}

