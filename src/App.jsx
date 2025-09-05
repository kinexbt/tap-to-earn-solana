import { useState, useEffect } from 'react';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@rainbow-me/rainbowkit/styles.css';

import { config } from './wagmi';
import LoadingScreen from './components/LoadingScreen';
import HomePage from './components/HomePage';
import GameCanvas from './components/GameCanvas';
import GameOverScreen from './components/GameOverScreen';
import GameModeSelector from './components/GameModeSelector';
import GameHistory from './components/GameHistory';

const queryClient = new QueryClient();

// Game states
const GAME_STATES = {
  LOADING: 'loading',
  HOME: 'home',
  MODE_SELECT: 'mode_select',
  PLAYING: 'playing',
  GAME_OVER: 'game_over',
  HISTORY: 'history',
};

function App() {
  const [gameState, setGameState] = useState(GAME_STATES.LOADING);
  const [currentScore, setCurrentScore] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [selectedGameMode, setSelectedGameMode] = useState('medium');

  // Handle loading completion
  const handleLoadingComplete = () => {
    setGameState(GAME_STATES.HOME);
  };

  // Start game mode selection
  const handleStartGame = () => {
    setGameState(GAME_STATES.MODE_SELECT);
  };

  // Handle mode selection
  const handleModeSelect = (mode, startGame = false) => {
    setSelectedGameMode(mode);
    if (startGame) {
      setCurrentScore(0);
      setGameState(GAME_STATES.PLAYING);
      setIsGameActive(true);
    }
  };

  // Show game history
  const handleShowHistory = () => {
    setGameState(GAME_STATES.HISTORY);
  };

  // Handle game over
  const handleGameOver = (finalScore) => {
    setCurrentScore(finalScore);
    setIsGameActive(false);
    setGameState(GAME_STATES.GAME_OVER);
  };

  // Restart the game
  const handleRestartGame = () => {
    setCurrentScore(0);
    setGameState(GAME_STATES.PLAYING);
    setIsGameActive(true);
  };

  // Go back to home
  const handleBackToHome = () => {
    setCurrentScore(0);
    setIsGameActive(false);
    setGameState(GAME_STATES.HOME);
  };

  // Go back to mode selection
  const handleBackToModeSelect = () => {
    setGameState(GAME_STATES.MODE_SELECT);
  };

  // Handle score updates during gameplay
  const handleScoreUpdate = (score) => {
    setCurrentScore(score);
  };

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <div className="min-h-screen flappy-sky font-pixel">
            {/* Loading Screen */}
            {gameState === GAME_STATES.LOADING && (
              <LoadingScreen onLoadingComplete={handleLoadingComplete} />
            )}

            {/* Home Page */}
            {gameState === GAME_STATES.HOME && (
              <HomePage 
                onStartGame={handleStartGame} 
                onShowHistory={handleShowHistory}
              />
            )}

            {/* Game Mode Selection */}
            {gameState === GAME_STATES.MODE_SELECT && (
              <GameModeSelector
                onSelectMode={handleModeSelect}
                onBack={handleBackToHome}
                selectedMode={selectedGameMode}
              />
            )}

            {/* Game History */}
            {gameState === GAME_STATES.HISTORY && (
              <GameHistory onBack={handleBackToHome} />
            )}

            {/* Game Screen */}
            {gameState === GAME_STATES.PLAYING && (
              <div className="h-screen flex flex-col">
                {/* Game Header */}
                <div className="flex justify-between items-center p-4 pipe-panel">
                  <div className="flex items-center space-x-4">
                    <div className="text-lg animate-bounce-bird">✈️</div>
                    <h1 className="text-lg font-pixel text-white">Avia Masters</h1>
                  </div>
                  <button
                    onClick={handleBackToModeSelect}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white font-pixel text-xs transition-all duration-300 mr-2"
                  >
                    🎮 MODE
                  </button>
                  <button
                    onClick={handleBackToHome}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white font-pixel text-xs transition-all duration-300"
                  >
                    🏠 HOME
                  </button>
                </div>

                {/* Game Canvas */}
                <div className="flex-1 p-4">
                  <GameCanvas
                    gameMode={selectedGameMode}
                    onGameEnd={handleGameOver}
                    gameStarted={isGameActive}
                    setGameStarted={setIsGameActive}
                    score={currentScore}
                    setScore={setCurrentScore}
                  />
                </div>
              </div>
            )}

            {/* Game Over Screen */}
            {gameState === GAME_STATES.GAME_OVER && (
              <>
                {/* Background Game Canvas (frozen) */}
                <div className="h-screen flex flex-col">
                  <div className="flex justify-between items-center p-4 pipe-panel">
                    <div className="flex items-center space-x-4">
                      <div className="text-lg">✈️</div>
                      <h1 className="text-lg font-pixel text-white">Avia Masters</h1>
                    </div>
                    <button
                      onClick={handleBackToModeSelect}
                      className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white font-pixel text-xs transition-all duration-300 mr-2"
                    >
                      🎮 MODE
                    </button>
                    <button
                      onClick={handleBackToHome}
                      className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white font-pixel text-xs transition-all duration-300"
                    >
                      🏠 HOME
                    </button>
                  </div>
                  <div className="flex-1 p-4">
                    <GameCanvas
                      gameMode={selectedGameMode}
                      onGameEnd={handleGameOver}
                      gameStarted={false}
                      setGameStarted={() => {}}
                      score={currentScore}
                      setScore={() => {}}
                    />
                  </div>
                </div>

                {/* Game Over Modal */}
                <GameOverScreen
                  score={currentScore}
                  gameMode={selectedGameMode}
                  onRestart={handleRestartGame}
                  onBackToHome={handleBackToHome}
                />
              </>
            )}
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
