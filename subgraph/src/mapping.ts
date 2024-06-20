import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  NodeRegistered,
  NodeUpdated,
  RelationshipCreated,
} from "../generated/AetherRegistry/AetherRegistry";
import {
  ReputationUpdated,
} from "../generated/ReputationManager/ReputationManager";
import {
  ProofSubmitted,
  ProofVerified,
} from "../generated/LinkProofVerifier/LinkProofVerifier";
import {
  Node,
  Relationship,
  Proof,
  VerifiedConnection,
  ReputationHistory,
  GlobalStats,
} from "../generated/schema";

// Helper function to get or create global stats
function getOrCreateGlobalStats(): GlobalStats {
  let stats = GlobalStats.load("global");
  if (stats == null) {
    stats = new GlobalStats("global");
    stats.totalNodes = BigInt.fromI32(0);
    stats.totalRelationships = BigInt.fromI32(0);
    stats.totalProofs = BigInt.fromI32(0);
    stats.totalVerifiedProofs = BigInt.fromI32(0);
    stats.save();
  }
  return stats;
}

// AetherRegistry event handlers
export function handleNodeRegistered(event: NodeRegistered): void {
  let node = new Node(event.params.nodeAddress.toHexString());
  node.address = event.params.nodeAddress;
  node.metadata = "";
  node.registeredAt = event.params.timestamp;
  node.active = true;
  node.reputation = BigInt.fromI32(500000); // Initial score
  node.reputationLastUpdated = event.block.timestamp;
  node.save();

  let stats = getOrCreateGlobalStats();
  stats.totalNodes = stats.totalNodes.plus(BigInt.fromI32(1));
  stats.save();
}

export function handleNodeUpdated(event: NodeUpdated): void {
  let node = Node.load(event.params.nodeAddress.toHexString());
  if (node != null) {
    node.metadata = event.params.metadata;
    node.save();
  }
}

export function handleRelationshipCreated(event: RelationshipCreated): void {
  let relationshipId = event.params.edgeId.toHexString();
  let relationship = new Relationship(relationshipId);
  
  let fromNode = Node.load(event.params.from.toHexString());
  let toNode = Node.load(event.params.to.toHexString());
  
  if (fromNode != null && toNode != null) {
    relationship.from = fromNode.id;
    relationship.to = toNode.id;
    relationship.edgeId = event.params.edgeId;
    relationship.weight = event.params.weight;
    relationship.relationshipHash = Bytes.fromI32(0); // Default value
    relationship.createdAt = event.block.timestamp;
    relationship.active = true;
    relationship.save();

    let stats = getOrCreateGlobalStats();
    stats.totalRelationships = stats.totalRelationships.plus(BigInt.fromI32(1));
    stats.save();
  }
}

// ReputationManager event handlers
export function handleReputationUpdated(event: ReputationUpdated): void {
  let node = Node.load(event.params.node.toHexString());
  if (node != null) {
    node.reputation = event.params.newScore;
    node.reputationLastUpdated = event.params.timestamp;
    node.save();

    // Create reputation history entry
    let historyId = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
    let history = new ReputationHistory(historyId);
    history.node = node.id;
    history.oldScore = event.params.oldScore;
    history.newScore = event.params.newScore;
    history.timestamp = event.params.timestamp;
    history.transactionHash = event.transaction.hash;
    history.save();
  }
}

// LinkProofVerifier event handlers
export function handleProofSubmitted(event: ProofSubmitted): void {
  let proof = new Proof(event.params.proofId.toHexString());
  proof.proofId = event.params.proofId;
  proof.proofHash = Bytes.fromI32(0); // Will be updated when proof details are available
  proof.prover = event.params.prover.toHexString();
  proof.submittedAt = event.params.timestamp;
  proof.verified = false;
  proof.save();

  let stats = getOrCreateGlobalStats();
  stats.totalProofs = stats.totalProofs.plus(BigInt.fromI32(1));
  stats.save();
}

export function handleProofVerified(event: ProofVerified): void {
  let proof = Proof.load(event.params.proofId.toHexString());
  if (proof != null) {
    proof.verified = true;
    proof.nodeA = event.params.nodeA;
    proof.nodeB = event.params.nodeB;
    proof.verifiedAt = event.block.timestamp;
    proof.save();

    // Create verified connection
    let connectionId = event.params.nodeA.toHexString() + "-" + event.params.nodeB.toHexString();
    let connection = new VerifiedConnection(connectionId);
    connection.nodeA = event.params.nodeA;
    connection.nodeB = event.params.nodeB;
    connection.proofId = event.params.proofId;
    connection.verifiedAt = event.block.timestamp;
    connection.save();

    let stats = getOrCreateGlobalStats();
    stats.totalVerifiedProofs = stats.totalVerifiedProofs.plus(BigInt.fromI32(1));
    stats.save();
  }
}

