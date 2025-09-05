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
      case 'easy': return '�';
      case 'medium': return '🤔';
      case 'hard': return '�';
      default: return '⚪';
    }
  };

  const getModeColor = (modeId) => {
    switch (modeId) {
      case 'easy': return 'from-green-400 to-green-600';
      case 'medium': return 'from-yellow-400 to-orange-500';
      case 'hard': return 'from-red-500 to-red-700';
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
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {Object.entries(GAME_MODES).map(([modeKey, mode]) => (
            <div
              key={mode.id}
              onClick={() => handleModeSelect(mode.id)}
              className={`bg-gradient-to-br ${getModeColor(mode.id)} p-6 rounded-xl shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
            >
              <div className="text-center text-white">
                <div className="text-6xl mb-4">{getModeIcon(mode.id)}</div>
                <h3 className="text-2xl font-bold mb-2 uppercase">{mode.name} Mode</h3>
                <p className="text-lg mb-4">{mode.pointsPerObstacle} points per obstacle</p>
                
                <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-4">
                  <div className="text-sm space-y-1">
                    <div>Gap Size: {mode.pipeGap}px</div>
                    <div>Speed: {mode.pipeSpeed}x</div>
                    <div>Gravity: {mode.gravity}</div>
                  </div>
                </div>

                <button className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300">
                  🎮 Click to Play
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameModeSelector;
