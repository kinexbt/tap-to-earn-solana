// PushFlap Contracts Reference - Complete ABI and Contract Details
// Generated on August 15, 2025
// Network: Push Testnet Donut (Chain ID: 42101)

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

// ============================================================================
// CONTRACT ADDRESSES
// ============================================================================

export const CONTRACT_ADDRESSES = {
  PUSHFLAP_TOKEN: '0x852103e86dac9b82aa64c88178b08624cd32f0e8',
  PUSHFLAP_GAME: '0x8200aab5c9f765c9f4c40e83445576b375ee4737',
};

// ============================================================================
// DEPLOYMENT INFORMATION
// ============================================================================

export const DEPLOYMENT_INFO = {
  token: {
    contractAddress: '0x852103e86dac9b82aa64c88178b08624cd32f0e8',
    transactionHash: '0x1be981120cc4dc6c3f46330ff759feb2130c26e15527b8bbbbce4415560ea656',
    blockNumber: '410982',
    gasUsed: '701955',
    deployer: '0xBbf21e7824e21124C9F11dF58CA39d0eeA0ddD81',
    deployedAt: '2025-08-15T11:20:41.741Z',
    tokenDetails: {
      name: 'PushFlap Token',
      symbol: 'PFT',
      decimals: 18,
      initialSupply: '100000000000000000000000000', // 100M tokens
    },
  },
  game: {
    contractAddress: '0x8200aab5c9f765c9f4c40e83445576b375ee4737',
    transactionHash: '0x[deployment_tx_hash_here]',
    blockNumber: '483398',
    gasUsed: '1683073',
    deployer: '0xe902b2B4DA983E9446785a67A05d01CeAbC3f693',
    deployedAt: '2025-08-16T10:33:00.000Z',
  },
};

// ============================================================================
// PUSHFLAP TOKEN CONTRACT (ERC20 + Custom Functions)
// ============================================================================

