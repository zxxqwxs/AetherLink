const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("GraphStorage", function () {
  async function deployGraphStorageFixture() {
    const [owner, addr1, addr2, addr3] = await ethers.getSigners();
    const GraphStorage = await ethers.getContractFactory("GraphStorage");
    const graphStorage = await GraphStorage.deploy();
    return { graphStorage, owner, addr1, addr2, addr3 };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { graphStorage, owner } = await loadFixture(deployGraphStorageFixture);
      expect(await graphStorage.owner()).to.equal(owner.address);
    });

    it("Should initialize with zero edges", async function () {
      const { graphStorage } = await loadFixture(deployGraphStorageFixture);
      expect(await graphStorage.edgeCount()).to.equal(0);
    });
  });

  describe("Edge Creation", function () {
    it("Should create a new edge successfully", async function () {
      const { graphStorage, addr1, addr2 } = await loadFixture(deployGraphStorageFixture);
      
      const relationshipHash = ethers.keccak256(ethers.toUtf8Bytes("test-relationship"));
      const weight = 100;

      await expect(
        graphStorage.connect(addr1).createEdge(addr1.address, addr2.address, weight, relationshipHash)
      ).to.emit(graphStorage, "EdgeCreated");

      expect(await graphStorage.edgeCount()).to.equal(1);
    });

    it("Should reject edge with zero address", async function () {
      const { graphStorage, addr1 } = await loadFixture(deployGraphStorageFixture);
      
      const relationshipHash = ethers.keccak256(ethers.toUtf8Bytes("test"));
      
      await expect(
        graphStorage.connect(addr1).createEdge(ethers.ZeroAddress, addr1.address, 100, relationshipHash)
      ).to.be.revertedWith("Invalid node address");
    });

    it("Should reject self-loop", async function () {
      const { graphStorage, addr1 } = await loadFixture(deployGraphStorageFixture);
      
      const relationshipHash = ethers.keccak256(ethers.toUtf8Bytes("test"));
      
      await expect(
        graphStorage.connect(addr1).createEdge(addr1.address, addr1.address, 100, relationshipHash)
      ).to.be.revertedWith("Cannot create self-loop");
    });

    it("Should reject zero weight", async function () {
      const { graphStorage, addr1, addr2 } = await loadFixture(deployGraphStorageFixture);
      
      const relationshipHash = ethers.keccak256(ethers.toUtf8Bytes("test"));
      
      await expect(
        graphStorage.connect(addr1).createEdge(addr1.address, addr2.address, 0, relationshipHash)
      ).to.be.revertedWith("Weight must be positive");
    });
  });

  describe("Edge Updates", function () {
    it("Should update edge weight", async function () {
      const { graphStorage, addr1, addr2 } = await loadFixture(deployGraphStorageFixture);
      
      const relationshipHash = ethers.keccak256(ethers.toUtf8Bytes("test"));
      const tx = await graphStorage.connect(addr1).createEdge(addr1.address, addr2.address, 100, relationshipHash);
      const receipt = await tx.wait();
      
      const event = receipt.logs.find(log => log.fragment && log.fragment.name === "EdgeCreated");
      const edgeId = event.args[0];

      await expect(
        graphStorage.connect(addr1).updateEdgeWeight(edgeId, 200)
      ).to.emit(graphStorage, "EdgeUpdated");

      const edge = await graphStorage.getEdge(edgeId);
      expect(edge.weight).to.equal(200);
    });

    it("Should reject unauthorized weight update", async function () {
      const { graphStorage, addr1, addr2, addr3 } = await loadFixture(deployGraphStorageFixture);
      
      const relationshipHash = ethers.keccak256(ethers.toUtf8Bytes("test"));
      const tx = await graphStorage.connect(addr1).createEdge(addr1.address, addr2.address, 100, relationshipHash);
      const receipt = await tx.wait();
      
      const event = receipt.logs.find(log => log.fragment && log.fragment.name === "EdgeCreated");
      const edgeId = event.args[0];

      await expect(
        graphStorage.connect(addr3).updateEdgeWeight(edgeId, 200)
      ).to.be.revertedWith("Not authorized");
    });
  });

  describe("Edge Deactivation", function () {
    it("Should deactivate edge", async function () {
      const { graphStorage, addr1, addr2 } = await loadFixture(deployGraphStorageFixture);
      
      const relationshipHash = ethers.keccak256(ethers.toUtf8Bytes("test"));
      const tx = await graphStorage.connect(addr1).createEdge(addr1.address, addr2.address, 100, relationshipHash);
      const receipt = await tx.wait();
      
      const event = receipt.logs.find(log => log.fragment && log.fragment.name === "EdgeCreated");
      const edgeId = event.args[0];

      await expect(
        graphStorage.connect(addr1).deactivateEdge(edgeId)
      ).to.emit(graphStorage, "EdgeDeactivated");

      expect(await graphStorage.isEdgeActive(edgeId)).to.be.false;
    });
  });

  describe("Edge Queries", function () {
    it("Should return node edges", async function () {
      const { graphStorage, addr1, addr2, addr3 } = await loadFixture(deployGraphStorageFixture);
      
      const hash1 = ethers.keccak256(ethers.toUtf8Bytes("test1"));
      const hash2 = ethers.keccak256(ethers.toUtf8Bytes("test2"));
      
      await graphStorage.connect(addr1).createEdge(addr1.address, addr2.address, 100, hash1);
      await graphStorage.connect(addr1).createEdge(addr1.address, addr3.address, 150, hash2);

      const edges = await graphStorage.getNodeEdges(addr1.address);
      expect(edges.length).to.equal(2);
    });
  });
});

