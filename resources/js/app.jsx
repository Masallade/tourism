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
import ServiceTypesList from './components/admin/ServiceTypesList';
import ServiceProvidersList from './components/admin/ServiceProvidersList';
import AppSettings from './components/admin/AppSettings';
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
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsAndConditions from './components/TermsAndConditions';
import '../css/app.css';
import './bootstrap';

import ServiceProviderDashboard from './components/ServiceProviderDashboard';
import ServiceProviderLogin from './components/ServiceProviderLogin';

function App() {
  const STORAGE_KEY = 'serviceProvider';
  const [provider, setProvider] = React.useState(() => {
    if (typeof window === 'undefined') {
      return null;
    }
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return null;
    }
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.warn('Failed to parse stored provider data:', error);
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  });

  const handleProviderLogin = React.useCallback((providerData) => {
    setProvider(providerData);
  }, []);

  const handleProviderLogout = React.useCallback(() => {
    setProvider(null);
  }, []);

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    if (provider) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(provider));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, [provider]);

  const RequireProvider = ({ children }) => {
    if (!provider) {
      return <Navigate to="/provider/login" replace />;
    }
    return children;
  };
  
  // Common layout for frontend pages with header and footer
  const Layout = ({ children }) => (
    <>
      <Header
        onProviderLogin={handleProviderLogin}
        provider={provider}
      />
      {children}
      <Footer />
    </>
  );

  return (
    <Router>
      <Routes>
        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<AdminDashboardHome />} />
          <Route path="countries" element={<CountriesList />} />
          <Route path="themes" element={<ThemesList />} />
          <Route path="service-types" element={<ServiceTypesList />} />
          <Route path="service-providers" element={<ServiceProvidersList />} />
          <Route path="settings" element={<AppSettings />} />
        </Route>
        
        {/* User authentication routes */}
        <Route path="/login" element={<UserLogin />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route
          path="/provider/login"
          element={
            <Layout>
              <ServiceProviderLogin
                onLogin={(prov) => {
                  handleProviderLogin(prov);
                  return true;
                }}
              />
            </Layout>
          }
        />
        <Route
          path="/provider/dashboard"
          element={
            <RequireProvider>
              <ServiceProviderDashboard
                provider={provider}
                onLogout={handleProviderLogout}
              />
            </RequireProvider>
          }
        />
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
        
        {/* Privacy Policy page */}
        <Route path="/privacy-policy" element={
          <Layout>
            <PrivacyPolicy />
          </Layout>
        } />
        
        {/* Terms and Conditions page */}
        <Route path="/terms-and-conditions" element={
          <Layout>
            <TermsAndConditions />
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