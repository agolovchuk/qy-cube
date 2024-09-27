import { useCallback, useEffect, useRef, useState } from "react";
import { AppStatus } from "@/domain";
import { QYCube, separateByte } from "./QYCube";
import { BT } from "./bt";
import type { CubeMessage } from "./QYCube/types";

export const useCube = () => {
  const cube = useRef<QYCube>();
  const [appStatus, setStatus] = useState<AppStatus>(AppStatus.DISCONNECTED);
  const [state, setState] = useState<ReadonlyArray<number>>();
  const [notes, setNotes] = useState<string>();
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
    cube.current = new QYCube(new BT(handleDisconnect), handleMessage);
    try {
      await cube.current.init();
      setStatus(AppStatus.CONNECTED);
    } catch (err) {
      if (err instanceof Error) {
        setNotes(err.message);
      }
      setStatus(AppStatus.ERROR);
    }
  }, [handleDisconnect, handleMessage]);

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
    appStatus,
    notes,
  };
};
