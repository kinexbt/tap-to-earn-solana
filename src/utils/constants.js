import { GAME_SETTINGS, getSettingsForDifficulty } from '../config/gameSettings.js';

// PushFlap Game Constants
export const PUSH_TESTNET_DONUT = {
  id: 42101,
  name: 'Push Testnet Donut',
  network: 'push-testnet-donut',
  nativeCurrency: {
    decimals: 18,
    name: 'PUSH',
    symbol: 'PUSH',
  },
  rpcUrls: {
    default: {
      http: ['https://evm.rpc-testnet-donut-node1.push.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Push Explorer',
      url: 'https://donut.push.network',
    },
  },
  testnet: true,
};


export const CONTRACT_ADDRESSES = {
  PUSHFLAP_TOKEN: '0x852103e86dac9b82aa64c88178b08624cd32f0e8', // ERC20 Token Contract (Unchanged)
  PUSHFLAP_GAME: '0x8200aab5c9f765c9f4c40e83445576b375ee4737', // V4 Final - Complete Game System
};

// Contract Version History:
// V1: 0xe8c0a3bca3b6bdf6428197eb84699e269cfa6321 (Deprecated - Owner-only submission)
// V2: 0xaf14ccd7ae77ab8a95a8791e7c056346b4ae9580 (Deprecated - Decimal bug)
// V3: 0x8c738331cb0326dfc60a91ae9f3a26e62bf99299 (Deprecated - Single mode only)
// V4: 0x8200aab5c9f765c9f4c40e83445576b375ee4737 (Current - Complete Game System)

export const GAME_MODES = {
  EASY: {
    id: 'easy',
    name: 'Easy',
    color: '#4CAF50',
    emoji: '😊',
    description: 'Relaxed pace, perfect for beginners',
    ...getSettingsForDifficulty('easy'),
  },
  MEDIUM: {
    id: 'medium',
    name: 'Medium',
    color: '#FF9800',
    emoji: '😐',
    description: 'Balanced challenge for regular players',
    ...getSettingsForDifficulty('medium'),
  },
  HARD: {
    id: 'hard',
    name: 'Hard',
    color: '#F44336',
    emoji: '😤',
    description: 'Intense gameplay for experts only',
    ...getSettingsForDifficulty('hard'),
  },
};

// Legacy GAME_CONFIG for backward compatibility
export const GAME_CONFIG = {
  CANVAS_WIDTH: GAME_SETTINGS.CANVAS.WIDTH,
  CANVAS_HEIGHT: GAME_SETTINGS.CANVAS.HEIGHT,
  BIRD_SIZE: GAME_SETTINGS.BIRD.SIZE,
  PIPE_WIDTH: GAME_SETTINGS.PIPES.WIDTH,
  FRAME_RATE: GAME_SETTINGS.GAMEPLAY.FRAME_RATE,
  PIPE_GAP: 200,
  GRAVITY: 0.5,
  JUMP_FORCE: -10,
  GAME_SPEED: 2,
  TOKENS_PER_POINT: 10,
  ...GAME_SETTINGS,
};

export const ANIMATION_CONFIG = {
  LOADING_DURATION: 3000,
  TRANSITION_DURATION: 300,
  FLOAT_DURATION: 3000,
  GLOW_DURATION: 2000,
};
