/**
 * 0, 1 - start position
 * 2, 3 - move position
 * 4, 5 - calculated rotation angle
 */

// TODO: Update rotation function
export function getRotationParams(
  position: [number, number, number, number, number, number]
): [string, string] {
  const deltaX = position[2] - position[0];
  const deltaY = position[3] - position[1];

  const sensitivity = 0.6;
  position[4] -= deltaY * sensitivity;
  position[5] += deltaX * sensitivity;

  return [position[4].toFixed(1), position[5].toFixed(1)];
}
