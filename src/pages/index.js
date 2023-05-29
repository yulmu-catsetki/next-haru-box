import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const Index = () => {
  useEffect(() => {
    const container = document.getElementById('App');
    if (container) {
      const root = createRoot(container);
      root.render(<App tab="home" />);
    }
  }, []);

  return <div id="App" />;
};

export default Index;
