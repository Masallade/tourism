import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import AdminDashboardHome from './components/admin/AdminDashboardHome';
import CountriesList from './components/admin/CountriesList';
import ThemesList from './components/admin/ThemesList';
import ServiceProvidersList from './components/admin/ServiceProvidersList';
import UserLogin from './components/UserLogin';
import UserSignup from './components/UserSignup';
import UserProfile from './components/UserProfile';
import CountryDetail from './components/CountryDetail';
import ThemeDetail from './components/ThemeDetail';
import ServiceDetail from './components/ServiceDetail';
import AIAssistance from './components/AIAssistance';
import About from './components/About';
import Contact from './components/Contact';
import Trips from './components/Trips';
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
        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<AdminDashboardHome />} />
          <Route path="countries" element={<CountriesList />} />
          <Route path="themes" element={<ThemesList />} />
          <Route path="service-providers" element={<ServiceProvidersList />} />
        </Route>
        
        {/* User authentication routes */}
        <Route path="/login" element={<UserLogin />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/profile" element={
          <Layout>
            <UserProfile />
          </Layout>
        } />
        
        {/* Main frontend routes */}
        <Route path="/" element={
          <Layout>
            <Home />
          </Layout>
        } />
        
        {/* Detail pages - support both ID and slug */}
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
        
        <Route path="/service/:serviceId" element={
          <Layout>
            <ServiceDetail />
          </Layout>
        } />
        
        {/* Trips page */}
        <Route path="/trips" element={
          <Layout>
            <Trips />
          </Layout>
        } />
        
        {/* AI Assistance page */}
        <Route path="/ai-assistance" element={
          <Layout>
            <AIAssistance />
          </Layout>
        } />
        
        {/* About page */}
        <Route path="/about" element={
          <Layout>
            <About />
          </Layout>
        } />
        
        {/* Contact page */}
        <Route path="/contact" element={
          <Layout>
            <Contact />
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