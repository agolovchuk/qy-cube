import { MessageType } from "./constants";
export interface CubeState {
  type: MessageType;
  battery: number;
  state: ReadonlyArray<number>;
  move?: number;
}
