import { START } from "./constants";
import { crc16ModBus } from "./crc16";

export function createPacket(
  message: Uint8Array,
  mac?: Uint8Array
): Uint8Array {
  const dataLength = 2 + message.length + (mac ? mac.length : 0) + 2;
  if (dataLength + 2 > 255) throw new Error("Packet len > 255");
  const packet = new Uint8Array(dataLength);
  packet.set([START, dataLength], 0);
  packet.set(message, 2);
  if (mac) {
    packet.set(mac.slice().reverse(), message.length + 2);
  }
  const crc = crc16ModBus(packet.slice(0, dataLength - 2));
  packet.set([crc & 0xff, (crc >> 8) & 0xff], dataLength - 2);
  return packet;
}

function toHexString(data: number): string {
  const el = data.toString(16);
  return "0x" + (el.length === 1 ? "0" + el : el);
}

export function u8toArray(u8: Uint8Array): string[] {
  return u8.reduce<string[]>((a, v) => [...a, toHexString(v)], []);
}

export function getTimeStamp(data: Uint8Array, start: number): number {
  const ts = new Uint32Array(data.subarray(start, start + 4));
  return ts[0] * 1.6;
}