import { ethers } from 'ethers';

export class Web3Service {
  private provider: ethers.BrowserProvider | null = null;

  async getProvider(): Promise<ethers.BrowserProvider> {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('No ethereum provider found');
    }

    if (!this.provider) {
      this.provider = new ethers.BrowserProvider(window.ethereum);
    }

    return this.provider;
  }

  async getSigner(): Promise<ethers.Signer> {
    const provider = await this.getProvider();
    return provider.getSigner();
  }

  async getNetwork(): Promise<ethers.Network> {
    const provider = await this.getProvider();
    return provider.getNetwork();
  }

  async getBalance(address: string): Promise<bigint> {
    const provider = await this.getProvider();
    return provider.getBalance(address);
  }

  async switchNetwork(chainId: number): Promise<void> {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('No ethereum provider found');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (error: any) {
      if (error.code === 4902) {
        throw new Error('Network not configured in wallet');
      }
      throw error;
    }
  }

  formatEther(wei: bigint): string {
    return ethers.formatEther(wei);
  }

  parseEther(ether: string): bigint {
    return ethers.parseEther(ether);
  }

  isAddress(address: string): boolean {
    return ethers.isAddress(address);
  }
}

export const web3 = new Web3Service();
