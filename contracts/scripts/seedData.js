const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("Seeding test data...");

  if (!fs.existsSync("deployment.json")) {
    console.error("deployment.json not found");
    process.exit(1);
  }

  const deploymentInfo = JSON.parse(fs.readFileSync("deployment.json", "utf8"));
  const [deployer, user1, user2, user3] = await hre.ethers.getSigners();

  const aetherRegistry = await hre.ethers.getContractAt(
    "AetherRegistry",
    deploymentInfo.contracts.AetherRegistry
  );

  const reputationManager = await hre.ethers.getContractAt(
    "ReputationManager",
    deploymentInfo.contracts.ReputationManager
  );

  // Register nodes
  console.log("\nRegistering nodes...");
  await (await aetherRegistry.connect(user1).registerNode("ipfs://QmUser1Metadata")).wait();
  console.log("✓ User1 registered");
  
  await (await aetherRegistry.connect(user2).registerNode("ipfs://QmUser2Metadata")).wait();
  console.log("✓ User2 registered");
  
  await (await aetherRegistry.connect(user3).registerNode("ipfs://QmUser3Metadata")).wait();
  console.log("✓ User3 registered");

  // Create relationships
  console.log("\nCreating relationships...");
  const hash1 = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("relationship1"));
  await (await aetherRegistry.connect(user1).createRelationship(user2.address, 100, hash1)).wait();
  console.log("✓ Relationship 1→2 created");

  const hash2 = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("relationship2"));
  await (await aetherRegistry.connect(user2).createRelationship(user3.address, 150, hash2)).wait();
  console.log("✓ Relationship 2→3 created");

  // Initialize reputations
  console.log("\nInitializing reputations...");
  await (await reputationManager.initializeReputation(user1.address)).wait();
  await (await reputationManager.initializeReputation(user2.address)).wait();
  await (await reputationManager.initializeReputation(user3.address)).wait();
  console.log("✓ Reputations initialized");

  console.log("\n=== Seed Data Complete ===");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

