import React from 'react';
import { createRoot } from 'react-dom/client';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import '../css/app.css';
import './bootstrap';

function App() {
  // Check if we're on an admin route
  const path = window.location.pathname;
  
  if (path === '/admin/login') {
    return <AdminLogin />;
  }
  
  if (path === '/admin') {
    return <AdminDashboard />;
  }
  
  // Main app for non-admin routes
  return (
    <>
      <Header />
      <Home />
      <Footer />
    </>
  );
}

const rootElement = document.getElementById('app');
if (rootElement) {
  createRoot(rootElement).render(<App />);
}
