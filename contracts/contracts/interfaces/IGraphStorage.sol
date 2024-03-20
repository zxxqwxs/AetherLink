// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IGraphStorage {
    struct Edge {
        address nodeA;
        address nodeB;
        uint256 weight;
        uint256 timestamp;
        bytes32 relationshipHash;
        bool active;
    }
    
    function createEdge(address nodeA, address nodeB, uint256 weight, bytes32 relationshipHash) external returns (bytes32);
    function updateEdgeWeight(bytes32 edgeId, uint256 newWeight) external;
    function deactivateEdge(bytes32 edgeId) external;
    function getNodeEdges(address node) external view returns (bytes32[] memory);
    function getEdge(bytes32 edgeId) external view returns (Edge memory);
    function isEdgeActive(bytes32 edgeId) external view returns (bool);
}

