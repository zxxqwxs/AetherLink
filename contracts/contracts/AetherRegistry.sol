// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./GraphStorage.sol";

/**
 * @title AetherRegistry
 * @dev Main registry for managing nodes and their relationships
 */
contract AetherRegistry is AccessControl {
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");
    
    struct Node {
        address nodeAddress;
        string metadata;
        uint256 registeredAt;
        bool active;
    }
    
    GraphStorage public graphStorage;
    
    // Mapping from address to Node
    mapping(address => Node) public nodes;
    
    // Total registered nodes
    uint256 public nodeCount;
    
    // Events
    event NodeRegistered(address indexed nodeAddress, uint256 timestamp);
    event NodeUpdated(address indexed nodeAddress, string metadata);
    event NodeDeactivated(address indexed nodeAddress);
    event RelationshipCreated(
        address indexed from,
        address indexed to,
        bytes32 edgeId,
        uint256 weight
    );
    
    constructor(address _graphStorage) {
        require(_graphStorage != address(0), "Invalid GraphStorage address");
        graphStorage = GraphStorage(_graphStorage);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(VERIFIER_ROLE, msg.sender);
        _grantRole(ORACLE_ROLE, msg.sender);
    }
    
    /**
     * @dev Registers a new node in the network
     * @param metadata IPFS hash or metadata string
     */
    function registerNode(string memory metadata) external {
        require(nodes[msg.sender].nodeAddress == address(0), "Node already registered");
        
        nodes[msg.sender] = Node({
            nodeAddress: msg.sender,
            metadata: metadata,
            registeredAt: block.timestamp,
            active: true
        });
        
        nodeCount++;
        
        emit NodeRegistered(msg.sender, block.timestamp);
    }
    
    /**
     * @dev Updates node metadata
     * @param metadata New metadata string
     */
    function updateNodeMetadata(string memory metadata) external {
        require(nodes[msg.sender].active, "Node not registered or inactive");
        
        nodes[msg.sender].metadata = metadata;
        
        emit NodeUpdated(msg.sender, metadata);
    }
    
    /**
     * @dev Deactivates a node
     */
    function deactivateNode() external {
        require(nodes[msg.sender].active, "Node not registered or already inactive");
        
        nodes[msg.sender].active = false;
        
        emit NodeDeactivated(msg.sender);
    }
    
    /**
     * @dev Creates a relationship between two nodes
     * @param to Target node address
     * @param weight Relationship weight
     * @param relationshipHash Hash of relationship metadata
     */
    function createRelationship(
        address to,
        uint256 weight,
        bytes32 relationshipHash
    ) external returns (bytes32) {
        require(nodes[msg.sender].active, "Sender node not active");
        require(nodes[to].active, "Target node not active");
        require(msg.sender != to, "Cannot create self-relationship");
        
        bytes32 edgeId = graphStorage.createEdge(
            msg.sender,
            to,
            weight,
            relationshipHash
        );
        
        emit RelationshipCreated(msg.sender, to, edgeId, weight);
        
        return edgeId;
    }
    
    /**
     * @dev Checks if a node is registered and active
     * @param nodeAddress Address to check
     * @return Boolean indicating if node is active
     */
    function isNodeActive(address nodeAddress) external view returns (bool) {
        return nodes[nodeAddress].active;
    }
    
    /**
     * @dev Gets node information
     * @param nodeAddress Address of the node
     * @return Node struct
     */
    function getNode(address nodeAddress) external view returns (Node memory) {
        return nodes[nodeAddress];
    }
    
    /**
     * @dev Updates GraphStorage address (admin only)
     * @param newGraphStorage New GraphStorage contract address
     */
    function updateGraphStorage(address newGraphStorage) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newGraphStorage != address(0), "Invalid address");
        graphStorage = GraphStorage(newGraphStorage);
    }
}

