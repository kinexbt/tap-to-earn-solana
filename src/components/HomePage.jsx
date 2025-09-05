import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import StatsModal from './StatsModal';
import LeaderboardModal from './LeaderboardModal';
import HowToPlayModal from './HowToPlayModal';

const HomePage = ({ onStartGame, onShowHistory }) => {
  const { address, isConnected } = useAccount();
  
  // Modal states
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isLeaderboardModalOpen, setIsLeaderboardModalOpen] = useState(false);
  const [isHowToPlayModalOpen, setIsHowToPlayModalOpen] = useState(false);

  // Modal handlers
  const openStatsModal = () => setIsStatsModalOpen(true);
  const closeStatsModal = () => setIsStatsModalOpen(false);
  
  const openLeaderboardModal = () => setIsLeaderboardModalOpen(true);
  const closeLeaderboardModal = () => setIsLeaderboardModalOpen(false);
  
  const openHowToPlayModal = () => setIsHowToPlayModalOpen(true);
  const closeHowToPlayModal = () => setIsHowToPlayModalOpen(false);

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

          {/* Navigation Icons */}
          <div className="flex items-center space-x-2">
            {/* Stats Icon */}
            <button
              onClick={openStatsModal}
              className="p-3 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-all duration-300 group"
              title="Your Stats"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">📊</span>
            </button>

            {/* Leaderboard Icon */}
            <button
              onClick={openLeaderboardModal}
              className="p-3 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-all duration-300 group"
              title="Global Leaderboard"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">🏆</span>
            </button>

            {/* How to Play Icon */}
            <button
              onClick={openHowToPlayModal}
              className="p-3 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-all duration-300 group"
              title="How to Play"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">❓</span>
            </button>

            {/* Wallet Connection */}
            <div className="ml-4">
              <ConnectButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 pb-6 relative z-10 flex items-center justify-center min-h-[60vh]">
        {/* Welcome Card - Centered */}
        <div className="cloud-panel p-8 text-center max-w-md w-full">
          <div className="text-8xl mb-6 animate-bounce-bird">🐦</div>
          <h2 className="text-2xl font-pixel text-flappy-dark mb-4">
            Welcome to Avia Masters!
          </h2>
          <p className="text-base font-pixel text-gray-600 mb-8 leading-relaxed">
            The classic Tap to Earn game with Avia tokens!<br/>
            Flap your way to victory and earn rewards!
          </p>
          
          {isConnected ? (
            <div className="space-y-4">
              <button
                onClick={onStartGame}
                className="flappy-btn font-pixel w-full text-lg py-4"
              >
                🎮 START GAME
              </button>
              <button
                onClick={onShowHistory}
                className="w-full px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-pixel rounded-lg transition-all duration-300"
              >
                📊 GAME HISTORY
              </button>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-base font-pixel text-flappy-orange mb-4">
                Connect wallet to play!
              </p>
              <div className="text-sm font-pixel text-gray-600">
                You need Push Testnet Donut network
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <StatsModal 
        isOpen={isStatsModalOpen} 
        onClose={closeStatsModal} 
      />
      
      <LeaderboardModal 
        isOpen={isLeaderboardModalOpen} 
        onClose={closeLeaderboardModal} 
      />
      
      <HowToPlayModal 
        isOpen={isHowToPlayModalOpen} 
        onClose={closeHowToPlayModal} 
      />

      {/* Ground */}
      <div className="absolute bottom-0 w-full h-16 ground-pattern animate-grass-wave"></div>
    </div>
  );
};

export default HomePage;
