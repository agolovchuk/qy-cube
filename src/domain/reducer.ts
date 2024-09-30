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
  timestamp: number;
}

interface InitAction {
  type: ActionType.INIT_CUBE_STATE;
  battery: number;
  cube: ReadonlyArray<number>;
  timestamp: number;
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
  timestamp,
}: CubeState): InitAction | UpdateAction {
  // console.log(timestamp, "TTT");
  if (type === MessageType.INIT) {
    return {
      type: ActionType.INIT_CUBE_STATE,
      battery,
      cube: state,
      timestamp,
    };
  }
  return {
    type: ActionType.UPDATE_CUBE_STATE,
    battery,
    cube: state,
    timestamp,
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
  timestamp: 0,
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
        timestamp: action.timestamp,
      };
    case ActionType.UPDATE_CUBE_STATE:
      return {
        ...state,
        battery: action.battery,
        cube: action.cube,
        moves: state.moves.concat(action.move),
        timestamp: action.timestamp,
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
