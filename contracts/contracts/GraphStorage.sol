// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title GraphStorage
 * @dev Stores relationship hashes and graph edges on-chain
 */
contract GraphStorage is Ownable {
    struct Edge {
        address nodeA;
        address nodeB;
        uint256 weight;
        uint256 timestamp;
        bytes32 relationshipHash;
        bool active;
    }

    // Mapping from edge ID to Edge struct
    mapping(bytes32 => Edge) public edges;
    
    // Mapping from address to list of edge IDs
    mapping(address => bytes32[]) public nodeEdges;
    
    // Total number of edges
    uint256 public edgeCount;
    
    // Events
    event EdgeCreated(
        bytes32 indexed edgeId,
        address indexed nodeA,
        address indexed nodeB,
        uint256 weight,
        uint256 timestamp
    );
    
    event EdgeUpdated(
        bytes32 indexed edgeId,
        uint256 newWeight,
        uint256 timestamp
    );
    
    event EdgeDeactivated(bytes32 indexed edgeId);
    
    constructor() Ownable(msg.sender) {}
    
    /**
     * @dev Creates a new edge between two nodes
     * @param nodeA First node address
     * @param nodeB Second node address
     * @param weight Edge weight
     * @param relationshipHash Hash of the relationship metadata
     */
    function createEdge(
        address nodeA,
        address nodeB,
        uint256 weight,
        bytes32 relationshipHash
    ) external returns (bytes32) {
        require(nodeA != address(0) && nodeB != address(0), "Invalid node address");
        require(nodeA != nodeB, "Cannot create self-loop");
        require(weight > 0, "Weight must be positive");
        
        bytes32 edgeId = keccak256(abi.encodePacked(nodeA, nodeB, block.timestamp, edgeCount));
        
        require(edges[edgeId].nodeA == address(0), "Edge already exists");
        
        edges[edgeId] = Edge({
            nodeA: nodeA,
            nodeB: nodeB,
            weight: weight,
            timestamp: block.timestamp,
            relationshipHash: relationshipHash,
            active: true
        });
        
        nodeEdges[nodeA].push(edgeId);
        nodeEdges[nodeB].push(edgeId);
        
        edgeCount++;
        
        emit EdgeCreated(edgeId, nodeA, nodeB, weight, block.timestamp);
        
        return edgeId;
    }
    
    /**
     * @dev Updates the weight of an existing edge
     * @param edgeId ID of the edge to update
     * @param newWeight New weight value
     */
    function updateEdgeWeight(bytes32 edgeId, uint256 newWeight) external {
        require(edges[edgeId].active, "Edge does not exist or is inactive");
        require(
            msg.sender == edges[edgeId].nodeA || msg.sender == edges[edgeId].nodeB,
            "Not authorized"
        );
        require(newWeight > 0, "Weight must be positive");
        
        edges[edgeId].weight = newWeight;
        edges[edgeId].timestamp = block.timestamp;
        
        emit EdgeUpdated(edgeId, newWeight, block.timestamp);
    }
    
    /**
     * @dev Deactivates an edge
     * @param edgeId ID of the edge to deactivate
     */
    function deactivateEdge(bytes32 edgeId) external {
        require(edges[edgeId].active, "Edge does not exist or is already inactive");
        require(
            msg.sender == edges[edgeId].nodeA || 
            msg.sender == edges[edgeId].nodeB || 
            msg.sender == owner(),
            "Not authorized"
        );
        
        edges[edgeId].active = false;
        
        emit EdgeDeactivated(edgeId);
    }
    
    /**
     * @dev Gets all edges for a specific node
     * @param node Address of the node
     * @return Array of edge IDs
     */
    function getNodeEdges(address node) external view returns (bytes32[] memory) {
        return nodeEdges[node];
    }
    
    /**
     * @dev Gets edge details
     * @param edgeId ID of the edge
     * @return Edge struct
     */
    function getEdge(bytes32 edgeId) external view returns (Edge memory) {
        return edges[edgeId];
    }
    
    /**
     * @dev Checks if an edge exists and is active
     * @param edgeId ID of the edge
     * @return Boolean indicating if edge is active
     */
    function isEdgeActive(bytes32 edgeId) external view returns (bool) {
        return edges[edgeId].active;
    }
}

