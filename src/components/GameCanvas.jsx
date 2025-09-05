import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GAME_SETTINGS, getSettingsForDifficulty } from '../config/gameSettings.js';

const GameCanvas = ({ 
  gameMode = 'medium', 
  onGameEnd, 
  gameStarted, 
  setGameStarted,
  score,
  setScore 
}) => {
  const canvasRef = useRef(null);
  const gameStateRef = useRef({
    bird: { 
      x: GAME_SETTINGS.BIRD.START_X, 
      y: GAME_SETTINGS.BIRD.START_Y, 
      velocity: 0 
    },
    pipes: [],
    coins: [],
    gameRunning: false,
    score: 0,
    lastPipeTime: 0,
    animationId: null,
    coinRotation: 0
  });

  // Get current game mode configuration
  const currentModeConfig = getSettingsForDifficulty(gameMode);

  const initializeGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Ensure canvas has dimensions
    if (canvas.width === 0 || canvas.height === 0) {
      canvas.width = 1000;
      canvas.height = 700;
    }

    gameStateRef.current = {
      bird: { x: 50, y: canvas.height / 2, velocity: 0 },
      pipes: [],
      coins: [],
      gameRunning: false,
      score: 0,
      lastPipeTime: 0,
      animationId: null,
      coinRotation: 0
    };
    setScore(0);
  }, [setScore]);

  const startGame = useCallback(() => {
    gameStateRef.current.gameRunning = true;
    setGameStarted(true);
  }, [setGameStarted]);

  const endGame = useCallback(() => {
    const gameState = gameStateRef.current;
    gameState.gameRunning = false;
    
    if (gameState.animationId) {
      cancelAnimationFrame(gameState.animationId);
    }
    
    // Save game to history
    const gameResult = {
      score: gameState.score,
      mode: gameMode,
      timestamp: new Date().toISOString(),
      duration: Date.now() - gameState.startTime
    };
    
    // Game history is now stored on blockchain via contract
    // No need to save to localStorage anymore
    
    setGameStarted(false);
    onGameEnd(gameState.score);
  }, [gameMode, onGameEnd, setGameStarted]);

    const handleJump = useCallback(() => {
      if (gameStateRef.current.gameRunning) {
        gameStateRef.current.bird.velocity = currentModeConfig.jumpForce;
      }
    }, [currentModeConfig.jumpForce]);

    const jump = useCallback(() => {
      if (gameStarted) {
        handleJump();
      } else {
        // Start the game if not started
        startGame();
      }
    }, [gameStarted, handleJump, startGame]);

  const updateGame = useCallback(() => {
    const gameState = gameStateRef.current;
    const canvas = canvasRef.current;
    if (!canvas || !gameState.gameRunning) return;

    // Ensure canvas has proper dimensions
    if (canvas.width === 0 || canvas.height === 0) {
      canvas.width = 800;
      canvas.height = 600;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const { bird, pipes, coins } = gameState;

    // Update coin rotation for animation
    gameState.coinRotation += 0.1;

    // Update bird
    bird.velocity += currentModeConfig.gravity;
    bird.y += bird.velocity;

    // Add new pipes and coins
    const currentTime = Date.now();
    if (currentTime - gameState.lastPipeTime > currentModeConfig.pipeSpacing / currentModeConfig.pipeSpeed) {
      const pipeHeight = Math.random() * (canvas.height - currentModeConfig.pipeGap - 100) + 50;
      pipes.push({
        x: canvas.width,
        topHeight: pipeHeight,
        bottomY: pipeHeight + currentModeConfig.pipeGap,
        passed: false
      });
      
      // Add a coin in the gap between pipes
      coins.push({
        x: canvas.width + 30, // Center of pipe
        y: pipeHeight + (currentModeConfig.pipeGap / 2), // Center of gap
        collected: false,
        rotation: 0
      });
      
      gameState.lastPipeTime = currentTime;
    }

    // Update pipes and check for scoring
    for (let i = pipes.length - 1; i >= 0; i--) {
      const pipe = pipes[i];
      pipe.x -= currentModeConfig.pipeSpeed;

      // Check if bird passed pipe (for scoring) - pipes are now 60px wide
      if (!pipe.passed && pipe.x + currentModeConfig.pipeWidth < bird.x) {
        pipe.passed = true;
        gameState.score += currentModeConfig.pointsPerObstacle;
        setScore(gameState.score);
      }

      // Remove pipes that are off screen
      if (pipe.x + currentModeConfig.pipeWidth < 0) {
        pipes.splice(i, 1);
      }
    }

    // Update coins and check for collection
    for (let i = coins.length - 1; i >= 0; i--) {
      const coin = coins[i];
      coin.x -= currentModeConfig.pipeSpeed;
      coin.rotation += 0.15; // Individual coin rotation

      // Check coin collection (coin is 20px diameter)
      if (!coin.collected) {
        const coinCenterX = coin.x;
        const coinCenterY = coin.y;
        const birdCenterX = bird.x + 20;
        const birdCenterY = bird.y + 20;
        
        const distance = Math.sqrt(
          Math.pow(coinCenterX - birdCenterX, 2) + 
          Math.pow(coinCenterY - birdCenterY, 2)
        );
        
        if (distance < 25) { // Collection radius
          coin.collected = true;
          gameState.score += 5; // Bonus points for collecting coins
          setScore(gameState.score);
        }
      }

      // Remove coins that are off screen
      if (coin.x < -20) {
        coins.splice(i, 1);
      }
    }

    // Check collisions (accounting for ground height of 50px)
    if (bird.y <= 0 || bird.y >= canvas.height - 80) {
      endGame();
      return;
    }

    // Check pipe collisions (using configured pipe width)
    for (const pipe of pipes) {
      if (bird.x + currentModeConfig.birdSize > pipe.x && bird.x < pipe.x + currentModeConfig.pipeWidth) {
        if (bird.y < pipe.topHeight || bird.y + currentModeConfig.birdSize > pipe.bottomY) {
          endGame();
          return;
        }
      }
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background with clouds
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(0.7, '#98D8E8');
    gradient.addColorStop(1, '#B0E0E6');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw ground
    ctx.fillStyle = '#228B22';
    ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
    
    // Draw grass texture
    ctx.fillStyle = '#32CD32';
    for (let i = 0; i < canvas.width; i += 20) {
      ctx.fillRect(i, canvas.height - 50, 10, 10);
    }

    // Draw realistic plane
    const planeSize = currentModeConfig.birdSize;
    const planeX = bird.x + planeSize/2;
    const planeY = bird.y + planeSize/2;
    
    // Calculate plane angle based on velocity for realistic banking
    const angle = Math.min(Math.max(bird.velocity * 0.1, -0.3), 0.3);
    
    ctx.save();
    ctx.translate(planeX, planeY);
    ctx.rotate(angle);
    
    // Main fuselage (aircraft body)
    const fuselageGradient = ctx.createLinearGradient(-planeSize, 0, planeSize, 0);
    fuselageGradient.addColorStop(0, '#E8E8E8');
    fuselageGradient.addColorStop(0.3, '#F5F5F5');
    fuselageGradient.addColorStop(0.7, '#E0E0E0');
    fuselageGradient.addColorStop(1, '#D0D0D0');
    
    ctx.fillStyle = fuselageGradient;
    ctx.beginPath();
    ctx.ellipse(0, 0, planeSize * 0.8, planeSize * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Fuselage outline
    ctx.strokeStyle = '#B0B0B0';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Main wings (top view)
    const wingGradient = ctx.createLinearGradient(-planeSize * 1.2, 0, planeSize * 1.2, 0);
    wingGradient.addColorStop(0, '#C0C0C0');
    wingGradient.addColorStop(0.5, '#E0E0E0');
    wingGradient.addColorStop(1, '#C0C0C0');
    
    ctx.fillStyle = wingGradient;
    ctx.beginPath();
    ctx.ellipse(0, 0, planeSize * 1.2, planeSize * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Wing outline
    ctx.strokeStyle = '#A0A0A0';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Wing details (flaps, ailerons)
    ctx.fillStyle = '#D0D0D0';
    ctx.fillRect(-planeSize * 0.8, -planeSize * 0.2, planeSize * 0.3, planeSize * 0.1);
    ctx.fillRect(planeSize * 0.5, -planeSize * 0.2, planeSize * 0.3, planeSize * 0.1);
    
    // Tail section
    ctx.fillStyle = fuselageGradient;
    ctx.beginPath();
    ctx.ellipse(-planeSize * 0.6, 0, planeSize * 0.2, planeSize * 0.15, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Vertical stabilizer (tail fin)
    ctx.fillStyle = '#D0D0D0';
    ctx.beginPath();
    ctx.moveTo(-planeSize * 0.7, -planeSize * 0.1);
    ctx.lineTo(-planeSize * 0.8, -planeSize * 0.3);
    ctx.lineTo(-planeSize * 0.6, -planeSize * 0.3);
    ctx.closePath();
    ctx.fill();
    
    // Horizontal stabilizers
    ctx.fillStyle = '#D0D0D0';
    ctx.fillRect(-planeSize * 0.8, -planeSize * 0.05, planeSize * 0.4, planeSize * 0.05);
    ctx.fillRect(-planeSize * 0.8, planeSize * 0.0, planeSize * 0.4, planeSize * 0.05);
    
    // Nose cone
    const noseGradient = ctx.createRadialGradient(planeSize * 0.3, 0, 0, planeSize * 0.3, 0, planeSize * 0.2);
    noseGradient.addColorStop(0, '#F0F0F0');
    noseGradient.addColorStop(1, '#E0E0E0');
    
    ctx.fillStyle = noseGradient;
    ctx.beginPath();
    ctx.ellipse(planeSize * 0.3, 0, planeSize * 0.2, planeSize * 0.15, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Cockpit windows
    ctx.fillStyle = '#87CEEB';
    ctx.beginPath();
    ctx.ellipse(planeSize * 0.1, -planeSize * 0.1, planeSize * 0.08, planeSize * 0.06, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Cockpit window frame
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Engine nacelles (small engines on wings)
    ctx.fillStyle = '#B0B0B0';
    ctx.beginPath();
    ctx.ellipse(-planeSize * 0.3, -planeSize * 0.15, planeSize * 0.1, planeSize * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(-planeSize * 0.3, planeSize * 0.15, planeSize * 0.1, planeSize * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Engine intakes
    ctx.fillStyle = '#404040';
    ctx.beginPath();
    ctx.ellipse(-planeSize * 0.3, -planeSize * 0.15, planeSize * 0.05, planeSize * 0.04, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(-planeSize * 0.3, planeSize * 0.15, planeSize * 0.05, planeSize * 0.04, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Propeller (if it's a prop plane) - spinning effect
    const propAngle = Date.now() * 0.02; // Fast spinning
    ctx.save();
    ctx.rotate(propAngle);
    
    // Propeller blades
    ctx.fillStyle = '#8B4513';
    for (let i = 0; i < 3; i++) {
      ctx.save();
      ctx.rotate((i * Math.PI * 2) / 3);
      ctx.fillRect(planeSize * 0.35, -planeSize * 0.02, planeSize * 0.15, planeSize * 0.04);
      ctx.restore();
    }
    
    // Propeller hub
    ctx.fillStyle = '#654321';
    ctx.beginPath();
    ctx.arc(planeSize * 0.35, 0, planeSize * 0.03, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore(); // End propeller rotation
    
    // Landing gear (wheels) - only show when plane is low
    if (bird.y > canvas.height - 150) {
      ctx.fillStyle = '#666';
      ctx.beginPath();
      ctx.arc(-planeSize * 0.2, planeSize * 0.2, planeSize * 0.08, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(planeSize * 0.1, planeSize * 0.2, planeSize * 0.08, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Wing lights (navigation lights)
    ctx.fillStyle = bird.velocity > 0 ? '#FF0000' : '#00FF00'; // Red when climbing, green when descending
    ctx.beginPath();
    ctx.arc(-planeSize * 0.8, -planeSize * 0.1, planeSize * 0.03, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#0000FF'; // Blue light
    ctx.beginPath();
    ctx.arc(-planeSize * 0.8, planeSize * 0.1, planeSize * 0.03, 0, Math.PI * 2);
    ctx.fill();
    
    // Exhaust trails (when moving fast)
    if (Math.abs(bird.velocity) > 2) {
      const trailOpacity = Math.min(Math.abs(bird.velocity) / 5, 0.6);
      ctx.strokeStyle = `rgba(100, 100, 100, ${trailOpacity})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-planeSize * 0.3, -planeSize * 0.15);
      ctx.lineTo(-planeSize * 0.5, -planeSize * 0.15);
      ctx.moveTo(-planeSize * 0.3, planeSize * 0.15);
      ctx.lineTo(-planeSize * 0.5, planeSize * 0.15);
      ctx.stroke();
      
      // Additional exhaust particles
      for (let i = 0; i < 3; i++) {
        const particleX = -planeSize * 0.4 - (i * planeSize * 0.1);
        const particleY = -planeSize * 0.15 + (Math.random() - 0.5) * planeSize * 0.1;
        ctx.fillStyle = `rgba(150, 150, 150, ${trailOpacity * 0.5})`;
        ctx.beginPath();
        ctx.arc(particleX, particleY, planeSize * 0.02, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Wing tip vortices (when banking)
    if (Math.abs(angle) > 0.1) {
      ctx.strokeStyle = `rgba(200, 200, 255, 0.3)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(planeSize * 0.8, -planeSize * 0.2);
      ctx.quadraticCurveTo(planeSize * 1.0, -planeSize * 0.3, planeSize * 1.1, -planeSize * 0.4);
      ctx.moveTo(planeSize * 0.8, planeSize * 0.2);
      ctx.quadraticCurveTo(planeSize * 1.0, planeSize * 0.3, planeSize * 1.1, planeSize * 0.4);
      ctx.stroke();
    }
    
    ctx.restore(); // End plane rotation


    // Draw pipes with better design
    for (const pipe of pipes) {
      // Pipe gradient
      const pipeGradient = ctx.createLinearGradient(pipe.x, 0, pipe.x + 60, 0);
      pipeGradient.addColorStop(0, '#228B22');
      pipeGradient.addColorStop(0.3, '#32CD32');
      pipeGradient.addColorStop(0.7, '#228B22');
      pipeGradient.addColorStop(1, '#006400');
      
      // Top pipe
      ctx.fillStyle = pipeGradient;
      ctx.fillRect(pipe.x, 0, currentModeConfig.pipeWidth, pipe.topHeight);
      
      // Top pipe cap
      ctx.fillStyle = '#006400';
      ctx.fillRect(pipe.x - 5, pipe.topHeight - 30, currentModeConfig.pipeWidth + 10, 30);
      
      // Bottom pipe
      ctx.fillStyle = pipeGradient;
      ctx.fillRect(pipe.x, pipe.bottomY, currentModeConfig.pipeWidth, canvas.height - pipe.bottomY - 50);
      
      // Bottom pipe cap
      ctx.fillStyle = '#006400';
      ctx.fillRect(pipe.x - 5, pipe.bottomY, currentModeConfig.pipeWidth + 10, 30);
      
      // Pipe highlights
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.fillRect(pipe.x + 5, 0, 8, pipe.topHeight);
      ctx.fillRect(pipe.x + 5, pipe.bottomY, 8, canvas.height - pipe.bottomY - 50);
    }

    // Draw coins (sparkling shiny animated coins)
    for (const coin of coins) {
      if (!coin.collected) {
        ctx.save();
        ctx.translate(coin.x, coin.y);
        
        // Outer glow effect (pulsating)
        const glowIntensity = 0.5 + 0.3 * Math.sin(gameState.coinRotation * 3);
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 15 * glowIntensity;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        // Coin shadow
        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        ctx.beginPath();
        ctx.ellipse(2, 3, 12, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.rotate(coin.rotation);
        
        // Outer rim with metallic shine
        const rimGradient = ctx.createLinearGradient(-15, -15, 15, 15);
        rimGradient.addColorStop(0, '#FFFF80');
        rimGradient.addColorStop(0.3, '#FFD700');
        rimGradient.addColorStop(0.7, '#FFA500');
        rimGradient.addColorStop(1, '#FF8C00');
        ctx.fillStyle = rimGradient;
        ctx.beginPath();
        ctx.arc(0, 0, 14, 0, Math.PI * 2);
        ctx.fill();
        
        // Main coin body with radial gradient
        const coinGradient = ctx.createRadialGradient(-3, -3, 0, 0, 0, 12);
        coinGradient.addColorStop(0, '#FFFFFF');
        coinGradient.addColorStop(0.2, '#FFFF99');
        coinGradient.addColorStop(0.5, '#FFD700');
        coinGradient.addColorStop(0.8, '#FFA500');
        coinGradient.addColorStop(1, '#B8860B');
        ctx.fillStyle = coinGradient;
        ctx.beginPath();
        ctx.arc(0, 0, 12, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner highlight circle
        const highlightGradient = ctx.createRadialGradient(-2, -2, 0, 0, 0, 8);
        highlightGradient.addColorStop(0, 'rgba(255,255,255,0.9)');
        highlightGradient.addColorStop(0.4, 'rgba(255,255,255,0.5)');
        highlightGradient.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = highlightGradient;
        ctx.beginPath();
        ctx.arc(-1, -1, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Rotating sparkles around the coin
        for (let i = 0; i < 6; i++) {
          const sparkleAngle = (coin.rotation * 2) + (i * Math.PI / 3);
          const sparkleRadius = 18 + 3 * Math.sin(gameState.coinRotation * 4 + i);
          const sparkleX = Math.cos(sparkleAngle) * sparkleRadius;
          const sparkleY = Math.sin(sparkleAngle) * sparkleRadius;
          
          ctx.fillStyle = `rgba(255, 255, 255, ${0.7 + 0.3 * Math.sin(gameState.coinRotation * 5 + i)})`;
          ctx.beginPath();
          ctx.save();
          ctx.translate(sparkleX, sparkleY);
          ctx.rotate(sparkleAngle);
          
          // Star-shaped sparkle
          ctx.moveTo(0, -3);
          ctx.lineTo(1, -1);
          ctx.lineTo(3, 0);
          ctx.lineTo(1, 1);
          ctx.lineTo(0, 3);
          ctx.lineTo(-1, 1);
          ctx.lineTo(-3, 0);
          ctx.lineTo(-1, -1);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
        
        // Center symbol with glow
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = 8;
        ctx.fillStyle = '#B8860B';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('★', 0, 1);
        
        // Bright center highlight
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#FFFF00';
        ctx.font = 'bold 12px Arial';
        ctx.fillText('★', 0, 0);
        
        // Animated shine sweep effect
        const shinePosition = (gameState.coinRotation * 2) % (Math.PI * 2);
        if (shinePosition < Math.PI) {
          const shineGradient = ctx.createLinearGradient(-15, -15, 15, 15);
          shineGradient.addColorStop(0, 'rgba(255,255,255,0)');
          shineGradient.addColorStop(0.4, 'rgba(255,255,255,0)');
          shineGradient.addColorStop(0.5, 'rgba(255,255,255,0.8)');
          shineGradient.addColorStop(0.6, 'rgba(255,255,255,0)');
          shineGradient.addColorStop(1, 'rgba(255,255,255,0)');
          
          ctx.save();
          ctx.rotate(shinePosition - Math.PI/4);
          ctx.fillStyle = shineGradient;
          ctx.fillRect(-20, -2, 40, 4);
          ctx.restore();
        }
        
        ctx.restore();
      }
    }

    gameState.animationId = requestAnimationFrame(updateGame);
  }, [currentModeConfig, setScore, endGame]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [jump]);

  // Handle canvas click
  const handleCanvasClick = () => {
    jump();
  };

  // Initialize game when component mounts or gameMode changes
  useEffect(() => {
    initializeGame();
  }, [initializeGame, gameMode]);

  // Start game loop when game starts
  useEffect(() => {
    if (gameStarted && !gameStateRef.current.animationId) {
      // Auto-start the game when gameStarted is true
      if (!gameStateRef.current.gameRunning) {
        gameStateRef.current.gameRunning = true;
        gameStateRef.current.startTime = Date.now();
        // Give the bird a slight upward velocity to avoid immediate fall
        gameStateRef.current.bird.velocity = currentModeConfig.jumpForce / 2;
      }
      updateGame();
    }
  }, [gameStarted, updateGame, currentModeConfig.jumpForce]);

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gradient-to-b from-blue-200 to-blue-300 p-4">
      <div className="mb-6 flex items-center gap-8 bg-white rounded-xl p-4 shadow-lg">
        <div className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <span className="text-2xl">🎮</span>
          Mode: <span className="capitalize text-blue-600">{gameMode}</span>
        </div>
        <div className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <span className="text-2xl">🏆</span>
          Score: <span className="text-green-600">{score}</span>
        </div>
        <div className="text-lg text-gray-600">
          Points per pipe: <span className="font-semibold text-purple-600">{currentModeConfig.pointsPerObstacle}</span>
        </div>
      </div>
      
      <canvas
        ref={canvasRef}
        width={1000}
        height={700}
        onClick={handleCanvasClick}
        className="border-4 border-green-600 rounded-xl cursor-pointer shadow-2xl"
        style={{ display: 'block', background: 'linear-gradient(to bottom, #87CEEB, #98D8E8)' }}
      />
      
      <div className="mt-6 text-center bg-white rounded-xl p-4 shadow-lg max-w-2xl">
        <p className="text-gray-800 mb-2 text-lg font-semibold">
          {!gameStarted ? '🎯 Click or press SPACE to start!' : '🚀 Click or press SPACE to jump!'}
        </p>
        <p className="text-blue-600 mb-3 font-medium">
          ✨ Collect spinning coins for +5 bonus points! ✨
        </p>
        <div className="text-sm text-gray-600 grid grid-cols-3 gap-4 mt-4">
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="font-semibold text-green-700">Easy Mode</p>
            <p>Larger gaps • Slower speed • Gentle gravity</p>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg">
            <p className="font-semibold text-yellow-700">Medium Mode</p>
            <p>Standard gaps • Normal speed • Regular gravity</p>
          </div>
          <div className="bg-red-50 p-3 rounded-lg">
            <p className="font-semibold text-red-700">Hard Mode</p>
            <p>Small gaps • Fast speed • Strong gravity</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameCanvas;
