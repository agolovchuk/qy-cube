import { useCallback, useRef } from "react";
import { QYCube } from "./qyCube";
import { BT } from "./bt";

export const useCube = () => {
  const cube = useRef<QYCube>();

  const handleDisconnect = useCallback(() => {}, []);

  const handleMessage = useCallback(() => {}, []);

  const disconnect = useCallback(() => {
    if (cube.current) {
      cube.current.disconnect();
    }
  }, []);

  const handleConnect = useCallback(async () => {
    cube.current = new QYCube(new BT(), handleDisconnect, handleMessage);
    cube.current.init();
  }, [handleDisconnect, handleMessage]);

  return {
    onConnect: handleConnect,
    disconnect,
  };
};
