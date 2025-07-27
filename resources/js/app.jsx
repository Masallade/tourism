import React from 'react';
import { createRoot } from 'react-dom/client';
import Header from './components/Header';
import '../css/app.css';
import './bootstrap';

function App() {
  return (
    <>
      <Header />
      {/* Other components can go here */}
    </>
  );
}

const rootElement = document.getElementById('app');
if (rootElement) {
  createRoot(rootElement).render(<App />);
}
