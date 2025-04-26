import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

interface WalletState {
  address: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  chainId: number | null;
  isConnected: boolean;
  isConnecting: boolean;
}

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    address: null,
    provider: null,
    signer: null,
    chainId: null,
    isConnected: false,
    isConnecting: false,
  });

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (typeof window.ethereum === 'undefined') return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.listAccounts();
      
      if (accounts.length > 0) {
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const network = await provider.getNetwork();
        
        setState({
          address,
          provider,
          signer,
          chainId: Number(network.chainId),
          isConnected: true,
          isConnecting: false,
        });
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  };

  const connect = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask');
      return;
    }

    setState(prev => ({ ...prev, isConnecting: true }));

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();

      setState({
        address,
        provider,
        signer,
        chainId: Number(network.chainId),
        isConnected: true,
        isConnecting: false,
      });
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setState(prev => ({ ...prev, isConnecting: false }));
    }
  };

  const disconnect = () => {
    setState({
      address: null,
      provider: null,
      signer: null,
      chainId: null,
      isConnected: false,
      isConnecting: false,
    });
  };

  return {
    ...state,
    connect,
    disconnect,
  };
}
