import { useCallback, useRef, useState } from "react";
import { QYCube } from "./qyCube";
import { separateByte } from "./helpers";
import { BT } from "./bt";
import type { CubeMessage } from "./types";

export enum AppStatus {
  CONNECTED,
  DISCONNECTED,
  ERROR,
}

export const useCube = () => {
  const cube = useRef<QYCube>();
  const [appStatus, setStatus] = useState<AppStatus>(AppStatus.DISCONNECTED);
  const [state, setState] = useState<ReadonlyArray<number>>();
  const handleDisconnect = useCallback(() => {
    setStatus(AppStatus.DISCONNECTED);
  }, []);

  const handleMessage = useCallback((message: CubeMessage) => {
    const data = message.state.reduce<ReadonlyArray<number>>(
      (a, v) => [...a, ...separateByte(v)],
      []
    );
    setState(data);
  }, []);

  const disconnect = useCallback(() => {
    if (cube.current) {
      cube.current.disconnect();
    }
  }, []);

  const handleConnect = useCallback(async () => {
    cube.current = new QYCube(new BT(), handleDisconnect, handleMessage);
    try {
      await cube.current.init();
      setStatus(AppStatus.CONNECTED);
    } catch {
      setStatus(AppStatus.ERROR);
    }
  }, [handleDisconnect, handleMessage]);

  return {
    onConnect: handleConnect,
    disconnect,
    state,
    appStatus,
  };
};
