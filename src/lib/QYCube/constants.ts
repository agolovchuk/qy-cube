export const START_BYTE = 0xfe;

export const AES128_KEY = new Uint8Array([
  0x57, 0xb1, 0xf9, 0xab, 0xcd, 0x5a, 0xe8, 0xa7, 0x9c, 0xb9, 0x8c, 0xe7, 0x57,
  0x8c, 0x51, 0x08,
]);

export enum CubeMessageType {
  CubeHello = 0x2,
  StateChange = 0x3,
  SyncConfirmation = 0x4,
}