export const PUSHFLAP_TOKEN_ABI = [
  // ERC20 Standard Functions
  {
    type: 'constructor',
    inputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'name',
    inputs: [],
    outputs: [{ name: '', type: 'string', internalType: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'symbol',
    inputs: [],
    outputs: [{ name: '', type: 'string', internalType: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'decimals',
    inputs: [],
    outputs: [{ name: '', type: 'uint8', internalType: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'totalSupply',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'balanceOf',
    inputs: [{ name: 'account', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'transfer',
    inputs: [
      { name: 'to', type: 'address', internalType: 'address' },
      { name: 'amount', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'allowance',
    inputs: [
      { name: 'owner', type: 'address', internalType: 'address' },
      { name: 'spender', type: 'address', internalType: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'approve',
    inputs: [
      { name: 'spender', type: 'address', internalType: 'address' },
      { name: 'amount', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'transferFrom',
    inputs: [
      { name: 'from', type: 'address', internalType: 'address' },
      { name: 'to', type: 'address', internalType: 'address' },
      { name: 'amount', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'nonpayable',
  },
  
  // Ownable Functions
  {
    type: 'function',
    name: 'owner',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'renounceOwnership',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'transferOwnership',
    inputs: [{ name: 'newOwner', type: 'address', internalType: 'address' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  
  // Custom PushFlap Token Functions
  {
    type: 'function',
    name: 'gameContract',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'setGameContract',
    inputs: [{ name: '_gameContract', type: 'address', internalType: 'address' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'mintTokens',
    inputs: [
      { name: 'to', type: 'address', internalType: 'address' },
      { name: 'amount', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  
  // Events
  {
    type: 'event',
    name: 'Transfer',
    inputs: [
      { name: 'from', type: 'address', indexed: true, internalType: 'address' },
      { name: 'to', type: 'address', indexed: true, internalType: 'address' },
      { name: 'value', type: 'uint256', indexed: false, internalType: 'uint256' },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Approval',
    inputs: [
      { name: 'owner', type: 'address', indexed: true, internalType: 'address' },
      { name: 'spender', type: 'address', indexed: true, internalType: 'address' },
      { name: 'value', type: 'uint256', indexed: false, internalType: 'uint256' },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'OwnershipTransferred',
    inputs: [
      { name: 'previousOwner', type: 'address', indexed: true, internalType: 'address' },
      { name: 'newOwner', type: 'address', indexed: true, internalType: 'address' },
    ],
    anonymous: false,
  },
];

// ============================================================================
// PUSHFLAP GAME CONTRACT
// ============================================================================

export const PUSHFLAP_GAME_ABI = [
  // Constructor
  {
    type: 'constructor',
    inputs: [{ name: 'tokenAddress', type: 'address', internalType: 'address' }],
    stateMutability: 'nonpayable',
  },
  
  // Core Game Functions (V4 Contract)
    {
      type: 'function',
      name: 'submitScore',
      inputs: [
        { name: 'difficulty', type: 'uint8', internalType: 'uint8' },
        { name: 'obstaclesPassed', type: 'uint256', internalType: 'uint256' },
      ],
      outputs: [],
      stateMutability: 'nonpayable',
    },
    {
      type: 'function',
      name: 'getLeaderboard',
      inputs: [
        { name: 'difficulty', type: 'uint8', internalType: 'uint8' },
      ],
      outputs: [
        { name: '', type: 'address[]', internalType: 'address[]' },
        { name: '', type: 'uint256[]', internalType: 'uint256[]' },
      ],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'getGlobalLeaderboard',
      inputs: [],
      outputs: [
        { name: '', type: 'address[]', internalType: 'address[]' },
        { name: '', type: 'uint256[]', internalType: 'uint256[]' },
      ],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'getPlayerInfo',
      inputs: [
        { name: 'player', type: 'address', internalType: 'address' },
      ],
      outputs: [
        { name: 'bestEasy', type: 'uint256', internalType: 'uint256' },
        { name: 'bestMedium', type: 'uint256', internalType: 'uint256' },
        { name: 'bestHard', type: 'uint256', internalType: 'uint256' },
        { name: 'totalScore', type: 'uint256', internalType: 'uint256' },
        { name: 'gamesPlayed', type: 'uint256', internalType: 'uint256' },
      ],
      stateMutability: 'view',
    },
  {
    type: 'function',
    name: 'getScoreHistory',
    inputs: [{ name: 'player', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint256[]', internalType: 'uint256[]' }],
    stateMutability: 'view',
  },
  
  // Public State Variables (auto-generated getters)
  {
    type: 'function',
    name: 'token',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'contract PushFlapToken' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'players',
    inputs: [{ name: '', type: 'address', internalType: 'address' }],
    outputs: [
      { name: 'bestScore', type: 'uint256', internalType: 'uint256' },
      { name: 'totalScore', type: 'uint256', internalType: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'playerList',
    inputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  
  // Ownable Functions (inherited)
  {
    type: 'function',
    name: 'owner',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'renounceOwnership',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'transferOwnership',
    inputs: [{ name: 'newOwner', type: 'address', internalType: 'address' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  
  // Events
  {
    type: 'event',
    name: 'ScoreSubmitted',
    inputs: [
      { name: 'player', type: 'address', indexed: true, internalType: 'address' },
      { name: 'score', type: 'uint256', indexed: false, internalType: 'uint256' },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'TokensAwarded',
    inputs: [
      { name: 'player', type: 'address', indexed: true, internalType: 'address' },
      { name: 'amount', type: 'uint256', indexed: false, internalType: 'uint256' },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'OwnershipTransferred',
    inputs: [
      { name: 'previousOwner', type: 'address', indexed: true, internalType: 'address' },
      { name: 'newOwner', type: 'address', indexed: true, internalType: 'address' },
    ],
    anonymous: false,
  },
];

// ============================================================================
// CONTRACT DETAILS AND SPECIFICATIONS
// ============================================================================

export const CONTRACT_SPECS = {
  PushFlapToken: {
    name: 'PushFlapToken',
    version: '1.0.0',
    compiler: 'solc 0.8.20',
    optimization: true,
    license: 'MIT',
    inheritedContracts: ['ERC20', 'Ownable'],
    dependencies: ['@openzeppelin/contracts'],
    
    features: {
      erc20Standard: true,
      mintable: true,
      ownable: true,
      gameIntegration: true,
    },
    
    constants: {
      INITIAL_SUPPLY: '100000000000000000000000000', // 100M tokens with 18 decimals
      DECIMALS: 18,
      NAME: 'PushFlap Token',
      SYMBOL: 'PFT',
    },
    
    permissions: {
      owner: [
        'setGameContract',
        'transferOwnership',
        'renounceOwnership',
      ],
      gameContract: [
        'mintTokens',
      ],
      public: [
        'transfer',
        'approve',
        'transferFrom',
        'balanceOf',
        'totalSupply',
        'name',
        'symbol',
        'decimals',
        'allowance',
        'gameContract',
        'owner',
      ],
    },
  },
  
  PushFlapGame: {
    name: 'PushFlapGame',
    version: '1.0.0',
    compiler: 'solc 0.8.20',
    optimization: true,
    license: 'MIT',
    inheritedContracts: ['Ownable'],
    dependencies: ['@openzeppelin/contracts', './PushFlapToken.sol'],
    
    features: {
      scoreTracking: true,
      leaderboard: true,
      tokenRewards: true,
      playerStatistics: true,
      scoreHistory: true,
    },
    
    dataStructures: {
      Player: {
        bestScore: 'uint256',
        totalScore: 'uint256',
        scoreHistory: 'uint256[]',
      },
    },
    
    permissions: {
      owner: [
        'submitScore',
        'transferOwnership',
        'renounceOwnership',
      ],
      public: [
        'getLeaderboard',
        'getScoreHistory',
        'getPlayerInfo',
        'players',
        'playerList',
        'token',
        'owner',
      ],
    },
    
    gameLogic: {
      scoreSubmission: 'Only owner can submit scores',
      tokenReward: 'Tokens minted equal to score value',
      leaderboardSorting: 'Bubble sort by best score (descending)',
      newPlayerDetection: 'Added to playerList on first score',
    },
  },
};

// ============================================================================
// HELPER FUNCTIONS AND UTILITIES
// ============================================================================

export const FUNCTION_SIGNATURES = {
  // PushFlapToken
  TOKEN: {
    name: 'function name() view returns (string)',
    symbol: 'function symbol() view returns (string)',
    decimals: 'function decimals() view returns (uint8)',
    totalSupply: 'function totalSupply() view returns (uint256)',
    balanceOf: 'function balanceOf(address) view returns (uint256)',
    transfer: 'function transfer(address,uint256) returns (bool)',
    approve: 'function approve(address,uint256) returns (bool)',
    transferFrom: 'function transferFrom(address,address,uint256) returns (bool)',
    allowance: 'function allowance(address,address) view returns (uint256)',
    owner: 'function owner() view returns (address)',
    gameContract: 'function gameContract() view returns (address)',
    setGameContract: 'function setGameContract(address)',
    mintTokens: 'function mintTokens(address,uint256)',
    transferOwnership: 'function transferOwnership(address)',
    renounceOwnership: 'function renounceOwnership()',
  },
  
  // PushFlapGame V4
  GAME: {
    submitScore: 'function submitScore(uint8,uint256)',
    getLeaderboard: 'function getLeaderboard(uint8) view returns (address[],uint256[])',
    getGlobalLeaderboard: 'function getGlobalLeaderboard() view returns (address[],uint256[])',
    getPlayerInfo: 'function getPlayerInfo(address) view returns (uint256,uint256,uint256,uint256,uint256)',
    token: 'function token() view returns (address)',
    players: 'function players(address) view returns (uint256,uint256)',
    playerList: 'function playerList(uint256) view returns (address)',
    owner: 'function owner() view returns (address)',
    transferOwnership: 'function transferOwnership(address)',
    renounceOwnership: 'function renounceOwnership()',
  },
};

// ============================================================================
// INTEGRATION EXAMPLES
// ============================================================================

export const INTEGRATION_EXAMPLES = {
  // Initialize clients
  initializeClients: `
import { createWalletClient, createPublicClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

const account = privateKeyToAccount('YOUR_PRIVATE_KEY');
const walletClient = createWalletClient({
  account,
  chain: PUSH_TESTNET_DONUT,
  transport: http(),
});
const publicClient = createPublicClient({
  chain: PUSH_TESTNET_DONUT,
  transport: http(),
});
  `,
  
  // Submit a score
  submitScore: `
const hash = await walletClient.writeContract({
  address: CONTRACT_ADDRESSES.PUSHFLAP_GAME,
  abi: PUSHFLAP_GAME_ABI,
  functionName: 'submitScore',
  args: [playerAddress, score],
});
  `,
  
  // Get leaderboard
  getLeaderboard: `
const [addresses, scores] = await publicClient.readContract({
  address: CONTRACT_ADDRESSES.PUSHFLAP_GAME,
  abi: PUSHFLAP_GAME_ABI,
  functionName: 'getLeaderboard',
});
  `,
  
  // Check token balance
  checkBalance: `
const balance = await publicClient.readContract({
  address: CONTRACT_ADDRESSES.PUSHFLAP_TOKEN,
  abi: PUSHFLAP_TOKEN_ABI,
  functionName: 'balanceOf',
  args: [playerAddress],
});
  `,
  
  // Transfer tokens
  transferTokens: `
const hash = await walletClient.writeContract({
  address: CONTRACT_ADDRESSES.PUSHFLAP_TOKEN,
  abi: PUSHFLAP_TOKEN_ABI,
  functionName: 'transfer',
  args: [toAddress, amount],
});
  `,
};

// ============================================================================
// EXPORT ALL
// ============================================================================

export default {
  PUSH_TESTNET_DONUT,
  CONTRACT_ADDRESSES,
  DEPLOYMENT_INFO,
  PUSHFLAP_TOKEN_ABI,
  PUSHFLAP_GAME_ABI,
  CONTRACT_SPECS,
  FUNCTION_SIGNATURES,
  INTEGRATION_EXAMPLES,
};
