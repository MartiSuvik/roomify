import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/contexts/ThemeProvider';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Layout } from '@/components/Layout/Layout';
import { ProtectedRoute } from '@/components/Auth/ProtectedRoute';
import { HomePage } from '@/pages/HomePage';
import { ChatPage } from '@/pages/ChatPage';
import { StylizePage } from '@/pages/StylizePage';
import { PricingPage } from '@/pages/PricingPage';
import { SignInPage } from '@/pages/SignInPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { SuccessPage } from '@/pages/SuccessPage';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <ThemeProvider defaultTheme="light">
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
      <Router>
        <div className="min-h-screen bg-background text-foreground">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="chat" element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              } />
              <Route path="stylize" element={
                <ProtectedRoute>
                  <StylizePage />
                </ProtectedRoute>
              } />
              <Route path="settings" element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              } />
              <Route path="pricing" element={<PricingPage />} />
              <Route path="signin" element={<SignInPage />} />
              <Route path="success" element={<SuccessPage />} />
            </Route>
          </Routes>
          <Toaster position="top-center" />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;