import "./App.css";
import { Cube } from "@/components";
import { ControlPanel } from "@/containers/Control";
import { useCube } from "./lib";

function App() {
  const { onConnect, disconnect, state, appStatus } = useCube();
  return (
    <main className="app-main">
      <Cube state={state} />
      <aside>
        <ControlPanel
          onConnect={onConnect}
          onDisconnect={disconnect}
          status={appStatus}
        />
      </aside>
    </main>
  );
}

export default App;
