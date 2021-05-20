export const getNumberPercentageFromNumber = (numberIn: number, number: number): number => {
  return (numberIn * 100) / number;
}

export const getPercentagerFromNumber = (number: number, percentage: number): number => {
  return ((number * percentage) / 100);
}

export const normalizeHeight = (
  height: number,
  fontScale: number
): number => height + (height * fontScale - height) / 3;