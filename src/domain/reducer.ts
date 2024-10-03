import { Reducer } from "react";
import { CubeMessage, CubeMessageType, getTimeStamp } from "@/lib/QYCube";
import { NORMAL_CUBE_STATE, AppStatus, ActionType } from "./constants";
import type {
  State,
  Action,
  InitAction,
  UpdateAction,
  SyncAction,
} from "./types";

export function messageAdapter({
  battery,
  state: cube,
  ...message
}: CubeMessage): InitAction | UpdateAction | SyncAction {
  const timestamp = getTimeStamp(message.timestamp);
  switch (message.type) {
    case CubeMessageType.CubeHello:
      return {
        type: ActionType.INIT_CUBE_STATE,
        timestamp,
        battery,
        cube,
      };
    case CubeMessageType.StateChange:
      return {
        type: ActionType.UPDATE_CUBE_STATE,
        timestamp,
        cube,
        battery,
        move: message.move,
      };
    default:
      return {
        type: ActionType.SYNC_CUBE_STATE,
      };
  }
}

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
    case ActionType.SYNC_CUBE_STATE:
      return state;
  }
}
