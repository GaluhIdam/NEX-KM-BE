const calculateStatisticPercentage = (
  isGreater: boolean,
  value1: number,
  value2: number,
) => {
  const dividend = isGreater ? value2 : value1;
  const divisor = isGreater ? value1 : value2;

  if (divisor === 0 || dividend === 0) {
    return 100;
  }
  if (divisor === dividend) {
    return 0;
  }
  return Number(((dividend / divisor) * 100).toFixed(2));
};

export default calculateStatisticPercentage;
