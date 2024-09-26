import "./App.css";
import { useCube } from "./lib";

function App() {
  const { onConnect, disconnect } = useCube();

  return (
    <section className="device-control">
      <button className="btn" type="button" onClick={onConnect}>
        Connect
      </button>
      <button className="btn" type="button" onClick={disconnect}>
        Disconnect
      </button>
    </section>
  );
}

export default App;
