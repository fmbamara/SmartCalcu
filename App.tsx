
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Calculator from './pages/Calculator';
import Converter from './pages/Converter';
import History from './pages/History';
import Support from './pages/Support';
import Settings from './pages/Settings';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import { useTheme } from './hooks/useTheme';

function App() {
  const { theme } = useTheme();

  return (
    <HashRouter>
      <div className={`${theme} font-sans`}>
        <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <Header />
          <main className="flex-grow overflow-y-auto pb-20">
            <Routes>
              <Route path="/" element={<Calculator />} />
              <Route path="/converter" element={<Converter />} />
              <Route path="/history" element={<History />} />
              <Route path="/support" element={<Support />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
            </Routes>
          </main>
          <BottomNav />
        </div>
      </div>
    </HashRouter>
  );
}

export default App;
