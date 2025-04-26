interface ContractConfig {
  address: string;
  abi: any[];
}

export const contracts = {
  graphStorage: {
    address: process.env.NEXT_PUBLIC_GRAPH_STORAGE_ADDRESS || '',
    abi: [], // Import actual ABI
  },
  aetherRegistry: {
    address: process.env.NEXT_PUBLIC_AETHER_REGISTRY_ADDRESS || '',
    abi: [], // Import actual ABI
  },
  reputationManager: {
    address: process.env.NEXT_PUBLIC_REPUTATION_MANAGER_ADDRESS || '',
    abi: [], // Import actual ABI
  },
  linkProofVerifier: {
    address: process.env.NEXT_PUBLIC_LINK_PROOF_VERIFIER_ADDRESS || '',
    abi: [], // Import actual ABI
  },
} as const;

export type ContractName = keyof typeof contracts;

export function getContractConfig(name: ContractName): ContractConfig {
  return contracts[name];
}
