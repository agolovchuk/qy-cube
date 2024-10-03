import { CubeMessageType } from "./constants";
import { CubeMove } from "@/domain/constants";

interface BaseMessage {
  battery: number;
  timestamp: Uint8Array;
  isASCRequire: number;
  state: ReadonlyArray<number>;
}

interface CubeHelloMessage extends BaseMessage {
  type: CubeMessageType.CubeHello;
}

interface StateChangeMessage extends BaseMessage {
  type: CubeMessageType.StateChange;
  move: CubeMove;
  prevMove: Uint8Array;
}

interface SyncConfirmationMessage extends BaseMessage {
  type: CubeMessageType.SyncConfirmation;
}

export type CubeMessage =
  | CubeHelloMessage
  | StateChangeMessage
  | SyncConfirmationMessage;
