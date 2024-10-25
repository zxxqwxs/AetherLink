const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("Starting role assignment...");

  // Load deployment info
  const deploymentInfo = JSON.parse(fs.readFileSync("deployment.json", "utf8"));
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("Granting roles with account:", deployer.address);

  // Get contract instances
  const aetherRegistry = await hre.ethers.getContractAt(
    "AetherRegistry",
    deploymentInfo.contracts.AetherRegistry
  );

  const reputationManager = await hre.ethers.getContractAt(
    "ReputationManager",
    deploymentInfo.contracts.ReputationManager
  );

  const linkProofVerifier = await hre.ethers.getContractAt(
    "LinkProofVerifier",
    deploymentInfo.contracts.LinkProofVerifier
  );

  // Define role addresses (update these with actual addresses)
  const ORACLE_ADDRESS = process.env.ORACLE_ADDRESS || deployer.address;
  const VERIFIER_ADDRESS = process.env.VERIFIER_ADDRESS || deployer.address;

  // Grant Oracle role to ReputationManager
  console.log("\nGranting ORACLE_ROLE to:", ORACLE_ADDRESS);
  const oracleRole = await reputationManager.ORACLE_ROLE();
  
  if (!(await reputationManager.hasRole(oracleRole, ORACLE_ADDRESS))) {
    const tx1 = await reputationManager.grantRole(oracleRole, ORACLE_ADDRESS);
    await tx1.wait();
    console.log("✓ ORACLE_ROLE granted");
  } else {
    console.log("✓ ORACLE_ROLE already granted");
  }

  // Grant Updater role to ReputationManager
  console.log("\nGranting UPDATER_ROLE to:", ORACLE_ADDRESS);
  const updaterRole = await reputationManager.UPDATER_ROLE();
  
  if (!(await reputationManager.hasRole(updaterRole, ORACLE_ADDRESS))) {
    const tx2 = await reputationManager.grantRole(updaterRole, ORACLE_ADDRESS);
    await tx2.wait();
    console.log("✓ UPDATER_ROLE granted");
  } else {
    console.log("✓ UPDATER_ROLE already granted");
  }

  // Grant Verifier role to LinkProofVerifier
  console.log("\nGranting VERIFIER_ROLE to:", VERIFIER_ADDRESS);
  const verifierRole = await linkProofVerifier.VERIFIER_ROLE();
  
  if (!(await linkProofVerifier.hasRole(verifierRole, VERIFIER_ADDRESS))) {
    const tx3 = await linkProofVerifier.grantRole(verifierRole, VERIFIER_ADDRESS);
    await tx3.wait();
    console.log("✓ VERIFIER_ROLE granted");
  } else {
    console.log("✓ VERIFIER_ROLE already granted");
  }

  // Grant Oracle role to AetherRegistry
  console.log("\nGranting ORACLE_ROLE (Registry) to:", ORACLE_ADDRESS);
  const registryOracleRole = await aetherRegistry.ORACLE_ROLE();
  
  if (!(await aetherRegistry.hasRole(registryOracleRole, ORACLE_ADDRESS))) {
    const tx4 = await aetherRegistry.grantRole(registryOracleRole, ORACLE_ADDRESS);
    await tx4.wait();
    console.log("✓ Registry ORACLE_ROLE granted");
  } else {
    console.log("✓ Registry ORACLE_ROLE already granted");
  }

  // Grant Verifier role to AetherRegistry
  console.log("\nGranting VERIFIER_ROLE (Registry) to:", VERIFIER_ADDRESS);
  const registryVerifierRole = await aetherRegistry.VERIFIER_ROLE();
  
  if (!(await aetherRegistry.hasRole(registryVerifierRole, VERIFIER_ADDRESS))) {
    const tx5 = await aetherRegistry.grantRole(registryVerifierRole, VERIFIER_ADDRESS);
    await tx5.wait();
    console.log("✓ Registry VERIFIER_ROLE granted");
  } else {
    console.log("✓ Registry VERIFIER_ROLE already granted");
  }

  console.log("\n=== Role Assignment Complete ===");
  console.log("Oracle Address:", ORACLE_ADDRESS);
  console.log("Verifier Address:", VERIFIER_ADDRESS);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

