import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import NotificationDrawer from './components/layout/NotificationDrawer';
import FloatingCopilot from './components/common/FloatingCopilot';

import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import InfoPage from './pages/InfoPage';
import DemoPage from './pages/DemoPage';
import CitizenDashboardPage from './pages/CitizenDashboardPage';
import SmartReportPage from './pages/SmartReportPage';
import ExploreIssuesPage from './pages/ExploreIssuesPage';
import IssueDetailPage from './pages/IssueDetailPage';
import CivicHeatmapPage from './pages/CivicHeatmapPage';
import CommandCenterPage from './pages/CommandCenterPage';
import CivicCopilotPage from './pages/CivicCopilotPage';
import ProfilePage from './pages/ProfilePage';

function MainApp() {
  const [currentPath, setCurrentPath] = useState(window.location.hash ? window.location.hash.replace('#', '') : '/');

  // Handle browser back/forward buttons
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || '/';
      setCurrentPath(hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (path) => {
    window.location.hash = path;
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Route resolver
  const renderCurrentPage = () => {
    if (currentPath === '/' || currentPath === '') {
      return <LandingPage setRoute={navigateTo} />;
    }
    if (currentPath === '/login') {
      return <LoginPage setRoute={navigateTo} />;
    }
    if (currentPath === '/register') {
      return <RegisterPage setRoute={navigateTo} />;
    }
    if (currentPath === '/auth') {
      return <LoginPage setRoute={navigateTo} />;
    }
    if (currentPath === '/info' || currentPath === '/about') {
      return <InfoPage setRoute={navigateTo} />;
    }
    if (currentPath === '/demo' || currentPath === '/walkthrough') {
      return <DemoPage setRoute={navigateTo} />;
    }
    if (currentPath === '/dashboard') {
      return <CitizenDashboardPage setRoute={navigateTo} />;
    }
    if (currentPath === '/report') {
      return <SmartReportPage setRoute={navigateTo} />;
    }
    if (currentPath === '/issues') {
      return <ExploreIssuesPage setRoute={navigateTo} />;
    }
    if (currentPath.startsWith('/issues/')) {
      const id = currentPath.replace('/issues/', '');
      return <IssueDetailPage issueId={id} setRoute={navigateTo} />;
    }
    if (currentPath === '/map') {
      return <CivicHeatmapPage setRoute={navigateTo} />;
    }
    if (currentPath === '/admin' || currentPath === '/admin/issues') {
      return <CommandCenterPage setRoute={navigateTo} />;
    }
    if (currentPath === '/assistant') {
      return <CivicCopilotPage setRoute={navigateTo} />;
    }
    if (currentPath === '/profile') {
      return <ProfilePage setRoute={navigateTo} />;
    }

    // Default fallback
    return <LandingPage setRoute={navigateTo} />;
  };

  // Extract current issue ID if on issue detail page for contextual copilot
  const currentIssueId = currentPath.startsWith('/issues/') ? currentPath.replace('/issues/', '') : null;

  return (
    <div className="min-h-screen bg-navy-900 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-navy-900">
      <Navbar currentPath={currentPath} setRoute={navigateTo} />
      
      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      {/* Hide footer on full map view for optimal viewports */}
      {currentPath !== '/map' && <Footer setRoute={navigateTo} />}

      {/* Persistent In-App Notification Drawer */}
      <NotificationDrawer setRoute={navigateTo} />

      {/* Persistent Floating "✨ Ask Civic Lens" Copilot */}
      <FloatingCopilot currentIssueId={currentIssueId} setRoute={navigateTo} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <MainApp />
      </NotificationProvider>
    </AuthProvider>
  );
}
