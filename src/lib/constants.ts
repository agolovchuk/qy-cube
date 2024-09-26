export const START = 0xfe;
export const APP_HELLO = new Uint8Array([
  0x00, 0x6b, 0x01, 0x00, 0x00, 0x22, 0x06, 0x00, 0x02, 0x08, 0x00,
]);
export const MAC = new Uint8Array([0xcc, 0xa3, 0x00, 0x00, 0xfc, 0xf9]);
export const AES128_KEY = new Uint8Array([
  0x57, 0xb1, 0xf9, 0xab, 0xcd, 0x5a, 0xe8, 0xa7, 0x9c, 0xb9, 0x8c, 0xe7, 0x57,
  0x8c, 0x51, 0x08,
]);

export enum CubeMessageType {
  CubeHello = 0x2,
  StateChange = 0x3,
  SyncConfirmation = 0x4,
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
  left,
  back,
  bottom,
  right,
  front,
}
