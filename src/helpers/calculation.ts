export const getNumberPercentageFromNumber = (numberIn: number, number: number): number => {
  return (numberIn * 100) / number;
};

export const getPercentageFromNumber = (number: number, percentage: number): number => {
  return ((number * percentage) / 100);
};

export const normalizeHeight = (
  height: number,
  fontScale: number
): number => height + (height * fontScale - height) / 3;
