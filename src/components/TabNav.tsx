export type AppTab =
  | "dashboard"
  | "compass"
  | "journal"
  | "mindmap"
  | "odyssey"
  | "prototype";

interface TabNavProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

const TABS: { id: AppTab; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "compass", label: "Compass" },
  { id: "journal", label: "Journal" },
  { id: "mindmap", label: "Mind Map" },
  { id: "odyssey", label: "Odyssey" },
  { id: "prototype", label: "Prototype" },
];

export function TabNav({ activeTab, onTabChange }: TabNavProps) {
  return (
    <nav className="tab-nav" aria-label="Main navigation">
      <div className="tab-list" role="tablist">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              className={`tab-button${isActive ? " active" : ""}`}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
