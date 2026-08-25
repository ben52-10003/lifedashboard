import { useState } from "react";
import { Compass } from "./components/Compass";
import { Dashboard } from "./components/Dashboard";
import { Journal } from "./components/Journal";
import { MindMaps } from "./components/MindMaps";
import { OdysseyPlans } from "./components/OdysseyPlans";
import { TabNav, type AppTab } from "./components/TabNav";
import { useDashboardState } from "./hooks/useDashboardState";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState<AppTab>("dashboard");
  const {
    state,
    updateLevel,
    updateNotes,
    updateWorkview,
    updateLifeview,
    updateIntegration,
    updateCalibrationNotes,
    addActivity,
    updateActivity,
    removeActivity,
    upsertReflection,
    setMindMapCenter,
    addMindMapNode,
    renameMindMapNode,
    removeMindMapNode,
    toggleMindMapPick,
    updateMindMapAlternative,
    updateOdysseyPlan,
    updateOdysseyQuestion,
    addTimelineEvent,
    updateTimelineEvent,
    removeTimelineEvent,
    updateOdysseyGauge,
    setOdysseyStartYear,
  } = useDashboardState();

  return (
    <main className="app">
      <TabNav activeTab={activeTab} onTabChange={setActiveTab} />

      <div
        id="panel-dashboard"
        role="tabpanel"
        aria-labelledby="tab-dashboard"
        hidden={activeTab !== "dashboard"}
      >
        <Dashboard
          state={state}
          updateLevel={updateLevel}
          updateNotes={updateNotes}
        />
      </div>

      <div
        id="panel-compass"
        role="tabpanel"
        aria-labelledby="tab-compass"
        hidden={activeTab !== "compass"}
      >
        <Compass
          compass={state.compass}
          updateWorkview={updateWorkview}
          updateLifeview={updateLifeview}
          updateIntegration={updateIntegration}
          updateCalibrationNotes={updateCalibrationNotes}
        />
      </div>

      <div
        id="panel-journal"
        role="tabpanel"
        aria-labelledby="tab-journal"
        hidden={activeTab !== "journal"}
      >
        <Journal
          journal={state.journal}
          addActivity={addActivity}
          updateActivity={updateActivity}
          removeActivity={removeActivity}
          upsertReflection={upsertReflection}
        />
      </div>

      <div
        id="panel-mindmap"
        role="tabpanel"
        aria-labelledby="tab-mindmap"
        hidden={activeTab !== "mindmap"}
      >
        <MindMaps
          journal={state.journal}
          maps={state.mindMaps.maps}
          setCenter={setMindMapCenter}
          addNode={addMindMapNode}
          renameNode={renameMindMapNode}
          removeNode={removeMindMapNode}
          togglePick={toggleMindMapPick}
          updateAlternative={updateMindMapAlternative}
          onGoToJournal={() => setActiveTab("journal")}
        />
      </div>

      <div
        id="panel-odyssey"
        role="tabpanel"
        aria-labelledby="tab-odyssey"
        hidden={activeTab !== "odyssey"}
      >
        <OdysseyPlans
          odyssey={state.odyssey}
          updatePlan={updateOdysseyPlan}
          updateQuestion={updateOdysseyQuestion}
          addTimelineEvent={addTimelineEvent}
          updateTimelineEvent={updateTimelineEvent}
          removeTimelineEvent={removeTimelineEvent}
          updateGauge={updateOdysseyGauge}
          setStartYear={setOdysseyStartYear}
        />
      </div>
    </main>
  );
}

export default App;
