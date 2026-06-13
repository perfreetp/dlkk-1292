import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { ExchangePage } from './pages/ExchangePage';
import { ProfilePage } from './pages/ProfilePage';
import { MessagesPage } from './pages/MessagesPage';
import { CreditPage } from './pages/CreditPage';
import { JobDetailPage } from './pages/JobDetailPage';
import { LoginPage } from './pages/LoginPage';
import { useUserStore } from './stores/userStore';
import { useCreditStore } from './stores/creditStore';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useUserStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  useEffect(() => {
    useUserStore.getState().initEventListeners();
    useCreditStore.getState().initEventListeners();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route path="/" element={<HomePage />} />
          <Route path="/exchange" element={<ExchangePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/credit" element={<CreditPage />} />
          <Route path="/job/:id" element={<JobDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
