import { MessageType } from "./constants";
export interface CubeState {
  type: MessageType;
  timestamp: number;
  battery: number;
  state: ReadonlyArray<number>;
  move?: number;
}
