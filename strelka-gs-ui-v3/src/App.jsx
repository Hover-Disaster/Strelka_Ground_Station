import { SystemStateProvider } from "./hooks/systemState";
import { AppContent } from "./AppContent";

/*
    TODO:
    - Query states of display elements at startup such as gps tracking, flash memory... etc
    - Configure heartbeat packet on boot
*/

function App() {
  return (
    <SystemStateProvider>
      <AppContent />
    </SystemStateProvider>
  );
}

export default App;
