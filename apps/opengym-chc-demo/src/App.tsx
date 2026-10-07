import { useState } from "react";
import { Home } from "./components/Home";
import { Progress } from "./components/Progress";
import { Shell, type Tab } from "./components/Shell";
import { Workout } from "./components/Workout";
import { useAppStore } from "./lib/store";

export default function App() {
  const [tab, setTab] = useState<Tab>("home");
  const store = useAppStore();

  return (
    <Shell tab={tab} onTab={setTab} onReset={store.resetDemo}>
      {tab === "home" && (
        <Home
          state={store.state}
          loggedSets={store.loggedSets}
          totalSets={store.totalSets}
          onTab={setTab}
        />
      )}
      {tab === "workout" && (
        <Workout
          state={store.state}
          updateSet={store.updateSet}
          completeSet={store.completeSet}
        />
      )}
      {tab === "progress" && <Progress state={store.state} />}

      {store.restSeconds > 0 && (
        <div className="rest-banner" role="status">
          <div>
            <strong>Rest {store.restSeconds}s</strong>
            <span>Between sets — stay ready for the next one.</span>
          </div>
          <button type="button" className="ghost-btn" onClick={store.skipRest}>
            Skip
          </button>
        </div>
      )}

      {store.pr && (
        <div className="pr-toast" role="status">
          <div>
            <strong>New PR · {store.pr.weight} × {store.pr.reps}</strong>
            <span>{store.pr.exerciseName}</span>
          </div>
          <button type="button" className="ghost-btn" onClick={store.dismissPr}>
            Nice
          </button>
        </div>
      )}
    </Shell>
  );
}
