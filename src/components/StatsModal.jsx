import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useTokenContract } from '../hooks/useTokenContract';
import { useGameContract } from '../hooks/useGameContract';
import { formatTokenAmount, formatScore } from '../utils/formatAddress';
import { GAME_CONFIG, CONTRACT_ADDRESSES } from '../utils/constants';
import { validateContracts } from '../utils/contractValidator';

const StatsModal = ({ isOpen, onClose }) => {
  const { address, isConnected } = useAccount();
  const { useTokenBalance } = useTokenContract();
  const { usePlayerInfo, usePlayerScores } = useGameContract();
  
  const { data: tokenBalance, isLoading: balanceLoading } = useTokenBalance(address);
  const { data: playerInfo, isLoading: playerInfoLoading, error: playerInfoError } = usePlayerInfo(address);
  const { data: playerScores, isLoading: scoresLoading } = usePlayerScores(address);

  const [contractStatus, setContractStatus] = useState(null);

  // Validate contracts on component mount
  useEffect(() => {
    const checkContracts = async () => {
      try {
        const status = await validateContracts();
        setContractStatus(status);
      } catch (error) {
        console.error('Contract validation failed:', error);
        setContractStatus({ error: error.message });
      }
    };
    checkContracts();
  }, []);

  // V4 Contract: getPlayerInfo returns [bestEasy, bestMedium, bestHard, totalScore, gamesPlayed]
  const bestEasy = playerInfo && playerInfo[0] !== undefined ? Number(playerInfo[0]) : 0;
  const bestMedium = playerInfo && playerInfo[1] !== undefined ? Number(playerInfo[1]) : 0;
  const bestHard = playerInfo && playerInfo[2] !== undefined ? Number(playerInfo[2]) : 0;
  const totalScore = playerInfo && playerInfo[3] !== undefined ? Number(playerInfo[3]) : 0;
  const gamesPlayed = playerInfo && playerInfo[4] !== undefined ? Number(playerInfo[4]) : 0;
  
  // Calculate overall best score across all difficulties
  const bestScore = Math.max(bestEasy, bestMedium, bestHard, 0);
  
  const scoreHistory = playerScores ? playerScores.map(score => Number(score)) : [];
  const totalGamesPlayed = gamesPlayed;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-t-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-pixel flex items-center gap-2">
              <span className="text-2xl">📊</span>
              Your Stats
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {!isConnected ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🔌</div>
              <h3 className="text-lg font-pixel text-gray-700 mb-2">Wallet Not Connected</h3>
              <p className="text-sm text-gray-600">Connect your wallet to view your stats</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Contract Status Display */}
              {contractStatus && (
                <div className="mb-4">
                  {!contractStatus.game?.deployed && (
                    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-3 py-2 rounded-lg text-xs font-pixel">
                      🔧 Game Contract Issue: {contractStatus.game?.error || 'Not deployed'}
                      <div className="mt-1">
                        Address: <code className="bg-yellow-200 px-1 rounded text-xs">{CONTRACT_ADDRESSES.PUSHFLAP_GAME}</code>
                      </div>
                    </div>
                  )}
                  {!contractStatus.token?.deployed && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-lg mt-2 text-xs font-pixel">
                      🔧 Token Contract Issue: {contractStatus.token?.error || 'Not deployed'}
                    </div>
                  )}
                </div>
              )}

              {/* Player Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Token Balance */}
                <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">💎</span>
                      <span className="font-pixel">PFT</span>
                    </div>
                    <div className="text-right">
                      {balanceLoading ? (
                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                      ) : (
                        <div className="font-pixel text-lg">
                          {formatTokenAmount(tokenBalance)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Best Score */}
                <div className="bg-gradient-to-br from-green-400 to-blue-500 rounded-lg p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">🏆</span>
                      <span className="font-pixel">Best</span>
                    </div>
                    <div className="text-right">
                      {playerInfoLoading ? (
                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                      ) : (
                        <div className="font-pixel text-lg">
                          {formatScore(bestScore)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Games Played */}
                <div className="bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">🎯</span>
                      <span className="font-pixel">Games</span>
                    </div>
                    <div className="text-right">
                      {scoresLoading ? (
                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                      ) : (
                        <div className="font-pixel text-lg">
                          {totalGamesPlayed}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Total Score */}
                <div className="bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">📈</span>
                      <span className="font-pixel">Total</span>
                    </div>
                    <div className="text-right">
                      {playerInfoLoading ? (
                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                      ) : (
                        <div className="font-pixel text-lg">
                          {formatScore(totalScore)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Difficulty Breakdown */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-pixel text-lg text-gray-800 mb-3">Best Scores by Difficulty</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <div className="text-sm font-pixel text-green-600">Easy</div>
                    <div className="font-pixel text-lg font-bold">{formatScore(bestEasy)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-pixel text-yellow-600">Medium</div>
                    <div className="font-pixel text-lg font-bold">{formatScore(bestMedium)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-pixel text-red-600">Hard</div>
                    <div className="font-pixel text-lg font-bold">{formatScore(bestHard)}</div>
                  </div>
                </div>
              </div>

              {/* Score History */}
              {scoreHistory.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-pixel text-lg text-gray-800 mb-3">Recent Games</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {scoreHistory.slice(-10).reverse().map((score, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-2 bg-white rounded text-sm font-pixel"
                      >
                        <span className="text-gray-600">Game #{scoreHistory.length - index}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-800 font-bold">{formatScore(score)}</span>
                          <span className="text-green-600 font-bold">+{score * GAME_CONFIG.TOKENS_PER_POINT} PFT</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {scoreHistory.length > 10 && (
                    <div className="text-xs text-gray-500 mt-2 text-center">
                      Showing last 10 games
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsModal;
