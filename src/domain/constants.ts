export enum AppStatus {
  CONNECTED,
  DISCONNECTED,
  ERROR,
}

export enum MessageType {
  INIT,
  UPDATE,
}

export const NORMAL_CUBE_STATE = [
  3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4,
  4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5, 5,
  5, 5,
];

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
