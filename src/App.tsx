import "./App.css";
import { Cube } from "@/components";
import { useCube, AppStatus } from "./lib";

function App() {
  const { onConnect, disconnect, state, appStatus } = useCube();
  return (
    <div>
      <Cube state={state} />
      <section className="device-control">
        <button
          disabled={appStatus === AppStatus.CONNECTED}
          className="btn"
          type="button"
          onClick={onConnect}
        >
          Connect
        </button>
        <button
          disabled={
            appStatus === AppStatus.DISCONNECTED ||
            appStatus === AppStatus.ERROR
          }
          className="btn"
          type="button"
          onClick={disconnect}
        >
          Disconnect
        </button>
      </section>
    </div>
  );
}

export default App;
