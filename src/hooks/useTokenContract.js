import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_ADDRESSES } from '../utils/constants.js';
import { PUSHFLAP_TOKEN_ABI } from '../contracts-reference.js';

export const useTokenContract = () => {
  const { writeContractAsync } = useWriteContract();

  // Read token balance
  const useTokenBalance = (address) => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.PUSHFLAP_TOKEN,
      abi: PUSHFLAP_TOKEN_ABI,
      functionName: 'balanceOf',
      args: address ? [address] : undefined,
      query: {
        enabled: !!address,
      },
    });
  };

  // Read token info
  const useTokenInfo = () => {
    const name = useReadContract({
      address: CONTRACT_ADDRESSES.PUSHFLAP_TOKEN,
      abi: PUSHFLAP_TOKEN_ABI,
      functionName: 'name',
    });

    const symbol = useReadContract({
      address: CONTRACT_ADDRESSES.PUSHFLAP_TOKEN,
      abi: PUSHFLAP_TOKEN_ABI,
      functionName: 'symbol',
    });

    const decimals = useReadContract({
      address: CONTRACT_ADDRESSES.PUSHFLAP_TOKEN,
      abi: PUSHFLAP_TOKEN_ABI,
      functionName: 'decimals',
    });

    return { name, symbol, decimals };
  };

  // Transfer tokens
  const transferTokens = async (to, amount) => {
    return await writeContractAsync({
      address: CONTRACT_ADDRESSES.PUSHFLAP_TOKEN,
      abi: PUSHFLAP_TOKEN_ABI,
      functionName: 'transfer',
      args: [to, amount],
    });
  };

  return {
    useTokenBalance,
    useTokenInfo,
    transferTokens,
  };
};
