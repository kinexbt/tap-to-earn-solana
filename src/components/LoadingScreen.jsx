import { useState, useEffect } from 'react';

const LoadingScreen = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Loading PushFlap...');

  useEffect(() => {
    const loadingSteps = [
      { progress: 20, text: 'Connecting to Push Network...' },
      { progress: 40, text: 'Loading game assets...' },
      { progress: 60, text: 'Initializing smart contracts...' },
      { progress: 80, text: 'Preparing bird for flight...' },
      { progress: 100, text: 'Ready to flap!' },
    ];

    let currentStep = 0;

    const interval = setInterval(() => {
      if (currentStep < loadingSteps.length) {
        const step = loadingSteps[currentStep];
        setProgress(step.progress);
        setLoadingText(step.text);
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          onLoadingComplete();
        }, 500);
      }
    }, 600);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <div className="fixed inset-0 flappy-sky flex flex-col items-center justify-center">
      {/* Clouds Background */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 text-6xl animate-float-cloud opacity-80">☁️</div>
        <div className="absolute top-20 right-20 text-4xl animate-float-cloud opacity-60" style={{animationDelay: '2s'}}>☁️</div>
        <div className="absolute top-32 left-1/3 text-5xl animate-float-cloud opacity-70" style={{animationDelay: '4s'}}>☁️</div>
        <div className="absolute bottom-32 right-1/4 text-6xl animate-float-cloud opacity-50" style={{animationDelay: '6s'}}>☁️</div>
      </div>
      
      {/* Main Loading Content */}
      <div className="relative z-10 text-center">
        {/* Game Logo */}
        <div className="mb-12">
          <div className="text-8xl mb-4 animate-bounce-bird">🐦</div>
          <h1 className="flappy-title font-pixel mb-4">
            PushFlap
          </h1>
          <div className="text-lg font-pixel text-flappy-dark">
            Flappy Bird on Push Chain!
          </div>
        </div>

        {/* Loading Progress */}
        <div className="w-96 mx-auto mb-8">
          <div className="cloud-panel p-6">
            <div className="w-full h-3 bg-gray-300 rounded-full overflow-hidden mb-4">
              <div 
                className="h-full bg-gradient-to-r from-flappy-yellow to-flappy-orange transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="text-sm font-pixel text-flappy-dark mb-2">
              {loadingText}
            </div>
            <div className="text-xs font-pixel text-gray-600">
              {progress}% Complete
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="flex justify-center space-x-8 mt-8">
          <div className="text-4xl animate-bounce" style={{ animationDelay: '0s' }}>🎮</div>
          <div className="text-4xl animate-bounce" style={{ animationDelay: '0.2s' }}>🚀</div>
          <div className="text-4xl animate-bounce" style={{ animationDelay: '0.4s' }}>💎</div>
          <div className="text-4xl animate-bounce" style={{ animationDelay: '0.6s' }}>🏆</div>
        </div>
      </div>

      {/* Ground */}
      <div className="absolute bottom-0 w-full h-16 ground-pattern animate-grass-wave"></div>

      {/* Network Info */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center">
        <div className="cloud-panel px-6 py-3">
          <div className="text-xs font-pixel text-flappy-dark">
            Network: <span className="text-flappy-green font-bold">Push Testnet Donut</span>
          </div>
          <div className="text-xs font-pixel text-gray-600 mt-1">
            Chain ID: 42101 | Currency: PUSH
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
