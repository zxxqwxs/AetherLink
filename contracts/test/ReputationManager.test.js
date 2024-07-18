const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture, time } = require("@nomicfoundation/hardhat-network-helpers");

describe("ReputationManager", function () {
  async function deployReputationManagerFixture() {
    const [owner, oracle, addr1, addr2, addr3] = await ethers.getSigners();
    
    // Deploy GraphStorage
    const GraphStorage = await ethers.getContractFactory("GraphStorage");
    const graphStorage = await GraphStorage.deploy();
    await graphStorage.waitForDeployment();
    
    // Deploy AetherRegistry
    const AetherRegistry = await ethers.getContractFactory("AetherRegistry");
    const aetherRegistry = await AetherRegistry.deploy(await graphStorage.getAddress());
    await aetherRegistry.waitForDeployment();
    
    // Deploy ReputationManager
    const ReputationManager = await ethers.getContractFactory("ReputationManager");
    const reputationManager = await ReputationManager.deploy(await aetherRegistry.getAddress());
    await reputationManager.waitForDeployment();
    
    // Grant oracle role
    const oracleRole = await reputationManager.ORACLE_ROLE();
    await reputationManager.grantRole(oracleRole, oracle.address);
    
    // Register some nodes
    await aetherRegistry.connect(addr1).registerNode("metadata1");
    await aetherRegistry.connect(addr2).registerNode("metadata2");
    await aetherRegistry.connect(addr3).registerNode("metadata3");
    
    return { reputationManager, aetherRegistry, owner, oracle, addr1, addr2, addr3 };
  }

  describe("Deployment", function () {
    it("Should set the correct registry address", async function () {
      const { reputationManager, aetherRegistry } = await loadFixture(deployReputationManagerFixture);
      expect(await reputationManager.registry()).to.equal(await aetherRegistry.getAddress());
    });

    it("Should have correct initial constants", async function () {
      const { reputationManager } = await loadFixture(deployReputationManagerFixture);
      expect(await reputationManager.MIN_SCORE()).to.equal(0);
      expect(await reputationManager.MAX_SCORE()).to.equal(1000000);
      expect(await reputationManager.INITIAL_SCORE()).to.equal(500000);
    });
  });

  describe("Reputation Initialization", function () {
    it("Should initialize reputation for a node", async function () {
      const { reputationManager, addr1 } = await loadFixture(deployReputationManagerFixture);
      
      await expect(reputationManager.initializeReputation(addr1.address))
        .to.emit(reputationManager, "ReputationUpdated");
      
      const reputation = await reputationManager.getReputation(addr1.address);
      expect(reputation).to.equal(500000);
    });

    it("Should reject duplicate initialization", async function () {
      const { reputationManager, addr1 } = await loadFixture(deployReputationManagerFixture);
      
      await reputationManager.initializeReputation(addr1.address);
      
      await expect(
        reputationManager.initializeReputation(addr1.address)
      ).to.be.revertedWith("Reputation already initialized");
    });

    it("Should reject initialization for inactive node", async function () {
      const { reputationManager, owner } = await loadFixture(deployReputationManagerFixture);
      
      await expect(
        reputationManager.initializeReputation(owner.address)
      ).to.be.revertedWith("Node not active");
    });
  });

  describe("Reputation Updates", function () {
    it("Should allow oracle to update reputation", async function () {
      const { reputationManager, oracle, addr1 } = await loadFixture(deployReputationManagerFixture);
      
      await reputationManager.initializeReputation(addr1.address);
      
      const newScore = 750000;
      await expect(reputationManager.connect(oracle).updateReputation(addr1.address, newScore))
        .to.emit(reputationManager, "ReputationUpdated")
        .withArgs(addr1.address, 500000, newScore, await ethers.provider.getBlock('latest').then(b => b.timestamp + 1));
      
      expect(await reputationManager.getReputation(addr1.address)).to.equal(newScore);
    });

    it("Should reject update from non-oracle", async function () {
      const { reputationManager, addr1, addr2 } = await loadFixture(deployReputationManagerFixture);
      
      await reputationManager.initializeReputation(addr1.address);
      
      await expect(
        reputationManager.connect(addr2).updateReputation(addr1.address, 750000)
      ).to.be.reverted;
    });

    it("Should reject out of bounds scores", async function () {
      const { reputationManager, oracle, addr1 } = await loadFixture(deployReputationManagerFixture);
      
      await reputationManager.initializeReputation(addr1.address);
      
      await expect(
        reputationManager.connect(oracle).updateReputation(addr1.address, 1000001)
      ).to.be.revertedWith("Score out of bounds");
    });
  });

  describe("Batch Updates", function () {
    it("Should batch update multiple reputations", async function () {
      const { reputationManager, oracle, addr1, addr2, addr3 } = await loadFixture(deployReputationManagerFixture);
      
      await reputationManager.initializeReputation(addr1.address);
      await reputationManager.initializeReputation(addr2.address);
      await reputationManager.initializeReputation(addr3.address);
      
      const nodes = [addr1.address, addr2.address, addr3.address];
      const scores = [600000, 700000, 800000];
      
      await reputationManager.connect(oracle).batchUpdateReputation(nodes, scores);
      
      expect(await reputationManager.getReputation(addr1.address)).to.equal(600000);
      expect(await reputationManager.getReputation(addr2.address)).to.equal(700000);
      expect(await reputationManager.getReputation(addr3.address)).to.equal(800000);
    });

    it("Should reject batch update with mismatched arrays", async function () {
      const { reputationManager, oracle, addr1, addr2 } = await loadFixture(deployReputationManagerFixture);
      
      const nodes = [addr1.address, addr2.address];
      const scores = [600000];
      
      await expect(
        reputationManager.connect(oracle).batchUpdateReputation(nodes, scores)
      ).to.be.revertedWith("Array length mismatch");
    });
  });

  describe("Reputation Decay", function () {
    it("Should apply time decay to reputation", async function () {
      const { reputationManager, addr1 } = await loadFixture(deployReputationManagerFixture);
      
      await reputationManager.initializeReputation(addr1.address);
      
      // Fast forward time by 30 days
      await time.increase(30 * 24 * 60 * 60);
      
      await reputationManager.applyDecay(addr1.address);
      
      const reputation = await reputationManager.getReputation(addr1.address);
      expect(reputation).to.be.lt(500000); // Should be less than initial
    });

    it("Should calculate decay correctly in getReputation", async function () {
      const { reputationManager, addr1 } = await loadFixture(deployReputationManagerFixture);
      
      await reputationManager.initializeReputation(addr1.address);
      const initialRep = await reputationManager.getReputation(addr1.address);
      
      // Fast forward time
      await time.increase(30 * 24 * 60 * 60);
      
      const decayedRep = await reputationManager.getReputation(addr1.address);
      expect(decayedRep).to.be.lt(initialRep);
    });
  });

  describe("Decay Parameters", function () {
    it("Should allow admin to update decay parameters", async function () {
      const { reputationManager, owner } = await loadFixture(deployReputationManagerFixture);
      
      const newRate = 900000; // 0.9
      const newPeriod = 60 * 24 * 60 * 60; // 60 days
      
      await expect(reputationManager.connect(owner).updateDecayParameters(newRate, newPeriod))
        .to.emit(reputationManager, "DecayParametersUpdated")
        .withArgs(newRate, newPeriod);
      
      expect(await reputationManager.decayRate()).to.equal(newRate);
      expect(await reputationManager.decayPeriod()).to.equal(newPeriod);
    });

    it("Should reject invalid decay parameters", async function () {
      const { reputationManager, owner } = await loadFixture(deployReputationManagerFixture);
      
      await expect(
        reputationManager.connect(owner).updateDecayParameters(1000001, 30 * 24 * 60 * 60)
      ).to.be.revertedWith("Invalid decay rate");
      
      await expect(
        reputationManager.connect(owner).updateDecayParameters(950000, 0)
      ).to.be.revertedWith("Invalid decay period");
    });
  });
});

