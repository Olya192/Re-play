export const hasHtmlCharacters = (value: string): boolean => {
  return /[<>]/.test(value);
};
