import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useGameContract } from '../hooks/useGameContract';
import { formatScore } from '../utils/formatAddress';

const GameHistory = ({ onBack }) => {
  const { address } = useAccount();
  const { usePlayerScores } = useGameContract();
  const { data: scoreHistory, isLoading: historyLoading, error: historyError } = usePlayerScores(address);
  
  const [gameHistory, setGameHistory] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    if (scoreHistory && Array.isArray(scoreHistory)) {
      // Convert score history to game history format
      // Since we only have scores, we'll estimate the details
      const history = scoreHistory.map((score, index) => {
        const numScore = Number(score);
        
        // Estimate difficulty based on score patterns
        // This is a rough estimation since we don't have difficulty data
        let estimatedMode = 'medium';
        let pointsPerObstacle = 20;
        let tokensPerObstacle = 20;
        
        // Try to guess difficulty based on common score patterns
        if (numScore > 0) {
          if (numScore % 10 === 0 && numScore < 100) {
            estimatedMode = 'easy';
            pointsPerObstacle = 10;
            tokensPerObstacle = 10;
          } else if (numScore % 40 === 0) {
            estimatedMode = 'hard';
            pointsPerObstacle = 40;
            tokensPerObstacle = 40;
          }
        }
        
        const obstaclesPassed = Math.floor(numScore / pointsPerObstacle);
        const tokensEarned = obstaclesPassed * tokensPerObstacle;
        
        return {
          id: `score-${index}`,
          mode: estimatedMode,
          score: numScore,
          obstaclesPassed,
          tokensEarned,
          timestamp: Date.now() - (index * 60000), // Estimate timestamps
          duration: null,
          source: 'contract-scores'
        };
      }).reverse(); // Show newest first
      
      setGameHistory(history);
    }
  }, [scoreHistory]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const formatDuration = (ms) => {
    if (!ms) return 'N/A';
    const seconds = Math.floor(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const filteredHistory = gameHistory.filter(game => 
    filter === 'all' || game.mode === filter
  );

  const sortedHistory = [...filteredHistory].sort((a, b) => {
    switch (sortBy) {
      case 'score':
        return b.score - a.score;
      case 'mode':
        return a.mode.localeCompare(b.mode);
      case 'date':
      default:
        return new Date(b.timestamp) - new Date(a.timestamp);
    }
  });

  const clearHistory = () => {
    // Game history comes from blockchain, cannot be cleared locally
    // This would require a contract function to reset history (if implemented)
    alert('Game history is stored on blockchain and cannot be cleared');
  };

  const getModeIcon = (mode) => {
    switch (mode) {
      case 'easy': return '🟢';
      case 'medium': return '🟡';
      case 'hard': return '🔴';
      default: return '⚪';
    }
  };

  const getModeColor = (mode) => {
    switch (mode) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-blue-200 to-blue-300 p-4 overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              📊 Game History
              <span className="text-sm bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-normal">
                Score History Only
              </span>
            </h1>
            <button
              onClick={onBack}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              ← Back to Home
            </button>
          </div>

          {/* Loading State */}
          {historyLoading && (
            <div className="text-center py-12">
              <div className="animate-spin inline-block h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
              <div className="mt-4 text-gray-600">Loading score history from blockchain...</div>
            </div>
          )}

          {/* Error State */}
          {historyError && !historyLoading && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="text-red-600 font-semibold">Failed to load score history</div>
              <div className="text-red-500 text-sm mt-1">{historyError.message}</div>
            </div>
          )}

          {/* No Connection State */}
          {!address && !historyLoading && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔗</div>
              <div className="text-gray-600 mb-2">Connect your wallet to view score history</div>
              <div className="text-sm text-gray-500">Your scores are stored on the blockchain</div>
            </div>
          )}

          {/* Info Message */}
          {!historyLoading && !historyError && address && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="text-blue-700 text-sm">
                📝 <strong>Note:</strong> This shows your score history from the blockchain. 
                Difficulty modes and exact timestamps are estimated based on score patterns.
              </div>
            </div>
          )}

          {/* Stats Summary */}
          {!historyLoading && !historyError && gameHistory.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">{gameHistory.length}</div>
                <div className="text-sm text-gray-600">Total Games</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Math.max(...gameHistory.map(g => g.tokensEarned))} PFT
                </div>
                <div className="text-sm text-gray-600">Best Tokens</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {gameHistory.reduce((sum, g) => sum + g.tokensEarned, 0)} PFT
                </div>
                <div className="text-sm text-gray-600">Total Tokens</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {gameHistory.reduce((sum, g) => sum + g.score, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Score</div>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-white border border-gray-300 rounded px-3 py-2"
              >
                <option value="all">All Modes</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-gray-300 rounded px-3 py-2"
              >
                <option value="date">Sort by Date</option>
                <option value="score">Sort by Score</option>
                <option value="mode">Sort by Mode</option>
              </select>
            </div>
            {gameHistory.length > 0 && (
              <button
                onClick={clearHistory}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-semibold transition-colors"
              >
                Clear History
              </button>
            )}
          </div>
        </div>

        {/* Game History List */}
        <div className="space-y-4">
          {!historyLoading && !historyError && address && sortedHistory.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="text-6xl mb-4">🎮</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Games Yet</h3>
              <p className="text-gray-500">Start playing to see your game history here!</p>
            </div>
          ) : (
            !historyLoading && !historyError && sortedHistory.map((game, index) => (
              <div key={game.id || index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getModeIcon(game.mode)}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${getModeColor(game.mode)}`}>
                          {game.mode}
                        </span>
                        <span className="text-lg font-bold text-green-600">{game.tokensEarned} PFT</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatTime(game.timestamp)} • {game.obstaclesPassed} obstacle{game.obstaclesPassed !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">
                      {new Date(game.timestamp).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(game.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="text-gray-600">
                    Points per obstacle: {game.mode === 'easy' ? 10 : game.mode === 'medium' ? 20 : 40}
                  </div>
                  <div className="text-gray-600">
                    Obstacles passed: {Math.floor(game.score / (game.mode === 'easy' ? 10 : game.mode === 'medium' ? 20 : 40))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Game Mode Info */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Game Modes</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🟢</span>
                <span className="font-semibold text-green-700">Easy Mode</span>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 10 points per obstacle</li>
                <li>• Larger gaps between pipes</li>
                <li>• Slower game speed</li>
                <li>• Lower gravity</li>
              </ul>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🟡</span>
                <span className="font-semibold text-yellow-700">Medium Mode</span>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 20 points per obstacle</li>
                <li>• Standard gaps</li>
                <li>• Normal game speed</li>
                <li>• Standard gravity</li>
              </ul>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🔴</span>
                <span className="font-semibold text-red-700">Hard Mode</span>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 40 points per obstacle</li>
                <li>• Smaller gaps between pipes</li>
                <li>• Faster game speed</li>
                <li>• Higher gravity</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameHistory;
