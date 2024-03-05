// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./AetherRegistry.sol";

/**
 * @title ReputationManager
 * @dev Manages reputation scores based on EigenTrust/GraphRank algorithms
 */
contract ReputationManager is AccessControl {
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");
    bytes32 public constant UPDATER_ROLE = keccak256("UPDATER_ROLE");
    
    struct ReputationScore {
        uint256 score;
        uint256 lastUpdated;
        uint256 updateCount;
    }
    
    AetherRegistry public registry;
    
    // Mapping from address to reputation score
    mapping(address => ReputationScore) public reputations;
    
    // Minimum and maximum reputation scores
    uint256 public constant MIN_SCORE = 0;
    uint256 public constant MAX_SCORE = 1000000; // Using fixed point: 1000000 = 1.0
    uint256 public constant INITIAL_SCORE = 500000; // 0.5
    
    // Decay parameters
    uint256 public decayRate = 950000; // 0.95
    uint256 public decayPeriod = 30 days;
    
    // Events
    event ReputationUpdated(
        address indexed node,
        uint256 oldScore,
        uint256 newScore,
        uint256 timestamp
    );
    event ReputationDecayed(
        address indexed node,
        uint256 oldScore,
        uint256 newScore
    );
    event DecayParametersUpdated(uint256 newRate, uint256 newPeriod);
    
    constructor(address _registry) {
        require(_registry != address(0), "Invalid registry address");
        registry = AetherRegistry(_registry);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ORACLE_ROLE, msg.sender);
        _grantRole(UPDATER_ROLE, msg.sender);
    }
    
    /**
     * @dev Initializes reputation for a new node
     * @param node Address of the node
     */
    function initializeReputation(address node) external {
        require(registry.isNodeActive(node), "Node not active");
        require(reputations[node].lastUpdated == 0, "Reputation already initialized");
        
        reputations[node] = ReputationScore({
            score: INITIAL_SCORE,
            lastUpdated: block.timestamp,
            updateCount: 0
        });
        
        emit ReputationUpdated(node, 0, INITIAL_SCORE, block.timestamp);
    }
    
    /**
     * @dev Updates reputation score (Oracle role only)
     * @param node Address of the node
     * @param newScore New reputation score
     */
    function updateReputation(address node, uint256 newScore) external onlyRole(ORACLE_ROLE) {
        require(registry.isNodeActive(node), "Node not active");
        require(newScore >= MIN_SCORE && newScore <= MAX_SCORE, "Score out of bounds");
        
        uint256 oldScore = reputations[node].score;
        
        reputations[node].score = newScore;
        reputations[node].lastUpdated = block.timestamp;
        reputations[node].updateCount++;
        
        emit ReputationUpdated(node, oldScore, newScore, block.timestamp);
    }
    
    /**
     * @dev Batch updates reputation scores (Oracle role only)
     * @param nodes Array of node addresses
     * @param scores Array of new scores
     */
    function batchUpdateReputation(
        address[] calldata nodes,
        uint256[] calldata scores
    ) external onlyRole(ORACLE_ROLE) {
        require(nodes.length == scores.length, "Array length mismatch");
        
        for (uint256 i = 0; i < nodes.length; i++) {
            if (registry.isNodeActive(nodes[i]) && 
                scores[i] >= MIN_SCORE && 
                scores[i] <= MAX_SCORE) {
                
                uint256 oldScore = reputations[nodes[i]].score;
                reputations[nodes[i]].score = scores[i];
                reputations[nodes[i]].lastUpdated = block.timestamp;
                reputations[nodes[i]].updateCount++;
                
                emit ReputationUpdated(nodes[i], oldScore, scores[i], block.timestamp);
            }
        }
    }
    
    /**
     * @dev Applies time decay to reputation score
     * @param node Address of the node
     */
    function applyDecay(address node) public {
        ReputationScore storage rep = reputations[node];
        require(rep.lastUpdated > 0, "Reputation not initialized");
        
        uint256 timePassed = block.timestamp - rep.lastUpdated;
        if (timePassed < decayPeriod) {
            return;
        }
        
        uint256 periods = timePassed / decayPeriod;
        uint256 oldScore = rep.score;
        uint256 newScore = oldScore;
        
        for (uint256 i = 0; i < periods && i < 10; i++) {
            newScore = (newScore * decayRate) / 1000000;
        }
        
        rep.score = newScore;
        rep.lastUpdated = block.timestamp;
        
        emit ReputationDecayed(node, oldScore, newScore);
    }
    
    /**
     * @dev Gets current reputation score with decay applied
     * @param node Address of the node
     * @return Current reputation score
     */
    function getReputation(address node) external view returns (uint256) {
        ReputationScore memory rep = reputations[node];
        if (rep.lastUpdated == 0) {
            return INITIAL_SCORE;
        }
        
        uint256 timePassed = block.timestamp - rep.lastUpdated;
        if (timePassed < decayPeriod) {
            return rep.score;
        }
        
        uint256 periods = timePassed / decayPeriod;
        uint256 score = rep.score;
        
        for (uint256 i = 0; i < periods && i < 10; i++) {
            score = (score * decayRate) / 1000000;
        }
        
        return score;
    }
    
    /**
     * @dev Updates decay parameters (Admin only)
     * @param newRate New decay rate
     * @param newPeriod New decay period
     */
    function updateDecayParameters(
        uint256 newRate,
        uint256 newPeriod
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newRate <= 1000000, "Invalid decay rate");
        require(newPeriod > 0, "Invalid decay period");
        
        decayRate = newRate;
        decayPeriod = newPeriod;
        
        emit DecayParametersUpdated(newRate, newPeriod);
    }
    
    /**
     * @dev Gets full reputation details
     * @param node Address of the node
     * @return ReputationScore struct
     */
    function getReputationDetails(address node) external view returns (ReputationScore memory) {
        return reputations[node];
    }
}

