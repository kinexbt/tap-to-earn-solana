import { useState } from 'react';
import { GAME_MODES } from '../utils/constants';

const GameModeSelector = ({ onSelectMode, onBack }) => {
  const handleModeSelect = (modeId) => {
    // Directly start the game with the selected mode
    onSelectMode(modeId, true);
  };

  const getModeIcon = (modeId) => {
    const modeData = Object.values(GAME_MODES).find(mode => mode.id === modeId);
    if (modeData) return modeData.emoji;
    
    switch (modeId) {
      case 'fun': return '😊';
      case 'web3': return '🚀';
      default: return '⚪';
    }
  };

  const getModeColor = (modeId) => {
    switch (modeId) {
      case 'fun': return 'from-green-400 to-green-600';
      case 'web3': return 'from-purple-500 to-purple-700';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-blue-200 to-blue-300 p-4 overflow-y-auto">
      <div className="max-w-4xl mx-auto relative z-10 w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={onBack}
            className="absolute left-0 top-0 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            ← Back
          </button>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Choose Game Mode</h1>
          <p className="text-gray-600">Select your difficulty level and start playing!</p>
        </div>

        {/* Game Mode Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {Object.entries(GAME_MODES).map(([modeKey, mode]) => (
            <div
              key={mode.id}
              onClick={() => handleModeSelect(mode.id)}
              className={`bg-gradient-to-br ${getModeColor(mode.id)} p-8 rounded-xl shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
            >
              <div className="text-center text-white">
                <div className="text-8xl mb-6">{getModeIcon(mode.id)}</div>
                <h3 className="text-3xl font-bold mb-4">{mode.name}</h3>
                <p className="text-lg mb-6 opacity-90">{mode.description}</p>
                <p className="text-xl mb-6 font-semibold">{mode.pointsPerObstacle} points per obstacle</p>
                
                <div className="bg-white bg-opacity-20 rounded-lg p-6 mb-6">
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span>Gap Size:</span>
                      <span className="font-bold">{mode.pipeGap}px</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Speed:</span>
                      <span className="font-bold">{mode.pipeSpeed}x</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Gravity:</span>
                      <span className="font-bold">{mode.gravity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tokens per Point:</span>
                      <span className="font-bold">{mode.tokensPerObstacle}</span>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 text-lg">
                  🎮 Click to Play
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Game Rules */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Game Rules</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">How to Play:</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• Click or press SPACE to make the plane jump</li>
                <li>• Avoid hitting the pipes or ground</li>
                <li>• Pass through pipe gaps to score points</li>
                <li>• Try to beat your high score!</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Mode Differences:</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• <strong>Fun Mode:</strong> Relaxed gameplay, perfect for beginners</li>
                <li>• <strong>Web3 Mode:</strong> High rewards, intense challenge</li>
                <li>• Higher difficulty = more tokens per point!</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameModeSelector;