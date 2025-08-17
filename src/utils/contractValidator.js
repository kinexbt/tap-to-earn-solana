// Contract Validation Utility
// Helps identify and diagnose contract deployment issues

import { CONTRACT_ADDRESSES } from './constants.js';

export const validateContracts = async () => {
  const results = {
    token: { address: CONTRACT_ADDRESSES.PUSHFLAP_TOKEN, deployed: false, error: null },
    game: { address: CONTRACT_ADDRESSES.PUSHFLAP_GAME, deployed: false, error: null }
  };

  const rpcUrl = 'https://evm.rpc-testnet-donut-node1.push.org';

  try {
    // Check token contract
    const tokenResponse = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getCode',
        params: [CONTRACT_ADDRESSES.PUSHFLAP_TOKEN, 'latest'],
        id: 1
      })
    });
    const tokenData = await tokenResponse.json();
    results.token.deployed = tokenData.result && tokenData.result !== '0x' && tokenData.result.length > 2;
    if (!results.token.deployed) {
      results.token.error = 'Contract not deployed or no bytecode';
    }

    // Check game contract
    const gameResponse = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getCode',
        params: [CONTRACT_ADDRESSES.PUSHFLAP_GAME, 'latest'],
        id: 2
      })
    });
    const gameData = await gameResponse.json();
    results.game.deployed = gameData.result && gameData.result !== '0x' && gameData.result.length > 2;
    if (!results.game.deployed) {
      results.game.error = 'Contract not deployed or no bytecode';
    }

  } catch (error) {
    results.token.error = `Network error: ${error.message}`;
    results.game.error = `Network error: ${error.message}`;
  }

  return results;
};

// Known working contract addresses for fallback
export const FALLBACK_CONTRACTS = {
  // V1 Contract (Known working but limited functionality)
  PUSHFLAP_GAME_V1: '0xe8c0a3bca3b6bdf6428197eb84699e269cfa6321',
  
  // V3 Contract (Single difficulty mode)
  PUSHFLAP_GAME_V3: '0x8c738331cb0326dfc60a91ae9f3a26e62bf99299'
};

export const getWorkingContract = async () => {
  const validation = await validateContracts();
  
  console.log('Contract Validation Results:', validation);
  
  if (validation.game.deployed) {
    return {
      address: CONTRACT_ADDRESSES.PUSHFLAP_GAME,
      version: 'V4',
      features: ['difficulty_modes', 'enhanced_stats', 'global_leaderboard']
    };
  }
  
  // Fallback to V3 if available
  const v3Response = await fetch('https://evm.rpc-testnet-donut-node1.push.org', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_getCode',
      params: [FALLBACK_CONTRACTS.PUSHFLAP_GAME_V3, 'latest'],
      id: 3
    })
  });
  const v3Data = await v3Response.json();
  const v3Deployed = v3Data.result && v3Data.result !== '0x' && v3Data.result.length > 2;
  
  if (v3Deployed) {
    return {
      address: FALLBACK_CONTRACTS.PUSHFLAP_GAME_V3,
      version: 'V3',
      features: ['single_difficulty', 'basic_stats']
    };
  }
  
  // Last resort: V1
  return {
    address: FALLBACK_CONTRACTS.PUSHFLAP_GAME_V1,
    version: 'V1',
    features: ['basic_game']
  };
};
