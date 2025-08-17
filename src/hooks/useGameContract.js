import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useState } from 'react';
import { CONTRACT_ADDRESSES } from '../utils/constants.js';
import { PUSHFLAP_GAME_ABI } from '../contracts-reference.js';

export const useGameContract = () => {
  const { writeContractAsync } = useWriteContract();
  const [isSubmitting, setIsSubmitting] = useState(false);


  // Get leaderboard for a specific difficulty (0=Easy, 1=Medium, 2=Hard)
  const useLeaderboard = (difficulty) => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.PUSHFLAP_GAME,
      abi: PUSHFLAP_GAME_ABI,
      functionName: 'getLeaderboard',
      args: [difficulty],
      query: {
        enabled: typeof difficulty === 'number',
      },
    });
  };

  // Get global leaderboard (total scores across all difficulties)
  const useGlobalLeaderboard = () => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.PUSHFLAP_GAME,
      abi: PUSHFLAP_GAME_ABI,
      functionName: 'getGlobalLeaderboard',
      query: {
        refetchInterval: 5000, // Auto-refresh every 5 seconds
      },
    });
  };

  // Get player score history
  const usePlayerScores = (address) => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.PUSHFLAP_GAME,
      abi: PUSHFLAP_GAME_ABI,
      functionName: 'getScoreHistory',
      args: address ? [address] : undefined,
      query: {
        enabled: !!address,
        refetchInterval: 5000, // Auto-refresh every 5 seconds
      },
    });
  };


  // Get player info (returns bestEasy, bestMedium, bestHard, totalScore, gamesPlayed)
  const usePlayerInfo = (address) => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.PUSHFLAP_GAME,
      abi: PUSHFLAP_GAME_ABI,
      functionName: 'getPlayerInfo',
      args: address ? [address] : undefined,
      query: {
        enabled: !!address,
        refetchInterval: 5000, // Auto-refresh every 5 seconds
        retry: 2, // Retry twice on failure
        retryDelay: 1000, // 1 second between retries
        onError: (error) => {
          console.error('getPlayerInfo error:', {
            error: error.message,
            contractAddress: CONTRACT_ADDRESSES.PUSHFLAP_GAME,
            address,
            cause: error.cause
          });
        },
        onSuccess: (data) => {
          console.log('getPlayerInfo success:', {
            data,
            contractAddress: CONTRACT_ADDRESSES.PUSHFLAP_GAME,
            playerAddress: address
          });
        },
      },
    });
  };


  // Submit score (V4 contract - difficulty, obstaclesPassed)
  // difficulty: 0=Easy, 1=Medium, 2=Hard
  const submitScore = async (difficulty, obstaclesPassed) => {
    try {
      setIsSubmitting(true);
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESSES.PUSHFLAP_GAME,
        abi: PUSHFLAP_GAME_ABI,
        functionName: 'submitScore',
        args: [difficulty, BigInt(obstaclesPassed)],
      });
      return hash;
    } catch (error) {
      console.error('Error submitting score:', error);
      // User-friendly error messages
      let userMessage = 'Failed to submit score';
      if (error.message) {
        if (error.message.includes('User denied') || error.message.includes('User rejected')) {
          userMessage = 'Transaction cancelled - You chose not to submit your score';
        } else if (error.message.includes('insufficient funds')) {
          userMessage = 'Insufficient gas funds - Please add some PUSH to your wallet';
        } else if (error.message.includes('gas required exceeds allowance')) {
          userMessage = 'Gas limit too low - Try increasing the gas limit';
        } else if (error.message.includes('network') || error.message.includes('connection')) {
          userMessage = 'Network connection issue - Please check your internet and try again';
        } else if (error.message.includes('nonce')) {
          userMessage = 'Transaction order issue - Please try again';
        } else if (error.message.includes('timeout')) {
          userMessage = 'Transaction timed out - Please try again';
        }
      }
      const friendlyError = new Error(userMessage);
      friendlyError.originalError = error;
      throw friendlyError;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    useLeaderboard,
    useGlobalLeaderboard,
    usePlayerScores,
    usePlayerInfo,
    submitScore,
    isSubmitting,
  };
};
