import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, TrendingUp, Leaf } from 'lucide-react';
import { getBrands, getMixes } from '../api';
import BrandCard from '../components/BrandCard';
import MixCard from '../components/MixCard';
import Loader from '../components/Loader';
import { useTelegram } from '../hooks/useTelegram';

const Home = () => {
  const navigate = useNavigate();
  const { user, hapticFeedback } = useTelegram();
  const [brands, setBrands] = useState([]);
  const [popularMixes, setPopularMixes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandsData, mixesData] = await Promise.all([
          getBrands(),
          getMixes({ sort: 'popular' }),
        ]);
        setBrands(brandsData.slice(0, 4));
        setPopularMixes(mixesData.slice(0, 3));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleNavigate = (path) => {
    hapticFeedback('impact', 'light');
    navigate(path);
  };

  if (loading) return <Loader />;

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">
          Привет, {user?.first_name || 'Гость'}! 👋
        </h1>
        <p className="text-gray-400">
          Выбери вкус или создай свой микс
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <button
          onClick={() => handleNavigate('/flavors')}
          className="p-4 bg-gradient-to-br from-hookah-primary/20 to-hookah-primary/5 
                     rounded-2xl border border-hookah-primary/20 text-left
                     hover:border-hookah-primary/40 transition-all"
        >
          <Search className="text-hookah-primary mb-2" size={24} />
          <h3 className="font-semibold text-white">Все вкусы</h3>
          <p className="text-xs text-gray-400 mt-1">Каталог табаков</p>
        </button>

        <button
          onClick={() => handleNavigate('/create-mix')}
          className="p-4 bg-gradient-to-br from-hookah-secondary/20 to-hookah-secondary/5 
                     rounded-2xl border border-hookah-secondary/20 text-left
                     hover:border-hookah-secondary/40 transition-all"
        >
          <Sparkles className="text-hookah-secondary mb-2" size={24} />
          <h3 className="font-semibold text-white">Создать микс</h3>
          <p className="text-xs text-gray-400 mt-1">Свой рецепт</p>
        </button>
      </div>

      {/* Brands Section */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Leaf size={20} className="text-hookah-primary" />
            Бренды
          </h2>
          <button
            onClick={() => handleNavigate('/flavors')}
            className="text-sm text-hookah-primary"
          >
            Все →
          </button>
        </div>
        <div className="space-y-3">
          {brands.map((brand) => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </div>
      </section>

      {/* Popular Mixes */}
      {popularMixes.length > 0 && (
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <TrendingUp size={20} className="text-hookah-accent" />
              Популярные миксы
            </h2>
            <button
              onClick={() => handleNavigate('/mixes')}
              className="text-sm text-hookah-primary"
            >
              Все →
            </button>
          </div>
          <div className="space-y-3">
            {popularMixes.map((mix) => (
              <MixCard key={mix.id} mix={mix} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
