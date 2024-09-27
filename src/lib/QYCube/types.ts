import { CubeMessageType } from "./constants";
import { CubeMove } from "@/lib/constants";

interface BaseMessage {
  battery: number;
  timestamp: Uint8Array;
  isASCRequire: number;
  state: CubeState;
  move?: CubeMove;
}

type CubeState = Uint8Array;

interface CubeHelloMessage extends BaseMessage {
  type: CubeMessageType.CubeHello;
}

interface StateChangeMessage extends BaseMessage {
  type: CubeMessageType.StateChange;
  prevMove: Uint8Array;
}

interface SyncConfirmationMessage extends BaseMessage {
  type: CubeMessageType.SyncConfirmation;
}

export type CubeMessage =
  | CubeHelloMessage
  | StateChangeMessage
  | SyncConfirmationMessage;
