import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useTokenContract } from '../hooks/useTokenContract';
import { useGameContract } from '../hooks/useGameContract';
import { formatTokenAmount, formatScore } from '../utils/formatAddress';
import { GAME_CONFIG, CONTRACT_ADDRESSES } from '../utils/constants';
import { validateContracts } from '../utils/contractValidator';
import Leaderboard from './Leaderboard';

const HomePage = ({ onStartGame, onShowHistory }) => {
  const { address, isConnected } = useAccount();
  const { useTokenBalance } = useTokenContract();
  const { usePlayerInfo, usePlayerScores } = useGameContract();
  
  const { data: tokenBalance, isLoading: balanceLoading } = useTokenBalance(address);
  const { data: playerInfo, isLoading: playerInfoLoading, error: playerInfoError } = usePlayerInfo(address);
  const { data: playerScores, isLoading: scoresLoading } = usePlayerScores(address);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [contractStatus, setContractStatus] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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
  const bestScore = Math.max(bestEasy, bestMedium, bestHard, 0); // Always at least 0
  
  const scoreHistory = playerScores ? playerScores.map(score => Number(score)) : [];
  const totalGamesPlayed = gamesPlayed;

  // Debug logging
  console.log('Player Info Debug:', {
    playerInfo,
    playerInfoError,
    playerInfoLoading,
    tokenBalance,
    balanceLoading,
    bestEasy,
    bestMedium, 
    bestHard,
    totalScore,
    gamesPlayed,
    bestScore,
    address
  });

  return (
    <div className="min-h-screen w-full flappy-sky relative overflow-y-auto">
      {/* Clouds Background */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 text-6xl animate-float-cloud opacity-60">☁️</div>
        <div className="absolute top-20 right-20 text-4xl animate-float-cloud opacity-40" style={{animationDelay: '2s'}}>☁️</div>
        <div className="absolute top-32 left-1/3 text-5xl animate-float-cloud opacity-50" style={{animationDelay: '4s'}}>☁️</div>
        <div className="absolute bottom-32 right-1/4 text-6xl animate-float-cloud opacity-30" style={{animationDelay: '6s'}}>☁️</div>
        <div className="absolute top-1/2 left-1/4 text-4xl animate-float-cloud opacity-40" style={{animationDelay: '8s'}}>☁️</div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="text-4xl animate-bounce-bird">🐦</div>
            <div>
              <h1 className="text-3xl font-pixel flappy-title">
                Avia Masters
              </h1>
              <div className="cloud-panel px-2 py-1 inline-block mt-1">
                <span className="text-xs font-pixel text-flappy-dark">Testnet</span>
              </div>
            </div>
          </div>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-4">
            <ConnectButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pb-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Game Info & Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Welcome Card */}
            <div className="cloud-panel p-6 text-center">
              <div className="text-6xl mb-4 animate-bounce-bird">🐦</div>
              <h2 className="text-lg font-pixel text-flappy-dark mb-4">
                Welcome to Avia Masters!
              </h2>
              <p className="text-sm font-pixel text-gray-600 mb-6 leading-relaxed">
                The classic Tap to Earn game with Avia tokens!
              </p>
              
              {isConnected ? (
                <div className="space-y-4">
                  <button
                    onClick={onStartGame}
                    className="flappy-btn font-pixel w-full"
                  >
                    🎮 START GAME
                  </button>
                  <button
                    onClick={onShowHistory}
                    className="w-full px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white font-pixel rounded-lg transition-all duration-300"
                  >
                    📊 GAME HISTORY
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm font-pixel text-flappy-orange mb-4">
                    Connect wallet to play!
                  </p>
                  <div className="text-xs font-pixel text-gray-600">
                    You need Push Testnet Donut network
                  </div>
                </div>
              )}
            </div>

            {/* Player Stats */}
            {isConnected && (
              <div className="pipe-panel p-6">
                <h3 className="text-lg font-pixel text-white mb-4">📊 Your Stats</h3>
                
                {playerInfoError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-lg mb-4 text-xs font-pixel">
                    ⚠️ Stats unavailable: {playerInfoError.message}
                    {playerInfoError.message.includes('could not decode result') && (
                      <div className="mt-1 text-xs">
                        Contract may be using different ABI or not deployed.
                      </div>
                    )}
                  </div>
                )}

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
                
                <div className="space-y-3">
                  {/* Token Balance */}
                  <div className="bg-white/20 rounded-lg p-3 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">💎</span>
                      <span className="text-sm font-pixel text-white">PFT</span>
                    </div>
                    <div className="text-right">
                      {balanceLoading ? (
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      ) : (
                        <div className="text-sm font-pixel text-white">
                          {formatTokenAmount(tokenBalance)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Best Score */}
                  <div className="bg-white/20 rounded-lg p-3 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">🏆</span>
                      <span className="text-sm font-pixel text-white">Best</span>
                    </div>
                    <div className="text-right">
                      {playerInfoLoading ? (
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      ) : (
                        <div className="text-sm font-pixel text-white">
                          {formatScore(bestScore)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Games Played */}
                  <div className="bg-white/20 rounded-lg p-3 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">🎯</span>
                      <span className="text-sm font-pixel text-white">Games</span>
                    </div>
                    <div className="text-right">
                      {scoresLoading ? (
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      ) : (
                        <div className="text-sm font-pixel text-white">
                          {totalGamesPlayed}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Total Score */}
                  <div className="bg-white/20 rounded-lg p-3 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">📈</span>
                      <span className="text-sm font-pixel text-white">Total</span>
                    </div>
                    <div className="text-right">
                      {playerInfoLoading ? (
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      ) : (
                        <div className="text-sm font-pixel text-white">
                          {formatScore(totalScore)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Score History */}
            {isConnected && scoreHistory.length > 0 && (
              <div className="cloud-panel p-6">
                <h3 className="text-lg font-pixel text-flappy-dark mb-4">📈 Score History</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {scoreHistory.slice(-10).reverse().map((score, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-2 bg-gray-100 rounded text-xs font-pixel"
                    >
                      <span className="text-flappy-dark">Game #{scoreHistory.length - index}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-flappy-dark">{formatScore(score)}</span>
                        <span className="text-flappy-green font-bold">+{score * GAME_CONFIG.TOKENS_PER_POINT} PFT</span>
                      </div>
                    </div>
                  ))}
                </div>
                {scoreHistory.length > 10 && (
                  <div className="text-xs font-pixel text-gray-600 mt-2 text-center">
                    Showing last 10 games
                  </div>
                )}
              </div>
            )}

            {/* Game Rules */}
            <div className="pipe-panel p-6">
              <h3 className="text-lg font-pixel text-white mb-4">🎮 How to Play</h3>
              <div className="space-y-3 text-xs font-pixel text-white leading-relaxed">
                <div className="flex items-start space-x-3">
                  <span className="text-flappy-yellow">1.</span>
                  <span>Click or press SPACE to flap</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-flappy-yellow">2.</span>
                  <span>Avoid hitting pipes or ground</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-flappy-yellow">3.</span>
                  <span>Choose difficulty: Easy (10 pts), Medium (20 pts), Hard (40 pts)</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-flappy-yellow">💰</span>
                  <span>Earn {GAME_CONFIG.TOKENS_PER_POINT} PFT per point!</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Columns - Leaderboard */}
          <div className="lg:col-span-2">
            <Leaderboard />
          </div>
        </div>
      </main>

      {/* Ground */}
      <div className="absolute bottom-0 w-full h-16 ground-pattern animate-grass-wave"></div>
    </div>
  );
};

export default HomePage;
