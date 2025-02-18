/**
 * Validation utility functions
 */

/**
 * Checks if a string is a valid Ethereum address
 * @param address String to validate
 * @returns True if valid Ethereum address
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Checks if a value is a valid reputation score
 * @param score Score to validate
 * @returns True if valid (0-1000000)
 */
export function isValidReputation(score: number): boolean {
  return score >= 0 && score <= 1000000;
}

/**
 * Checks if a weight value is valid
 * @param weight Weight to validate
 * @returns True if valid (positive number)
 */
export function isValidWeight(weight: number): boolean {
  return weight > 0 && Number.isFinite(weight);
}

/**
 * Validates IPFS hash format
 * @param hash IPFS hash to validate
 * @returns True if valid IPFS hash
 */
export function isValidIPFSHash(hash: string): boolean {
  return /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/.test(hash);
}

/**
 * Validates metadata string
 * @param metadata Metadata to validate
 * @returns True if valid (non-empty string)
 */
export function isValidMetadata(metadata: string): boolean {
  return typeof metadata === 'string' && metadata.trim().length > 0;
}

/**
 * Validates proof data
 * @param proof Proof bytes
 * @returns True if valid proof format
 */
export function isValidProof(proof: string): boolean {
  return /^0x[a-fA-F0-9]+$/.test(proof) && proof.length > 10;
}

/**
 * Validates array of public inputs
 * @param inputs Array of public inputs
 * @returns True if valid
 */
export function isValidPublicInputs(inputs: any[]): boolean {
  return Array.isArray(inputs) && inputs.length > 0;
}

