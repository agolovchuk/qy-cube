import { FC } from "react";
import { AppStatus } from "@/domain";
import styles from "./control.module.scss";

interface Props {
  onConnect: () => void;
  onDisconnect: () => void;
  status: AppStatus;
}

const ControlPanel: FC<Props> = ({ onConnect, onDisconnect, status }) => {
  return (
    <div className={styles.container}>
      <button
        disabled={status === AppStatus.CONNECTED}
        className={styles.btn}
        type="button"
        onClick={onConnect}
      >
        Connect
      </button>
      <button
        disabled={
          status === AppStatus.DISCONNECTED || status === AppStatus.ERROR
        }
        className={styles.btn}
        type="button"
        onClick={onDisconnect}
      >
        Disconnect
      </button>
    </div>
  );
};

export default ControlPanel;
