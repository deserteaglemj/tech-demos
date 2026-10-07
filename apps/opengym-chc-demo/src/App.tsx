import { Shell } from "./components/Shell";
import { History } from "./pages/History";
import { Home } from "./pages/Home";
import { Library } from "./pages/Library";
import { Muscles } from "./pages/Muscles";
import { Plan } from "./pages/Plan";
import { Settings } from "./pages/Settings";
import { Stats } from "./pages/Stats";
import { Whoop } from "./pages/Whoop";
import { Workout } from "./pages/Workout";
import { useAppStore } from "./lib/store";

export default function App() {
  const store = useAppStore();
  const { state, page } = store;
  const mode = page === "whoop" ? "whoop" : "train";

  return (
    <Shell
      page={page}
      mode={mode}
      workoutActive={state.session.started && !state.session.finished}
      onGo={store.go}
      onMode={(next) => store.go(next === "whoop" ? "whoop" : "home")}
      onStart={store.startWorkout}
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
      {store.updateNote && (
        <p className="update-note" role="status">
          {store.updateNote}{" "}
          <button type="button" className="ghost-btn" onClick={store.dismissUpdate}>
            OK
          </button>
        </p>
      )}
      {!store.ready && <p className="lede">Opening your log on this device…</p>}
      {store.ready && page === "home" && (
        <Home
          state={state}
          loggedSets={store.loggedSets}
          totalSets={store.totalSets}
          onGo={store.go}
          onStart={store.startWorkout}
          onLogWeight={store.logBodyWeight}
        />
      )}
      {store.ready && page === "plan" && (
        <Plan state={state} onStartDay={store.startDay} />
      )}
      {store.ready && page === "workout" && (
        <Workout
          state={state}
          loggedSets={store.loggedSets}
          totalSets={store.totalSets}
          updateSet={store.updateSet}
          completeSet={store.completeSet}
          finishWorkout={store.finishWorkout}
        />
      )}
      {store.ready && page === "stats" && <Stats state={state} onGo={store.go} />}
      {store.ready && page === "library" && (
        <Library state={state} onGo={store.go} onAdd={store.addToWorkout} />
      )}
      {store.ready && page === "history" && (
        <History state={state} onGo={store.go} />
      )}
      {store.ready && page === "muscles" && (
        <Muscles state={state} onGo={store.go} />
      )}
      {store.ready && page === "whoop" && <Whoop />}
      {store.ready && page === "settings" && (
        <Settings
          state={state}
          onGo={store.go}
          onUnits={store.setUnits}
          onRename={store.setAthlete}
          onReset={store.resetDemo}
        />
      )}
    </Shell>
  );
}
