import { Shell } from "./components/Shell";
import { History } from "./pages/History";
import { Home } from "./pages/Home";
import { Library } from "./pages/Library";
import { Muscles } from "./pages/Muscles";
import { Plan } from "./pages/Plan";
import { Settings } from "./pages/Settings";
import { Stats } from "./pages/Stats";
import { Workout } from "./pages/Workout";
import { useAppStore } from "./lib/store";

export default function App() {
  const store = useAppStore();
  const { state, page } = store;

  return (
    <Shell
      page={page}
      workoutActive={state.session.started && !state.session.finished}
      onGo={store.go}
      onStart={store.startWorkout}
      onReset={store.resetDemo}
      overlays={
        <>
          {store.restSeconds > 0 && page === "workout" && (
            <div className="rest-banner" role="status">
              <div>
                <strong>Rest {store.restSeconds}s</strong>
                <span>Between sets — stay ready for the next one.</span>
              </div>
              <button
                type="button"
                className="ghost-btn"
                onClick={store.skipRest}
              >
                Skip
              </button>
            </div>
          )}
          {store.pr && (
            <div className="pr-toast" role="status">
              <div>
                <strong>
                  New PR · {store.pr.weight} × {store.pr.reps}
                </strong>
                <span>{store.pr.exerciseName}</span>
              </div>
              <button
                type="button"
                className="ghost-btn"
                onClick={store.dismissPr}
              >
                Nice
              </button>
            </div>
          )}
        </>
      }
    >
      {page === "home" && (
        <Home
          state={state}
          loggedSets={store.loggedSets}
          totalSets={store.totalSets}
          onGo={store.go}
          onStart={store.startWorkout}
          onLogWeight={store.logBodyWeight}
        />
      )}
      {page === "plan" && (
        <Plan state={state} onStart={store.startWorkout} onGo={store.go} />
      )}
      {page === "workout" && (
        <Workout
          state={state}
          loggedSets={store.loggedSets}
          totalSets={store.totalSets}
          updateSet={store.updateSet}
          completeSet={store.completeSet}
          finishWorkout={store.finishWorkout}
        />
      )}
      {page === "stats" && <Stats state={state} onGo={store.go} />}
      {page === "library" && <Library state={state} onGo={store.go} />}
      {page === "history" && <History state={state} onGo={store.go} />}
      {page === "muscles" && <Muscles state={state} onGo={store.go} />}
      {page === "settings" && (
        <Settings
          state={state}
          onGo={store.go}
          onUnits={store.setUnits}
          onReset={store.resetDemo}
        />
      )}
    </Shell>
  );
}
