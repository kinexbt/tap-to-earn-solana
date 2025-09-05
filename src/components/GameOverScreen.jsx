import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useGameContract } from '../hooks/useGameContract';
import { formatScore } from '../utils/formatAddress';
import { GAME_CONFIG, GAME_MODES } from '../utils/constants';

const GameOverScreen = ({ score, gameMode, onRestart, onBackToHome }) => {
  const { address } = useAccount();
  const { submitScore, isSubmitting } = useGameContract();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Get the points per obstacle for the current game mode
  const currentModeConfig = GAME_MODES[gameMode.toUpperCase()];
  const pointsPerObstacle = currentModeConfig?.pointsPerObstacle || 20;
  
  // Calculate obstacles passed from score
  const obstaclesPassed = Math.floor(score / pointsPerObstacle);
  
  // V4 Contract: Tokens vary by difficulty 
  const getExpectedTokens = (mode, obstacles) => {
    const tokensPerObstacle = {
      'easy': 10,
      'medium': 20,  
      'hard': 40
    };
    return (tokensPerObstacle[mode.toLowerCase()] || 20) * obstacles;
  };
  
  const tokensEarned = getExpectedTokens(gameMode, obstaclesPassed);

  // Map game mode to difficulty number (0=Easy, 1=Medium, 2=Hard)
  const getDifficultyNumber = (mode) => {
    switch(mode.toLowerCase()) {
      case 'easy': return 0;
      case 'medium': return 1;
      case 'hard': return 2;
      default: return 1; // default to medium
    }
  };

  const handleSubmitScore = async () => {
    if (!address || isSubmitted) return;

    try {
      setSubmitError(null);
      const difficulty = getDifficultyNumber(gameMode);
      const hash = await submitScore(difficulty, obstaclesPassed);
      console.log('Score submitted with hash:', hash);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Failed to submit score:', error);
      
      // Show user-friendly error message
      const errorMessage = error.message || 'Failed to submit score. Please try again.';
      setSubmitError(errorMessage);
      
      // If it's a cancellation, add a helpful note
      if (errorMessage.includes('cancelled') || errorMessage.includes('Transaction cancelled')) {
        // Don't show error as red/alarming for cancellation
        setSubmitError("No worries! You can submit your score anytime by clicking the button again 😊");
      }
    }
  };

  const getScoreRating = (score) => {
    if (score === 0) return { text: 'Try Again!', emoji: '😅', color: 'text-gray-600' };
    if (score < 5) return { text: 'Getting Started!', emoji: '🐣', color: 'text-blue-600' };
    if (score < 10) return { text: 'Not Bad!', emoji: '😊', color: 'text-green-600' };
    if (score < 20) return { text: 'Great Job!', emoji: '🔥', color: 'text-orange-600' };
    if (score < 50) return { text: 'Amazing!', emoji: '🚀', color: 'text-purple-600' };
    return { text: 'LEGENDARY!', emoji: '👑', color: 'text-yellow-600' };
  };

  const rating = getScoreRating(score);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="cloud-panel p-8 max-w-md w-full mx-4 text-center">
        {/* Game Over Header */}
        <div className="mb-6">
          <div className="text-6xl mb-4 animate-bounce">💥</div>
          <h2 className="text-2xl font-pixel text-flappy-dark mb-4">Game Over!</h2>
          <div className={`text-lg font-pixel ${rating.color}`}>
            {rating.emoji} {rating.text}
          </div>
        </div>

        {/* Score Display */}
        <div className="mb-8">
          <div className="pipe-panel p-6 mb-4">
            <div className="text-sm font-pixel text-white/80 mb-2">PFT Tokens Earned</div>
            <div className="text-4xl font-pixel text-white mb-4">
              {tokensEarned} PFT
            </div>
            
            {score > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-pixel">
                  <span className="text-white/80">Difficulty:</span>
                  <span className="text-white font-bold capitalize">{gameMode}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-pixel">
                  <span className="text-white/80">Obstacles Passed:</span>
                  <span className="text-white font-bold">{obstaclesPassed}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-pixel">
                  <span className="text-white/80">Token Rate:</span>
                  <span className="text-white font-bold">
                    {gameMode === 'easy' && '10 PFT per obstacle'}
                    {gameMode === 'medium' && '20 PFT per obstacle'}
                    {gameMode === 'hard' && '40 PFT per obstacle'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Submit Score Section */}
          {score > 0 && address && (
            <div className="mb-6">
              {!isSubmitted ? (
                <div>
                  <button
                    onClick={handleSubmitScore}
                    disabled={isSubmitting}
                    className="flappy-btn w-full mb-3 font-pixel text-xs"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin h-4 w-4 border-2 border-flappy-dark border-t-transparent rounded-full"></div>
                        <span>SUBMITTING...</span>
                      </div>
                    ) : (
                      <>
                        📊 SUBMIT & CLAIM {tokensEarned} PFT
                      </>
                    )}
                  </button>
                  
                  {submitError && (
                    <div className={`text-xs font-pixel mb-3 p-3 rounded-lg ${
                      submitError.includes('No worries') || submitError.includes('cancelled') 
                        ? 'text-blue-600 bg-blue-100 border-2 border-blue-200' 
                        : 'text-red-600 bg-red-100 border-2 border-red-200'
                    }`}>
                      <div className="flex items-start space-x-2">
                        <span className="text-lg">
                          {submitError.includes('No worries') || submitError.includes('cancelled') ? '💭' : '⚠️'}
                        </span>
                        <div>
                          <div className="font-bold mb-1">
                            {submitError.includes('No worries') || submitError.includes('cancelled') 
                              ? 'Transaction Cancelled' 
                              : 'Submission Error'
                            }
                          </div>
                          <div>{submitError}</div>
                          {!submitError.includes('No worries') && !submitError.includes('cancelled') && (
                            <div className="mt-2 text-xs opacity-75">
                              💡 Tip: Make sure you have enough Sol for gas fees and a stable internet connection
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="text-xs font-pixel text-gray-600">
                    Submit to blockchain and earn PFT tokens!
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-green-600 text-sm font-pixel mb-2">
                    ✅ Score Submitted!
                  </div>
                  <div className="text-xs font-pixel text-gray-600 mb-3">
                    Your {tokensEarned} PFT tokens have been added to your wallet
                  </div>
                  <div className="pipe-panel p-3 bg-green-100">
                    <div className="text-xs font-pixel text-flappy-dark">
                      🎉 Congratulations! Check your wallet balance.
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {!address && score > 0 && (
            <div className="mb-6 p-4 bg-yellow-100 rounded-lg border-2 border-flappy-orange">
              <div className="text-flappy-orange text-xs font-pixel mb-1">
                ⚠️ Wallet Not Connected
              </div>
              <div className="text-xs font-pixel text-flappy-dark">
                Connect your wallet to submit scores and earn PFT tokens
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onRestart}
            className="flappy-btn w-full font-pixel text-sm"
          >
            🎮 PLAY AGAIN
          </button>
          
          <button
            onClick={onBackToHome}
            className="w-full px-6 py-3 rounded-lg bg-gray-300 hover:bg-gray-400 text-flappy-dark font-pixel text-sm transition-all duration-300 border-2 border-gray-500"
          >
            🏠 BACK TO HOME
          </button>
        </div>

        {/* Motivational Messages */}
        <div className="mt-6 pt-4 border-t border-gray-300">
          <div className="text-xs font-pixel text-gray-600">
            {score === 0 ? (
              "Don't give up! Every master was once a beginner. 🌟"
            ) : score < 10 ? (
              "You're getting the hang of it! Keep practicing! 💪"
            ) : score < 20 ? (
              "Impressive! You're becoming a AviaMaster! 🏆"
            ) : (
              "Incredible skills! You're dominating the leaderboard! 👑"
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameOverScreen;
