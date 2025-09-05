// PushFlap Game Settings Configuration
// Modify these values to adjust gameplay mechanics

export const GAME_SETTINGS = {
  // === VISUAL SETTINGS ===
  CANVAS: {
    WIDTH: 800,
    HEIGHT: 600,
    BACKGROUND_COLOR: '#87CEEB', // Sky blue
  },

  // === BIRD SETTINGS ===
  BIRD: {
    SIZE: 15,        // Smaller bird (was 30)
    START_X: 100,
    START_Y: 300,
    COLOR: '#FFD700', // Gold
  },

  // === PHYSICS SETTINGS ===
  PHYSICS: {
    // Gravity affects how fast plane falls (higher = falls faster)
    GRAVITY: {
      FUN: 0.15,     // Fun mode - gentle gravity (was EASY)
      WEB3: 0.35,    // Web3 mode - strong gravity (was HARD)
    },
    // Jump force (negative = upward, higher absolute = stronger jump)
    JUMP_FORCE: {
      FUN: -6,       // Fun mode - gentle jump (was EASY)
      WEB3: -8,      // Web3 mode - strong jump (was HARD)
    },
    // Maximum fall speed (prevents infinite acceleration)
    MAX_FALL_SPEED: 8,
    // Terminal velocity multiplier
    VELOCITY_DAMPING: 0.98,
  },

  // === PIPE SETTINGS ===
  PIPES: {
    // Pipe visual properties
    WIDTH: 60,
    COLOR: '#228B22', // Forest green
    
    // Gap between top and bottom pipes (IMPORTANT: Controls difficulty)
    GAP_SIZE: {
      FUN: 350,     // Fun mode - much wider gap (was EASY)
      WEB3: 280,    // Web3 mode - narrow gap (was HARD)
    },
    
    // Horizontal spacing between pipes (FIXES THE "TOO CLOSE" ISSUE)
    SPACING: {
      FUN: 3800,    // Fun mode - much more space between pipes (was EASY)
      WEB3: 3100,   // Web3 mode - closer pipes (was HARD)
    },
    
    // Pipe movement speed (higher = pipes move faster)
    SPEED: {
      FUN: 2.5,     // Fun mode - slower speed (was EASY)
      WEB3: 3.5,    // Web3 mode - faster speed (was HARD)
    },
    
    // Pipe generation settings
    MIN_HEIGHT: 50,      // Minimum pipe height
    MAX_HEIGHT: 400,     // Maximum pipe height
    SPAWN_DISTANCE: 500, // Distance from right edge to spawn new pipes
  },

  // === COIN SETTINGS ===
  COINS: {
    SIZE: 7.5,
    COLOR: '#FFD700',
    SPAWN_CHANCE: 0.7, // 70% chance to spawn coin in pipe gap
    ANIMATION_SPEED: 0.1,
    SPARKLE_COUNT: 5,
    COLLECTION_RADIUS: 2500, // How close bird needs to be to collect
  },

  // === SCORING SETTINGS ===
  SCORING: {
    POINTS_PER_OBSTACLE: {
      FUN: 10,      // Fun mode - lower points (was EASY)
      WEB3: 40,     // Web3 mode - higher points (was HARD)
    },
    TOKENS_PER_OBSTACLE: {
      FUN: 10,      // Fun mode - lower tokens (was EASY)
      WEB3: 40,     // Web3 mode - higher tokens (was HARD)
    },
  },

  // === GAME FLOW SETTINGS ===
  GAMEPLAY: {
    // Game loop timing
    FRAME_RATE: 60, // Target FPS
    UPDATE_INTERVAL: 16, // ~60fps (1000ms / 60fps)
    
    // Collision detection
    COLLISION_BUFFER: 2, // Pixels of forgiveness for collisions
    
    // Game start delay
    COUNTDOWN_DURATION: 3, // Seconds
    
    // Performance settings
    MAX_PIPES_ON_SCREEN: 4,
    GARBAGE_COLLECTION_THRESHOLD: 10, // Remove off-screen pipes
  },

  // === VISUAL EFFECTS ===
  EFFECTS: {
    // Particle effects
    PARTICLES: {
      COLLISION_COUNT: 15,
      COIN_COLLECTION_COUNT: 8,
      LIFETIME: 1000, // milliseconds
    },
    
    // Screen shake
    SCREEN_SHAKE: {
      INTENSITY: 5,
      DURATION: 200, // milliseconds
    },
    
    // Animations
    ANIMATIONS: {
      BIRD_FLAP_SPEED: 0.2,
      COIN_ROTATION_SPEED: 0.05,
      PIPE_SWAY: false, // Set true for moving pipes
    },
  },

  // === DIFFICULTY PROGRESSION ===
  PROGRESSION: {
    // Increase difficulty over time
    ENABLE_DYNAMIC_DIFFICULTY: false,
    SPEED_INCREASE_INTERVAL: 30, // seconds
    SPEED_INCREASE_AMOUNT: 0.1,
    MAX_SPEED_MULTIPLIER: 2.0,
  },

  // === DEBUG SETTINGS ===
  DEBUG: {
    SHOW_HITBOXES: false,
    SHOW_FPS: false,
    SHOW_COORDINATES: false,
    LOG_COLLISIONS: false,
    INVINCIBLE_MODE: false,
  },
};

// === HELPER FUNCTIONS ===

// Get settings for specific difficulty
export const getSettingsForDifficulty = (difficulty) => {
  const mode = difficulty.toUpperCase();
  
  return {
    birdSize: GAME_SETTINGS.BIRD.SIZE,
    pipeWidth: GAME_SETTINGS.PIPES.WIDTH,
    pipeGap: GAME_SETTINGS.PIPES.GAP_SIZE[mode] || GAME_SETTINGS.PIPES.GAP_SIZE.FUN,
    pipeSpacing: GAME_SETTINGS.PIPES.SPACING[mode] || GAME_SETTINGS.PIPES.SPACING.FUN,
    pipeSpeed: GAME_SETTINGS.PIPES.SPEED[mode] || GAME_SETTINGS.PIPES.SPEED.FUN,
    gravity: GAME_SETTINGS.PHYSICS.GRAVITY[mode] || GAME_SETTINGS.PHYSICS.GRAVITY.FUN,
    jumpForce: GAME_SETTINGS.PHYSICS.JUMP_FORCE[mode] || GAME_SETTINGS.PHYSICS.JUMP_FORCE.FUN,
    pointsPerObstacle: GAME_SETTINGS.SCORING.POINTS_PER_OBSTACLE[mode] || 10,
    tokensPerObstacle: GAME_SETTINGS.SCORING.TOKENS_PER_OBSTACLE[mode] || 10,
  };
};

// Validate settings (ensure they make sense)
export const validateSettings = () => {
  const issues = [];
  
  // Check pipe gaps aren't too small
  Object.entries(GAME_SETTINGS.PIPES.GAP_SIZE).forEach(([mode, gap]) => {
    if (gap < GAME_SETTINGS.BIRD.SIZE * 2) {
      issues.push(`${mode} mode gap (${gap}) might be too small for bird size (${GAME_SETTINGS.BIRD.SIZE})`);
    }
  });
  
  // Check pipe spacing makes sense
  Object.entries(GAME_SETTINGS.PIPES.SPACING).forEach(([mode, spacing]) => {
    if (spacing < GAME_SETTINGS.PIPES.WIDTH * 2) {
      issues.push(`${mode} mode spacing (${spacing}) might cause pipe overlap`);
    }
  });
  
  return issues;
};

// Export default configuration
export default GAME_SETTINGS;
