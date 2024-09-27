export const AES128_KEY = new Uint8Array([
  0x57, 0xb1, 0xf9, 0xab, 0xcd, 0x5a, 0xe8, 0xa7, 0x9c, 0xb9, 0x8c, 0xe7, 0x57,
  0x8c, 0x51, 0x08,
]);

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
