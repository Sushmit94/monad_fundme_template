import { ethers } from 'ethers';

// Monad Testnet Configuration
export const MONAD_CONFIG = {
  chainId: 666, // Monad testnet
  chainName: 'Monad Testnet',
  nativeCurrency: {
    name: 'MON',
    symbol: 'MON',
    decimals: 18,
  },
  rpcUrl: 'https://testnet.monad.xyz', // Update with actual RPC
  blockExplorerUrl: 'https://explorer.testnet.monad.xyz',
};

// Your deployed contract address
export const CONTRACT_ADDRESS = '0x529049b6680BF63105a74De5BA1440402c365325';

// Contract ABI
export const CONTRACT_ABI = [
  'function fund() public payable',
  'function totalFunds() public view returns (uint256)',
  'function funders(address) public view returns (uint256)',
  'function getContractBalance() public view returns (uint256)',
  'function getFunderCount() public view returns (uint256)',
  'event Funded(address indexed funder, uint256 amount)',
];

// Create provider for read-only operations
export const getProvider = () => {
  return new ethers.JsonRpcProvider(MONAD_CONFIG.rpcUrl);
};

// Get contract instance
export const getContract = (signerOrProvider: any) => {
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signerOrProvider);
};