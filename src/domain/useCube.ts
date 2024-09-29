import { useCallback, useEffect, useRef, useState } from "react";
import { AppStatus } from "@/domain";
import { QYCube } from "./QYCube";
import { BT } from "./bt";
import { NORMAL_CUBE_STATE } from "./constants";
import type { CubeState } from "./types";

export const useCube = () => {
  const cube = useRef<QYCube>();

  // TODO: Migrate to useReduce
  const [appStatus, setStatus] = useState<AppStatus>(AppStatus.DISCONNECTED);
  const [state, setState] = useState<ReadonlyArray<number>>(NORMAL_CUBE_STATE);
  const [notes, setNotes] = useState<string>();
  const [battery, setBattery] = useState<number>();

  const handleDisconnect = useCallback(() => {
    setStatus(AppStatus.DISCONNECTED);
  }, []);

  const handleMessage = useCallback((message: CubeState) => {
    setState(message.state);
    setBattery(message.battery);
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
    battery,
  };
};
