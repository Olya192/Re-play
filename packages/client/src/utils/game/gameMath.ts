export const isClickInsideCircle = (
  clickX: number,
  clickY: number,
  objectX: number,
  objectY: number,
  radius: number
): boolean => {
  const distance = Math.sqrt(Math.pow(clickX - objectX, 2) + Math.pow(clickY - objectY, 2));

  return distance <= radius;
};

export const randomRange = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};
