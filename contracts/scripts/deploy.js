const hre = require("hardhat");

async function main() {
  console.log("Starting deployment of AetherLink contracts...");

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Deploy GraphStorage
  console.log("\nDeploying GraphStorage...");
  const GraphStorage = await hre.ethers.getContractFactory("GraphStorage");
  const graphStorage = await GraphStorage.deploy();
  await graphStorage.waitForDeployment();
  const graphStorageAddress = await graphStorage.getAddress();
  console.log("GraphStorage deployed to:", graphStorageAddress);

  // Deploy AetherRegistry
  console.log("\nDeploying AetherRegistry...");
  const AetherRegistry = await hre.ethers.getContractFactory("AetherRegistry");
  const aetherRegistry = await AetherRegistry.deploy(graphStorageAddress);
  await aetherRegistry.waitForDeployment();
  const aetherRegistryAddress = await aetherRegistry.getAddress();
  console.log("AetherRegistry deployed to:", aetherRegistryAddress);

  // Deploy ReputationManager
  console.log("\nDeploying ReputationManager...");
  const ReputationManager = await hre.ethers.getContractFactory("ReputationManager");
  const reputationManager = await ReputationManager.deploy(aetherRegistryAddress);
  await reputationManager.waitForDeployment();
  const reputationManagerAddress = await reputationManager.getAddress();
  console.log("ReputationManager deployed to:", reputationManagerAddress);

  // Deploy LinkProofVerifier
  console.log("\nDeploying LinkProofVerifier...");
  const LinkProofVerifier = await hre.ethers.getContractFactory("LinkProofVerifier");
  const linkProofVerifier = await LinkProofVerifier.deploy();
  await linkProofVerifier.waitForDeployment();
  const linkProofVerifierAddress = await linkProofVerifier.getAddress();
  console.log("LinkProofVerifier deployed to:", linkProofVerifierAddress);

  // Summary
  console.log("\n=== Deployment Summary ===");
  console.log("GraphStorage:", graphStorageAddress);
  console.log("AetherRegistry:", aetherRegistryAddress);
  console.log("ReputationManager:", reputationManagerAddress);
  console.log("LinkProofVerifier:", linkProofVerifierAddress);
  console.log("\nDeployment completed successfully!");

  // Save deployment addresses
  const fs = require("fs");
  const deploymentInfo = {
    network: hre.network.name,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      GraphStorage: graphStorageAddress,
      AetherRegistry: aetherRegistryAddress,
      ReputationManager: reputationManagerAddress,
      LinkProofVerifier: linkProofVerifierAddress,
    },
  };

  fs.writeFileSync(
    "deployment.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("\nDeployment info saved to deployment.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

