import { PulseProvider } from './context/PulseContext';
import { PulseShell } from './components/pulse/PulseShell';

export function App() {
  return (
    <PulseProvider>
      <PulseShell />
    </PulseProvider>
  );
}

export default App;
