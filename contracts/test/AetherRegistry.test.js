const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("AetherRegistry", function () {
  async function deployAetherRegistryFixture() {
    const [owner, addr1, addr2, addr3] = await ethers.getSigners();
    
    // Deploy GraphStorage first
    const GraphStorage = await ethers.getContractFactory("GraphStorage");
    const graphStorage = await GraphStorage.deploy();
    await graphStorage.waitForDeployment();
    
    // Deploy AetherRegistry
    const AetherRegistry = await ethers.getContractFactory("AetherRegistry");
    const aetherRegistry = await AetherRegistry.deploy(await graphStorage.getAddress());
    await aetherRegistry.waitForDeployment();
    
    return { graphStorage, aetherRegistry, owner, addr1, addr2, addr3 };
  }

  describe("Deployment", function () {
    it("Should set the correct GraphStorage address", async function () {
      const { aetherRegistry, graphStorage } = await loadFixture(deployAetherRegistryFixture);
      expect(await aetherRegistry.graphStorage()).to.equal(await graphStorage.getAddress());
    });

    it("Should grant admin role to deployer", async function () {
      const { aetherRegistry, owner } = await loadFixture(deployAetherRegistryFixture);
      const adminRole = await aetherRegistry.DEFAULT_ADMIN_ROLE();
      expect(await aetherRegistry.hasRole(adminRole, owner.address)).to.be.true;
    });
  });

  describe("Node Registration", function () {
    it("Should register a new node", async function () {
      const { aetherRegistry, addr1 } = await loadFixture(deployAetherRegistryFixture);
      
      const metadata = "ipfs://QmTest123";
      
      await expect(aetherRegistry.connect(addr1).registerNode(metadata))
        .to.emit(aetherRegistry, "NodeRegistered")
        .withArgs(addr1.address, await ethers.provider.getBlock('latest').then(b => b.timestamp + 1));
      
      const node = await aetherRegistry.getNode(addr1.address);
      expect(node.nodeAddress).to.equal(addr1.address);
      expect(node.metadata).to.equal(metadata);
      expect(node.active).to.be.true;
    });

    it("Should reject duplicate registration", async function () {
      const { aetherRegistry, addr1 } = await loadFixture(deployAetherRegistryFixture);
      
      await aetherRegistry.connect(addr1).registerNode("metadata1");
      
      await expect(
        aetherRegistry.connect(addr1).registerNode("metadata2")
      ).to.be.revertedWith("Node already registered");
    });

    it("Should increment node count", async function () {
      const { aetherRegistry, addr1, addr2 } = await loadFixture(deployAetherRegistryFixture);
      
      await aetherRegistry.connect(addr1).registerNode("metadata1");
      expect(await aetherRegistry.nodeCount()).to.equal(1);
      
      await aetherRegistry.connect(addr2).registerNode("metadata2");
      expect(await aetherRegistry.nodeCount()).to.equal(2);
    });
  });

  describe("Node Management", function () {
    it("Should update node metadata", async function () {
      const { aetherRegistry, addr1 } = await loadFixture(deployAetherRegistryFixture);
      
      await aetherRegistry.connect(addr1).registerNode("metadata1");
      
      const newMetadata = "ipfs://QmUpdated456";
      await expect(aetherRegistry.connect(addr1).updateNodeMetadata(newMetadata))
        .to.emit(aetherRegistry, "NodeUpdated")
        .withArgs(addr1.address, newMetadata);
      
      const node = await aetherRegistry.getNode(addr1.address);
      expect(node.metadata).to.equal(newMetadata);
    });

    it("Should deactivate node", async function () {
      const { aetherRegistry, addr1 } = await loadFixture(deployAetherRegistryFixture);
      
      await aetherRegistry.connect(addr1).registerNode("metadata1");
      
      await expect(aetherRegistry.connect(addr1).deactivateNode())
        .to.emit(aetherRegistry, "NodeDeactivated")
        .withArgs(addr1.address);
      
      expect(await aetherRegistry.isNodeActive(addr1.address)).to.be.false;
    });
  });

  describe("Relationship Creation", function () {
    it("Should create relationship between nodes", async function () {
      const { aetherRegistry, addr1, addr2 } = await loadFixture(deployAetherRegistryFixture);
      
      await aetherRegistry.connect(addr1).registerNode("metadata1");
      await aetherRegistry.connect(addr2).registerNode("metadata2");
      
      const relationshipHash = ethers.keccak256(ethers.toUtf8Bytes("relationship"));
      const weight = 100;
      
      await expect(
        aetherRegistry.connect(addr1).createRelationship(addr2.address, weight, relationshipHash)
      ).to.emit(aetherRegistry, "RelationshipCreated");
    });

    it("Should reject relationship from inactive node", async function () {
      const { aetherRegistry, addr1, addr2 } = await loadFixture(deployAetherRegistryFixture);
      
      await aetherRegistry.connect(addr2).registerNode("metadata2");
      
      const relationshipHash = ethers.keccak256(ethers.toUtf8Bytes("relationship"));
      
      await expect(
        aetherRegistry.connect(addr1).createRelationship(addr2.address, 100, relationshipHash)
      ).to.be.revertedWith("Sender node not active");
    });

    it("Should reject self-relationship", async function () {
      const { aetherRegistry, addr1 } = await loadFixture(deployAetherRegistryFixture);
      
      await aetherRegistry.connect(addr1).registerNode("metadata1");
      
      const relationshipHash = ethers.keccak256(ethers.toUtf8Bytes("relationship"));
      
      await expect(
        aetherRegistry.connect(addr1).createRelationship(addr1.address, 100, relationshipHash)
      ).to.be.revertedWith("Cannot create self-relationship");
    });
  });

  describe("Access Control", function () {
    it("Should allow admin to update GraphStorage", async function () {
      const { aetherRegistry, owner } = await loadFixture(deployAetherRegistryFixture);
      
      const GraphStorage = await ethers.getContractFactory("GraphStorage");
      const newGraphStorage = await GraphStorage.deploy();
      await newGraphStorage.waitForDeployment();
      
      await aetherRegistry.connect(owner).updateGraphStorage(await newGraphStorage.getAddress());
      expect(await aetherRegistry.graphStorage()).to.equal(await newGraphStorage.getAddress());
    });
  });
});

