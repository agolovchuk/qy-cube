import { CubeMessageType, CubeMove } from "./constants";

export type EventHandler<T = undefined> = (data: T) => void;

export interface Communicator {
  send(data: Uint8Array, uuid?: number | string): Promise<void>;
  mac: Uint8Array;
  init(
    onDisconnect: EventHandler,
    onMessage: EventHandler<Uint8Array>
  ): Promise<void>;

  disconnect(): void;
}

interface BaseMessage {
  battery: number;
  timestamp: Uint8Array;
  isASCRequire: number;
  state: CubeState;
}

type CubeState = Uint8Array;

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
