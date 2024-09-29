import { useCube } from "@/domain";
import { Cube, Moves } from "@/components";
import { ControlPanel } from "@/containers/Control";
import "./App.scss";

function App() {
  const { onConnect, disconnect, state, lastMove } = useCube();
  return (
    <>
      <main className="app-main">
        <Cube state={state.cube} className="" lastMove={lastMove} />
      </main>
      <aside className="app-aside">
        <ControlPanel
          onConnect={onConnect}
          onDisconnect={disconnect}
          status={state.status}
        />
        <Moves moves={state.moves} />
      </aside>
    </>
  );
}

export default App;
