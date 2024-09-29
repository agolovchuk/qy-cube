import { Reducer } from "react";
import { CubeState } from "./types";
import {
  NORMAL_CUBE_STATE,
  AppStatus,
  CubeMove,
  MessageType,
} from "./constants";

export enum ActionType {
  INIT_CUBE_STATE,
  UPDATE_CUBE_STATE,
  SET_CONNECTION_STATUS,
  SET_ERROR_MESSAGE,
}

export interface State {
  error?: string;
  battery: number;
  cube: ReadonlyArray<number>;
  moves: ReadonlyArray<CubeMove>;
  status: AppStatus;
}

interface InitAction {
  type: ActionType.INIT_CUBE_STATE;
  battery: number;
  cube: ReadonlyArray<number>;
}

interface UpdateAction extends Omit<InitAction, "type"> {
  type: ActionType.UPDATE_CUBE_STATE;
  move: CubeMove;
}

export function updateState({
  type,
  battery,
  state,
  move,
}: CubeState): InitAction | UpdateAction {
  if (type === MessageType.INIT) {
    return {
      type: ActionType.INIT_CUBE_STATE,
      battery,
      cube: state,
    };
  }
  return {
    type: ActionType.UPDATE_CUBE_STATE,
    battery,
    cube: state,
    move: move || 0,
  };
}

export type Action =
  | InitAction
  | UpdateAction
  | {
      type: ActionType.SET_CONNECTION_STATUS;
      status: AppStatus;
    }
  | {
      type: ActionType.SET_ERROR_MESSAGE;
      error: string;
    };

export const initialState: State = {
  battery: 0,
  cube: NORMAL_CUBE_STATE,
  status: AppStatus.DISCONNECTED,
  moves: [],
};

export type CubeReducer = Reducer<State, Action>;

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ActionType.INIT_CUBE_STATE:
      return {
        ...state,
        battery: action.battery,
        cube: action.cube,
        moves: [],
      };
    case ActionType.UPDATE_CUBE_STATE:
      return {
        ...state,
        battery: action.battery,
        cube: action.cube,
        moves: state.moves.concat(action.move),
      };

    case ActionType.SET_CONNECTION_STATUS:
      return {
        ...state,
        status: action.status,
      };

    case ActionType.SET_ERROR_MESSAGE:
      return {
        ...state,
        status: AppStatus.ERROR,
        error: action.error,
      };
  }
}
