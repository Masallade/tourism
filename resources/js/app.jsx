import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import CountryDetail from './components/CountryDetail';
import ThemeDetail from './components/ThemeDetail';
import '../css/app.css';
import './bootstrap';

import ServiceProviderDashboard from './components/ServiceProviderDashboard';

function App() {
  const [provider, setProvider] = React.useState(null);
  
  // Common layout for frontend pages with header and footer
  const Layout = ({ children }) => (
    <>
      <Header setProvider={setProvider} />
      {children}
     
    </>
  );

  // If provider is logged in, show dashboard only
  if (provider) {
    return <ServiceProviderDashboard provider={provider} />;
  }

  return (
    <Router>
      <Routes>
        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        
        {/* Main frontend routes */}
        <Route path="/" element={
          <Layout>
            <Home />
          </Layout>
        } />
        
        {/* Detail pages */}
        <Route path="/country/:id" element={
          <Layout>
            <CountryDetail />
          </Layout>
        } />
        
        <Route path="/theme/:id" element={
          <Layout>
            <ThemeDetail />
          </Layout>
        } />
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

const rootElement = document.getElementById('app');
if (rootElement) {
  createRoot(rootElement).render(<App />);
}