#!/usr/bin/env node

/**
 * Quick RPC Check Script for Push Testnet Donut
 * Simple script to quickly test if RPC is responding
 */

const RPC_URL = 'https://evm.rpc-testnet-donut-node1.push.org';

async function quickCheck() {
  try {
    console.log('🔍 Checking RPC connectivity...');
    
    const startTime = Date.now();
    const response = await fetch(RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_blockNumber',
        params: [],
        id: 1,
      }),
    });

    const data = await response.json();
    const responseTime = Date.now() - startTime;

    if (data.result) {
      const blockNum = parseInt(data.result, 16);
      console.log(`✅ RPC is working!`);
      console.log(`📦 Latest block: ${blockNum}`);
      console.log(`⚡ Response time: ${responseTime}ms`);
    } else if (data.error) {
      console.log(`❌ RPC error: ${data.error.message}`);
      process.exit(1);
    } else {
      console.log('❌ Unexpected response format');
      process.exit(1);
    }
  } catch (error) {
    console.log(`❌ Connection failed: ${error.message}`);
    process.exit(1);
  }
}

quickCheck();
