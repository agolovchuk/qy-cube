export const AES128_KEY = new Uint8Array([
  0x57, 0xb1, 0xf9, 0xab, 0xcd, 0x5a, 0xe8, 0xa7, 0x9c, 0xb9, 0x8c, 0xe7, 0x57,
  0x8c, 0x51, 0x08,
]);

export const NORMAL_CUBE_STATE = [
  3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4,
  4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5, 5,
  5, 5,
];

export enum CubeColor {
  orange = 0,
  red = 1,
  yellow = 2,
  white = 3,
  green = 4,
  blue = 5,
}

export enum CubeFacet {
  top,
  right,
  front,
  bottom,
  left,
  back,
}

export enum CubeMove {
  "L'" = 0x1,
  "L" = 0x2,
  "R'" = 0x3,
  "R" = 0x4,
  "D'" = 0x5,
  "D" = 0x6,
  "U'" = 0x7,
  "U" = 0x8,
  "F'" = 0x9,
  "F" = 0xa,
  "B'" = 0xb,
  "B" = 0xc,
}
