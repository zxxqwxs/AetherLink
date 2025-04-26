import { BigInt, Address } from "@graphprotocol/graph-ts";

// Common addresses
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

// BigInt constants
export const ZERO_BI = BigInt.fromI32(0);
export const ONE_BI = BigInt.fromI32(1);

// Reputation constants
export const INITIAL_REPUTATION = BigInt.fromI32(500000);
export const MIN_REPUTATION = BigInt.fromI32(0);
export const MAX_REPUTATION = BigInt.fromI32(1000000);

// Time constants
export const SECONDS_PER_DAY = BigInt.fromI32(86400);
export const SECONDS_PER_HOUR = BigInt.fromI32(3600);

// Event types
export const EVENT_NODE_REGISTERED = 'NODE_REGISTERED';
export const EVENT_RELATIONSHIP_CREATED = 'RELATIONSHIP_CREATED';
export const EVENT_REPUTATION_UPDATED = 'REPUTATION_UPDATED';
export const EVENT_PROOF_VERIFIED = 'PROOF_VERIFIED';
