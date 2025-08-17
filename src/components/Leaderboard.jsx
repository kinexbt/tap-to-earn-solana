import { useGameContract } from '../hooks/useGameContract';
import { formatAddress, formatScore } from '../utils/formatAddress';

const Leaderboard = () => {
  const { useGlobalLeaderboard } = useGameContract();
  const { data: leaderboardData, isLoading, error } = useGlobalLeaderboard();

  if (isLoading) {
    return (
      <div className="pipe-panel p-6">
        <h3 className="text-xl font-pixel text-white text-center mb-4">🏆 Global Leaderboard</h3>
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2 text-sm font-pixel text-white/80">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pipe-panel p-6">
        <h3 className="text-xl font-pixel text-white text-center mb-4">🏆 Global Leaderboard</h3>
        <div className="text-center text-red-300">
          <p className="font-pixel text-sm">Failed to load leaderboard</p>
          <p className="text-xs font-pixel text-white/60 mt-1">Please try again later</p>
        </div>
      </div>
    );
  }

  const [addresses, scores] = leaderboardData || [[], []];
  
  // Combine and sort the leaderboard data
  const leaderboard = addresses.map((address, index) => ({
    address,
    score: scores[index] ? Number(scores[index]) : 0,
    rank: index + 1,
  })).slice(0, 10); // Top 10 only

  return (
    <div className="pipe-panel p-6">
      <h3 className="text-xl font-pixel text-white text-center mb-6">🏆 Global Leaderboard</h3>
      
      {leaderboard.length === 0 ? (
        <div className="text-center text-white/80">
          <div className="text-4xl mb-4">🐦</div>
          <p className="font-pixel text-sm">No scores yet!</p>
          <p className="text-xs font-pixel text-white/60 mt-2">Be the first to set a high score! 🚀</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leaderboard.map((player, index) => (
            <div
              key={player.address}
              className={`flex items-center justify-between p-4 rounded-lg transition-all duration-300 hover:bg-white/20 ${
                index < 3 ? 'bg-flappy-yellow/20 border-2 border-flappy-yellow' : 'bg-white/10'
              }`}
            >
              {/* Rank and Trophy */}
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-pixel text-sm ${
                  index === 0 ? 'bg-flappy-yellow text-flappy-dark' :
                  index === 1 ? 'bg-gray-300 text-flappy-dark' :
                  index === 2 ? 'bg-orange-400 text-white' :
                  'bg-gray-500 text-white'
                }`}>
                  {index < 3 ? (
                    index === 0 ? '🥇' :
                    index === 1 ? '🥈' : '🥉'
                  ) : (
                    player.rank
                  )}
                </div>
                
                {/* Player Address */}
                <div>
                  <div className="font-pixel text-sm text-white">
                    {formatAddress(player.address)}
                  </div>
                  {index < 3 && (
                    <div className="text-xs font-pixel text-flappy-yellow">
                      {index === 0 ? 'Flappy Champion' : index === 1 ? 'Silver Flapper' : 'Bronze Bird'}
                    </div>
                  )}
                </div>
              </div>

              {/* Score */}
              <div className="text-right">
                <div className={`font-pixel ${
                  index === 0 ? 'text-flappy-yellow text-lg' :
                  index === 1 ? 'text-gray-300 text-lg' :
                  index === 2 ? 'text-orange-400 text-lg' :
                  'text-white'
                }`}>
                  {formatScore(player.score)}
                </div>
                <div className="text-xs font-pixel text-white/60">
                  {player.score * 10} PFT earned
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-white/20">
        <div className="text-center text-xs font-pixel text-white/80">
          <p className="mb-1">🎮 Play to earn PFT tokens!</p>
          <p className="mb-1">Each point = 10 PFT tokens</p>
          <p className="text-green-400">🔄 Updates every 5 seconds</p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
