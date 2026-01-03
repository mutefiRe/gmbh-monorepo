export function itemAmountString(amount: string) {
  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount)) return amount;

  // Show up to 2 decimals, but trim unnecessary zeros
  if (Number.isInteger(parsedAmount)) return parsedAmount.toString();
  return parsedAmount.toFixed(2).replace(/\.00$/, '').replace(/(\.[1-9]*)0$/, '$1');
}
