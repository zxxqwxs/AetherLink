import { useEffect, useState } from 'react';
import { ethers, Contract } from 'ethers';
import { useWallet } from './useWallet';

export function useContract<T extends Contract>(
  address: string,
  abi: any[]
): T | null {
  const { signer, provider } = useWallet();
  const [contract, setContract] = useState<T | null>(null);

  useEffect(() => {
    if (!address || !abi) {
      setContract(null);
      return;
    }

    try {
      const signerOrProvider = signer || provider;
      if (signerOrProvider) {
        const instance = new ethers.Contract(
          address,
          abi,
          signerOrProvider
        ) as T;
        setContract(instance);
      } else {
        setContract(null);
      }
    } catch (error) {
      console.error('Error creating contract instance:', error);
      setContract(null);
    }
  }, [address, abi, signer, provider]);

  return contract;
}
