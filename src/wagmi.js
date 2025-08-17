import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { PUSH_TESTNET_DONUT } from './utils/constants.js';

export const config = getDefaultConfig({
  appName: 'PushFlap Game',
  projectId: 'pushflap-game-project-id', // You can get this from WalletConnect Cloud
  chains: [PUSH_TESTNET_DONUT],
  transports: {
    [PUSH_TESTNET_DONUT.id]: http(),
  },
});
