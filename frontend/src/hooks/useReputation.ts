import { useState, useEffect } from 'react';
import { useContract } from './useContract';
import { REPUTATION_MANAGER_ABI } from '@/utils/contracts';

export function useReputation(address: string | null) {
  const [reputation, setReputation] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const contract = useContract(
    process.env.NEXT_PUBLIC_REPUTATION_MANAGER_ADDRESS || '',
    REPUTATION_MANAGER_ABI
  );

  useEffect(() => {
    if (!address || !contract) {
      setReputation(0);
      return;
    }

    const fetchReputation = async () => {
      setIsLoading(true);
      try {
        const score = await contract.getReputation(address);
        setReputation(Number(score));
      } catch (error) {
        console.error('Error fetching reputation:', error);
        setReputation(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReputation();
  }, [address, contract]);

  return { reputation, isLoading };
}
