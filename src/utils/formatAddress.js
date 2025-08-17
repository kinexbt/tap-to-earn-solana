export const formatAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatTokenAmount = (amount, decimals = 18) => {
  if (!amount) return '0';
  const value = parseFloat(amount) / Math.pow(10, decimals);
  return value.toFixed(2);
};

export const formatScore = (score) => {
  if (!score) return '0';
  return score.toLocaleString();
};
