const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("Starting contract verification...");

  // Load deployment info
  if (!fs.existsSync("deployment.json")) {
    console.error("deployment.json not found. Please deploy contracts first.");
    process.exit(1);
  }

  const deploymentInfo = JSON.parse(fs.readFileSync("deployment.json", "utf8"));
  const contracts = deploymentInfo.contracts;

  // Verify GraphStorage
  console.log("\nVerifying GraphStorage...");
  try {
    await hre.run("verify:verify", {
      address: contracts.GraphStorage,
      constructorArguments: [],
    });
    console.log("✓ GraphStorage verified");
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("✓ GraphStorage already verified");
    } else {
      console.error("✗ GraphStorage verification failed:", error.message);
    }
  }

  // Verify AetherRegistry
  console.log("\nVerifying AetherRegistry...");
  try {
    await hre.run("verify:verify", {
      address: contracts.AetherRegistry,
      constructorArguments: [contracts.GraphStorage],
    });
    console.log("✓ AetherRegistry verified");
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("✓ AetherRegistry already verified");
    } else {
      console.error("✗ AetherRegistry verification failed:", error.message);
    }
  }

  // Verify ReputationManager
  console.log("\nVerifying ReputationManager...");
  try {
    await hre.run("verify:verify", {
      address: contracts.ReputationManager,
      constructorArguments: [contracts.AetherRegistry],
    });
    console.log("✓ ReputationManager verified");
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("✓ ReputationManager already verified");
    } else {
      console.error("✗ ReputationManager verification failed:", error.message);
    }
  }

  // Verify LinkProofVerifier
  console.log("\nVerifying LinkProofVerifier...");
  try {
    await hre.run("verify:verify", {
      address: contracts.LinkProofVerifier,
      constructorArguments: [],
    });
    console.log("✓ LinkProofVerifier verified");
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("✓ LinkProofVerifier already verified");
    } else {
      console.error("✗ LinkProofVerifier verification failed:", error.message);
    }
  }

  console.log("\n=== Verification Complete ===");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

