import { GAME_CONFIG } from '../utils/constants';

const HowToPlayModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-600 text-white p-4 rounded-t-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-pixel flex items-center gap-2">
              <span className="text-2xl">🎮</span>
              How to Play
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
        <div className="p-6 space-y-6">
          {/* Basic Instructions */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6">
            <h3 className="text-lg font-pixel text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-xl">🎯</span>
              Basic Controls
            </h3>
            <div className="space-y-3 text-sm font-pixel text-gray-700">
              <div className="flex items-start space-x-3">
                <span className="text-blue-600 font-bold text-lg">1.</span>
                <span>Click anywhere on the game screen or press <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">SPACE</kbd> to make the bird flap</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-blue-600 font-bold text-lg">2.</span>
                <span>Keep the bird flying by timing your flaps to avoid hitting pipes or the ground</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-blue-600 font-bold text-lg">3.</span>
                <span>Pass through pipes to score points and collect spinning coins for bonus points</span>
              </div>
            </div>
          </div>

          {/* Difficulty Modes */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6">
            <h3 className="text-lg font-pixel text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-xl">⚙️</span>
              Difficulty Modes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">😊</span>
                  <h4 className="font-pixel font-bold text-green-700">Easy Mode</h4>
                </div>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Larger pipe gaps (350px)</li>
                  <li>• Slower pipe speed (2.5x)</li>
                  <li>• Gentle gravity (0.15)</li>
                  <li>• 10 points per pipe</li>
                  <li>• Perfect for beginners</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg p-4 border-l-4 border-yellow-500">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">😐</span>
                  <h4 className="font-pixel font-bold text-yellow-700">Medium Mode</h4>
                </div>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Standard pipe gaps (300px)</li>
                  <li>• Normal pipe speed (3.0x)</li>
                  <li>• Regular gravity (0.25)</li>
                  <li>• 20 points per pipe</li>
                  <li>• Balanced challenge</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg p-4 border-l-4 border-red-500">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">😤</span>
                  <h4 className="font-pixel font-bold text-red-700">Hard Mode</h4>
                </div>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Small pipe gaps (280px)</li>
                  <li>• Fast pipe speed (3.5x)</li>
                  <li>• Strong gravity (0.35)</li>
                  <li>• 40 points per pipe</li>
                  <li>• Expert level only</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Scoring System */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-6">
            <h3 className="text-lg font-pixel text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-xl">💰</span>
              Scoring & Rewards
            </h3>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-pixel font-bold text-gray-800 mb-2">Point System</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Passing through pipes:</span>
                    <span className="font-pixel font-bold text-green-600">+10/20/40 points</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Collecting coins:</span>
                    <span className="font-pixel font-bold text-yellow-600">+5 bonus points</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-pixel font-bold text-gray-800 mb-2">Token Rewards</h4>
                <div className="text-sm text-gray-600">
                  <p>Earn <span className="font-bold text-purple-600">{GAME_CONFIG.TOKENS_PER_POINT} PFT tokens</span> for every point you score!</p>
                  <p className="mt-1">Higher difficulty modes give more tokens per point, making them more rewarding for skilled players.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tips & Strategies */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6">
            <h3 className="text-lg font-pixel text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-xl">💡</span>
              Pro Tips
            </h3>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-start space-x-3">
                <span className="text-purple-600 font-bold">💫</span>
                <span>Try to collect coins in pipe gaps for bonus points - they're worth 5 extra points each!</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-purple-600 font-bold">🎯</span>
                <span>Start with Easy mode to get familiar with the controls, then work your way up</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-purple-600 font-bold">⚡</span>
                <span>Don't flap too frequently - let gravity do some work and time your flaps carefully</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-purple-600 font-bold">🏆</span>
                <span>Higher difficulty modes give more tokens per point, so master them for better rewards</span>
              </div>
            </div>
          </div>

          {/* Network Requirements */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-pixel text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-xl">🔗</span>
              Blockchain Requirements
            </h3>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-start space-x-3">
                <span className="text-blue-600 font-bold">🌐</span>
                <span>Connect your wallet to the <strong>Push Testnet Donut</strong> network (Chain ID: 42101)</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-blue-600 font-bold">💧</span>
                <span>Get PUSH testnet tokens from the faucet: <a href="https://faucet.push.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">faucet.push.org</a></span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-blue-600 font-bold">⚡</span>
                <span>All game data and rewards are stored on the blockchain for transparency</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToPlayModal;
