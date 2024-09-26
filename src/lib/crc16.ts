export function crc16ModBus(buffer: Uint8Array) {
  let crc = 0xffff;

  for (let pos = 0; pos < buffer.length; pos++) {
    crc ^= buffer[pos];

    for (let i = 8; i !== 0; i--) {
      if ((crc & 0x0001) !== 0) {
        crc >>= 1;
        crc ^= 0xa001;
      } else {
        crc >>= 1;
      }
    }
  }

  return crc & 0xffff;
}
