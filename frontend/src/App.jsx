import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TelegramProvider } from './context/TelegramContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Flavors from './pages/Flavors';
import FlavorDetail from './pages/FlavorDetail';
import Mixes from './pages/Mixes';
import MixDetail from './pages/MixDetail';
import CreateMix from './pages/CreateMix';
import Profile from './pages/Profile';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TelegramProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="flavors" element={<Flavors />} />
              <Route path="flavors/:id" element={<FlavorDetail />} />
              <Route path="mixes" element={<Mixes />} />
              <Route path="mixes/create" element={<CreateMix />} />
              <Route path="mixes/:id" element={<MixDetail />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TelegramProvider>
    </QueryClientProvider>
  );
}
