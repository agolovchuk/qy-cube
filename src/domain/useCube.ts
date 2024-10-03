import { useCallback, useEffect, useRef, useReducer, useMemo } from "react";
import { BT } from "@/lib/bt";
import { QYCube, CubeMessage } from "@/lib/QYCube";
import { initialState, reducer, CubeReducer, messageAdapter } from "./reducer";
import { AppStatus, ActionType } from "./constants";

export const useCube = () => {
  const cube = useRef<QYCube>();

  const [state, dispatch] = useReducer<CubeReducer>(reducer, initialState);

  const handleDisconnect = useCallback(() => {
    dispatch({
      type: ActionType.SET_CONNECTION_STATUS,
      status: AppStatus.DISCONNECTED,
    });
  }, []);

  const handleMessage = useCallback((cubeMessage: CubeMessage) => {
    dispatch(messageAdapter(cubeMessage));
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

  const lastMove = useMemo<number | undefined>(
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
