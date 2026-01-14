import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TelegramProvider } from './context/TelegramContext';
import Layout from './components/Layout';

// Pages
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
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TelegramProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/flavors" element={<Flavors />} />
              <Route path="/flavors/:id" element={<FlavorDetail />} />
              <Route path="/mixes" element={<Mixes />} />
              <Route path="/mixes/:id" element={<MixDetail />} />
              <Route path="/create-mix" element={<CreateMix />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TelegramProvider>
    </QueryClientProvider>
  );
}

export default App;
