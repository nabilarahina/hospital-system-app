import React, { useState } from 'react';
import Layout from './components/Layout';
import DocsView from './components/DocsView';
import SimulationView from './components/SimulationView';

function App() {
  const [activeTab, setActiveTab] = useState<'simulation' | 'docs'>('simulation');

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'docs' ? (
        <DocsView />
      ) : (
        <SimulationView />
      )}
    </Layout>
  );
}

export default App;