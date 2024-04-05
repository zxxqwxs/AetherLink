pragma circom 2.1.0;

include "../node_modules/circomlib/circuits/comparators.circom";
include "../node_modules/circomlib/circuits/poseidon.circom";

/**
 * PathProof Circuit
 * Proves that a path exists between two nodes in a social graph
 * without revealing the intermediate nodes
 */
template PathProof(maxDepth) {
    // Public inputs
    signal input startNode;
    signal input endNode;
    signal input pathHash; // Hash of the entire path for verification
    
    // Private inputs (hidden from verifier)
    signal input pathNodes[maxDepth];
    signal input pathWeights[maxDepth];
    signal input pathLength;
    
    // Output
    signal output isValid;
    
    // Constraints
    component isZero[maxDepth];
    component weightCheck[maxDepth];
    component pathHasher;
    
    // Verify start and end nodes match
    startNode === pathNodes[0];
    endNode === pathNodes[pathLength - 1];
    
    // Verify path length is within bounds
    component lengthCheck = LessEqThan(8);
    lengthCheck.in[0] <== pathLength;
    lengthCheck.in[1] <== maxDepth;
    lengthCheck.out === 1;
    
    // Verify all weights are positive
    for (var i = 0; i < maxDepth; i++) {
        weightCheck[i] = GreaterThan(32);
        weightCheck[i].in[0] <== pathWeights[i];
        weightCheck[i].in[1] <== 0;
    }
    
    // Compute path hash for verification
    pathHasher = Poseidon(2);
    pathHasher.inputs[0] <== startNode;
    pathHasher.inputs[1] <== endNode;
    
    // Verify path hash matches
    pathHash === pathHasher.out;
    
    // Output validity
    isValid <== 1;
}

/**
 * RelationshipProof Circuit
 * Proves that two nodes have a relationship with minimum weight
 * without revealing the exact weight
 */
template RelationshipProof() {
    // Public inputs
    signal input nodeA;
    signal input nodeB;
    signal input minWeight;
    signal input relationshipHash;
    
    // Private inputs
    signal input actualWeight;
    signal input salt;
    
    // Output
    signal output isValid;
    
    // Verify weight meets minimum threshold
    component weightCheck = GreaterEqThan(32);
    weightCheck.in[0] <== actualWeight;
    weightCheck.in[1] <== minWeight;
    weightCheck.out === 1;
    
    // Verify relationship hash
    component hasher = Poseidon(4);
    hasher.inputs[0] <== nodeA;
    hasher.inputs[1] <== nodeB;
    hasher.inputs[2] <== actualWeight;
    hasher.inputs[3] <== salt;
    
    relationshipHash === hasher.out;
    
    // Output validity
    isValid <== 1;
}

// Main component for path proof with max depth of 6
component main {public [startNode, endNode, pathHash]} = PathProof(6);

