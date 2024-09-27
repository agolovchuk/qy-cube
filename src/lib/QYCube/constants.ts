export const START_BYTE = 0xfe;

export enum CubeMessageType {
  CubeHello = 0x2,
  StateChange = 0x3,
  SyncConfirmation = 0x4,
}
