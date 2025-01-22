// Network configuration constants
export const SUPPORTED_CHAINS = {
  POLYGON_MUMBAI: {
    id: 80001,
    name: 'Polygon Mumbai',
    rpcUrl: 'https://rpc-mumbai.maticvigil.com',
    blockExplorer: 'https://mumbai.polygonscan.com',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
  },
  POLYGON_ZKEVM: {
    id: 1101,
    name: 'Polygon zkEVM',
    rpcUrl: 'https://zkevm-rpc.com',
    blockExplorer: 'https://zkevm.polygonscan.com',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
  },
} as const;

// Contract constants
export const REPUTATION_CONSTANTS = {
  MIN_SCORE: 0,
  MAX_SCORE: 1000000,
  INITIAL_SCORE: 500000,
  DECAY_RATE: 0.95,
  DECAY_PERIOD_DAYS: 30,
} as const;

// UI constants
export const GRAPH_CONSTANTS = {
  MIN_NODE_SIZE: 10,
  MAX_NODE_SIZE: 30,
  LINK_DISTANCE: 150,
  CHARGE_STRENGTH: -300,
  ALPHA_DECAY: 0.02,
} as const;

// Error messages
export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: 'Please connect your wallet first',
  WRONG_NETWORK: 'Please switch to the correct network',
  TRANSACTION_FAILED: 'Transaction failed. Please try again',
  NODE_NOT_REGISTERED: 'Node not registered. Please register first',
  INSUFFICIENT_GAS: 'Insufficient gas for transaction',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  NODE_REGISTERED: 'Node registered successfully!',
  RELATIONSHIP_CREATED: 'Relationship created successfully!',
  PROOF_SUBMITTED: 'Proof submitted successfully!',
  REPUTATION_UPDATED: 'Reputation updated successfully!',
} as const;

