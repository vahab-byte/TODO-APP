import React from 'react';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import { AppProvider } from './context/AppContext';

function App() {
  return (
    <AppProvider>
      <Layout>
        <Home />
      </Layout>
    </AppProvider>
  );
}

export default App;
