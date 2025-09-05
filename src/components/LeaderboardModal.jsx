import Leaderboard from './Leaderboard';

const LeaderboardModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-500 to-blue-600 text-white p-4 rounded-t-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-pixel flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              Global Leaderboard
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
          <Leaderboard />
        </div>
      </div>
    </div>
  );
};

export default LeaderboardModal;
