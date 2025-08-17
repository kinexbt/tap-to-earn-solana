#!/usr/bin/env node

/**
 * RPC Health Check Script for Push Testnet Donut
 * Tests various RPC endpoints to ensure the network is functional
 */

const NETWORK_CONFIG = {
  name: 'Push Testnet Donut',
  rpcUrl: 'https://evm.rpc-testnet-donut-node1.push.org',
  chainId: 42101,
  currencySymbol: 'PUSH',
  blockExplorer: 'https://donut.push.network/',
};

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
};

class RPCTester {
  constructor(config) {
    this.config = config;
    this.results = [];
  }

  async makeRPCCall(method, params = []) {
    try {
      const response = await fetch(this.config.rpcUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method,
          params,
          id: Date.now(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(`RPC Error: ${data.error.message} (Code: ${data.error.code})`);
      }

      return data.result;
    } catch (error) {
      throw new Error(`Network Error: ${error.message}`);
    }
  }

  async testBlockNumber() {
    console.log('🔍 Testing latest block number...');
    try {
      const blockNumber = await this.makeRPCCall('eth_blockNumber');
      const blockNum = parseInt(blockNumber, 16);
      
      this.results.push({
        test: 'Block Number',
        status: 'PASS',
        value: blockNum,
        message: `Latest block: ${blockNum}`,
      });
      
      console.log(`${colors.green}✅ Block number: ${blockNum}${colors.reset}`);
      return true;
    } catch (error) {
      this.results.push({
        test: 'Block Number',
        status: 'FAIL',
        error: error.message,
      });
      
      console.log(`${colors.red}❌ Block number test failed: ${error.message}${colors.reset}`);
      return false;
    }
  }

  async testChainId() {
    console.log('🔍 Testing chain ID...');
    try {
      const chainId = await this.makeRPCCall('eth_chainId');
      const chainIdNum = parseInt(chainId, 16);
      
      if (chainIdNum === this.config.chainId) {
        this.results.push({
          test: 'Chain ID',
          status: 'PASS',
          value: chainIdNum,
          message: `Chain ID matches: ${chainIdNum}`,
        });
        
        console.log(`${colors.green}✅ Chain ID: ${chainIdNum} (matches expected)${colors.reset}`);
        return true;
      } else {
        this.results.push({
          test: 'Chain ID',
          status: 'FAIL',
          value: chainIdNum,
          expected: this.config.chainId,
          message: `Chain ID mismatch: got ${chainIdNum}, expected ${this.config.chainId}`,
        });
        
        console.log(`${colors.red}❌ Chain ID mismatch: got ${chainIdNum}, expected ${this.config.chainId}${colors.reset}`);
        return false;
      }
    } catch (error) {
      this.results.push({
        test: 'Chain ID',
        status: 'FAIL',
        error: error.message,
      });
      
      console.log(`${colors.red}❌ Chain ID test failed: ${error.message}${colors.reset}`);
      return false;
    }
  }

  async testGasPrice() {
    console.log('🔍 Testing gas price...');
    try {
      const gasPrice = await this.makeRPCCall('eth_gasPrice');
      const gasPriceWei = parseInt(gasPrice, 16);
      const gasPriceGwei = gasPriceWei / 1e9;
      
      this.results.push({
        test: 'Gas Price',
        status: 'PASS',
        value: gasPriceGwei,
        message: `Gas price: ${gasPriceGwei.toFixed(2)} Gwei`,
      });
      
      console.log(`${colors.green}✅ Gas price: ${gasPriceGwei.toFixed(2)} Gwei${colors.reset}`);
      return true;
    } catch (error) {
      this.results.push({
        test: 'Gas Price',
        status: 'FAIL',
        error: error.message,
      });
      
      console.log(`${colors.red}❌ Gas price test failed: ${error.message}${colors.reset}`);
      return false;
    }
  }

  async testNetVersion() {
    console.log('🔍 Testing network version...');
    try {
      const netVersion = await this.makeRPCCall('net_version');
      
      this.results.push({
        test: 'Network Version',
        status: 'PASS',
        value: netVersion,
        message: `Network version: ${netVersion}`,
      });
      
      console.log(`${colors.green}✅ Network version: ${netVersion}${colors.reset}`);
      return true;
    } catch (error) {
      this.results.push({
        test: 'Network Version',
        status: 'FAIL',
        error: error.message,
      });
      
      console.log(`${colors.red}❌ Network version test failed: ${error.message}${colors.reset}`);
      return false;
    }
  }

  async testResponseTime() {
    console.log('🔍 Testing response time...');
    try {
      const startTime = Date.now();
      await this.makeRPCCall('eth_blockNumber');
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      let status = 'PASS';
      let message = `Response time: ${responseTime}ms`;
      
      if (responseTime > 5000) {
        status = 'WARN';
        message += ' (Slow response)';
        console.log(`${colors.yellow}⚠️ ${message}${colors.reset}`);
      } else {
        console.log(`${colors.green}✅ ${message}${colors.reset}`);
      }
      
      this.results.push({
        test: 'Response Time',
        status,
        value: responseTime,
        message,
      });
      
      return true;
    } catch (error) {
      this.results.push({
        test: 'Response Time',
        status: 'FAIL',
        error: error.message,
      });
      
      console.log(`${colors.red}❌ Response time test failed: ${error.message}${colors.reset}`);
      return false;
    }
  }

  async runAllTests() {
    console.log(`${colors.blue}🚀 Starting RPC Health Check for ${this.config.name}${colors.reset}`);
    console.log(`${colors.blue}📍 RPC URL: ${this.config.rpcUrl}${colors.reset}`);
    console.log('');

    const tests = [
      this.testResponseTime(),
      this.testBlockNumber(),
      this.testChainId(),
      this.testNetVersion(),
      this.testGasPrice(),
    ];

    await Promise.allSettled(tests);

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log(`${colors.blue}📊 Test Summary${colors.reset}`);
    console.log('='.repeat(50));

    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;
    const warnings = this.results.filter(r => r.status === 'WARN').length;

    console.log(`${colors.green}✅ Passed: ${passed}${colors.reset}`);
    console.log(`${colors.red}❌ Failed: ${failed}${colors.reset}`);
    console.log(`${colors.yellow}⚠️  Warnings: ${warnings}${colors.reset}`);

    if (failed === 0) {
      console.log(`\n${colors.green}🎉 RPC is healthy and working properly!${colors.reset}`);
    } else {
      console.log(`\n${colors.red}🚨 RPC has issues that need attention!${colors.reset}`);
    }

    // Detailed results
    console.log('\n' + colors.blue + 'Detailed Results:' + colors.reset);
    this.results.forEach(result => {
      const statusColor = result.status === 'PASS' ? colors.green : 
                         result.status === 'WARN' ? colors.yellow : colors.red;
      const statusSymbol = result.status === 'PASS' ? '✅' : 
                          result.status === 'WARN' ? '⚠️' : '❌';
      
      console.log(`${statusSymbol} ${result.test}: ${statusColor}${result.status}${colors.reset}`);
      if (result.message) {
        console.log(`   ${result.message}`);
      }
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
    });

    return failed === 0;
  }
}

// Main execution
async function main() {
  try {
    const tester = new RPCTester(NETWORK_CONFIG);
    const success = await tester.runAllTests();
    
    process.exit(success ? 0 : 1);
  } catch (error) {
    console.error(`${colors.red}💥 Unexpected error: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

// Run the script
main();
