import { AppStatus, CubeMove, ActionType } from "./constants";

export interface State {
  error?: string;
  battery: number;
  cube: ReadonlyArray<number>;
  moves: ReadonlyArray<CubeMove>;
  status: AppStatus;
  timestamp: number;
}
export interface InitAction {
  type: ActionType.INIT_CUBE_STATE;
  battery: number;
  cube: ReadonlyArray<number>;
  timestamp: number;
}

export interface UpdateAction extends Omit<InitAction, "type"> {
  type: ActionType.UPDATE_CUBE_STATE;
  move: CubeMove;
}

export interface SyncAction {
  type: ActionType.SYNC_CUBE_STATE;
}

export type Action =
  | InitAction
  | UpdateAction
  | SyncAction
  | {
      type: ActionType.SET_CONNECTION_STATUS;
      status: AppStatus;
    }
  | {
      type: ActionType.SET_ERROR_MESSAGE;
      error: string;
    };
