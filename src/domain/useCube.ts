import { useCallback, useEffect, useRef, useReducer, useMemo } from "react";
import { QYCube } from "@/lib/QYCube";
import { BT } from "@/lib/bt";
import {
  initialState,
  reducer,
  CubeReducer,
  ActionType,
  updateState,
} from "./reducer";
import { AppStatus, CubeMove } from "./constants";
import type { CubeState } from "./types";

export const useCube = () => {
  const cube = useRef<QYCube>();

  const [state, dispatch] = useReducer<CubeReducer>(reducer, initialState);

  const handleDisconnect = useCallback(() => {
    dispatch({
      type: ActionType.SET_CONNECTION_STATUS,
      status: AppStatus.DISCONNECTED,
    });
  }, []);

  const handleMessage = useCallback((message: CubeState) => {
    dispatch(updateState(message));
  }, []);

  const disconnect = useCallback(() => {
    if (cube.current) {
      cube.current.disconnect();
    }
  }, []);

  const handleConnect = useCallback(async () => {
    cube.current = new QYCube(new BT(handleDisconnect), handleMessage);
    try {
      await cube.current.init();
      dispatch({
        type: ActionType.SET_CONNECTION_STATUS,
        status: AppStatus.CONNECTED,
      });
    } catch (err) {
      if (err instanceof Error) {
        dispatch({ type: ActionType.SET_ERROR_MESSAGE, error: err.message });
      }
    }
  }, [handleDisconnect, handleMessage]);

  const lastMove = useMemo<CubeMove | undefined>(
    () =>
      state.moves.length ? state.moves[state.moves.length - 1] : undefined,
    [state.moves]
  );

  useEffect(
    () => () => {
      cube.current?.disconnect();
    },
    []
  );

  return {
    onConnect: handleConnect,
    disconnect,
    state,
    lastMove,
  };
};
