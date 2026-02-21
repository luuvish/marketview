import { HashRouter, Routes, Route } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Dashboard } from '@/pages/Dashboard';
import { StocksPage } from '@/pages/StocksPage';
import { KoreanMarketPage } from '@/pages/KoreanMarketPage';
import { CryptoPage } from '@/pages/CryptoPage';
import { ForexPage } from '@/pages/ForexPage';
import { MetalsPage } from '@/pages/MetalsPage';
import { SettingsPage } from '@/pages/SettingsPage';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="stocks" element={<StocksPage />} />
          <Route path="korean" element={<KoreanMarketPage />} />
          <Route path="crypto" element={<CryptoPage />} />
          <Route path="forex" element={<ForexPage />} />
          <Route path="metals" element={<MetalsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
