import { useState } from 'react';
import { CircuitProvider } from './context/CircuitContext';
import { TopNav } from './components/navigation/TopNav';
import { PlayerPortal } from './components/player/PlayerPortal';
import { ClubPortal } from './components/club/ClubPortal';
import { AdminPortal } from './components/admin/AdminPortal';
import { SimulatorDrawer } from './components/simulator/SimulatorDrawer';

export function App() {
  const [activePortal, setActivePortal] = useState<'PLAYER' | 'CLUB' | 'ADMIN'>('PLAYER');

  return (
    <CircuitProvider>
      <div className="app-container">
        <TopNav activePortal={activePortal} setActivePortal={setActivePortal} />

        <main className="main-content">
          {activePortal === 'PLAYER' && <PlayerPortal />}
          {activePortal === 'CLUB' && <ClubPortal />}
          {activePortal === 'ADMIN' && <AdminPortal />}
        </main>

        <SimulatorDrawer />
      </div>
    </CircuitProvider>
  );
}

export default App;
