import { useEffect, useState } from 'react';
import { getMixes } from '../api';
import MixCard from '../components/MixCard';
import Loader from '../components/Loader';
import { TrendingUp, Clock, Star } from 'lucide-react';

const Mixes = () => {
  const [mixes, setMixes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('popular');

  useEffect(() => {
    const fetchMixes = async () => {
      setLoading(true);
      try {
        const data = await getMixes({ sort });
        setMixes(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMixes();
  }, [sort]);

  const sortOptions = [
    { value: 'popular', label: 'Популярные', icon: TrendingUp },
    { value: 'new', label: 'Новые', icon: Clock },
    { value: 'rating', label: 'По рейтингу', icon: Star },
  ];

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-white mb-6">✨ Миксы</h1>

      {/* Sort Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {sortOptions.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setSort(value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium 
                        whitespace-nowrap transition-all
              ${sort === value
                ? 'bg-hookah-primary text-white'
                : 'bg-hookah-card text-gray-400 hover:text-white'
              }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* Mixes List */}
      {loading ? (
        <Loader />
      ) : mixes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">Пока нет миксов</p>
          <p className="text-sm text-gray-500 mt-2">
            Будь первым — создай свой микс!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {mixes.map((mix) => (
            <MixCard key={mix.id} mix={mix} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Mixes;
