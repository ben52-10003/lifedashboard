import { Dashboard } from "./components/Dashboard";
import { useDashboardState } from "./hooks/useDashboardState";
import "./App.css";

function App() {
  const { state, updateLevel, updateNotes } = useDashboardState();

  return (
    <main className="app">
      <Dashboard
        state={state}
        updateLevel={updateLevel}
        updateNotes={updateNotes}
      />
    </main>
  );
}

export default App;
