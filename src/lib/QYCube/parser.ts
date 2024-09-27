import { crc16ModBus } from "../crc16";
import { CubeMessageType } from "./constants";
import { u8toArray } from "./helpers";
import type { CubeMessage } from "./types";

function trimPadding(data: Uint8Array, length: number): Uint8Array {
  return data.subarray(0, length);
}

function getCheckSum(data: Uint8Array): number {
  return (data[data.length - 1] << 8) | data[data.length - 2];
}

export function parseMessage(data: Uint8Array): CubeMessage {
  if (data[0] !== 0xfe) throw new Error("Incorrect start byte");
  const messageLength = data[1];

  if (data.length < messageLength) throw new Error("Message too short");

  const packet = trimPadding(data, messageLength);
  const checkSum = crc16ModBus(packet.subarray(0, -2));
  if (getCheckSum(packet) !== checkSum)
    throw new Error(
      `Incorrect checksum: ${getCheckSum(packet).toString(
        16
      )}, ${checkSum.toString(16)}, in packet: ${u8toArray(
        packet
      )}, in Data: ${u8toArray(data)}`
    );

  const opCode = packet[2] as CubeMessageType;

  const baseMessage = {
    timestamp: packet.subarray(3, 3 + 4),
    battery: packet[35],
    state: packet.subarray(7, 7 + 27),
  };

  switch (opCode) {
    case CubeMessageType.CubeHello:
      return {
        type: opCode,
        ...baseMessage,
        isASCRequire: 0x1,
      };

    case CubeMessageType.StateChange:
      return {
        type: opCode,
        move: packet[34],
        prevMove: packet.subarray(36, 55),
        isASCRequire: packet[91],
        ...baseMessage,
      };

    case CubeMessageType.SyncConfirmation:
      return {
        type: opCode,
        isASCRequire: 0,
        ...baseMessage,
      };

    default:
      throw new Error("Incorrect message type");
  }
}
