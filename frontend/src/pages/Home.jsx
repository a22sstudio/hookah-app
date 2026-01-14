import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Sparkles, TrendingUp, Flame, Heart, ShoppingBag } from 'lucide-react';
import { getBrands, getMixes } from '../api';
import { Card, Button, Badge } from '../components/ui';
import { PageLoader } from '../components/Loader';

const strengthConfig = {
  LIGHT: { label: 'Лёгкий', color: 'green' },
  MEDIUM: { label: 'Средний', color: 'orange' },
  STRONG: { label: 'Крепкий', color: 'red' },
};

export default function Home() {
  const navigate = useNavigate();
  
  const { data: brands, isLoading: brandsLoading } = useQuery({
    queryKey: ['brands'],
    queryFn: getBrands,
  });

  const { data: mixes, isLoading: mixesLoading } = useQuery({
    queryKey: ['mixes', 'popular'],
    queryFn: () => getMixes({ sort: 'popular' }),
  });

  if (brandsLoading || mixesLoading) {
    return <PageLoader />;
  }

  const popularMixes = mixes?.slice(0, 3) || [];

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-white mb-1">Кальянная</h1>
        <p className="text-zinc-500">Выбери идеальный микс для себя</p>
      </motion.header>

      {/* Quick Actions */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="grid grid-cols-2 gap-3">
          <Card
            variant="gradient"
            padding="lg"
            hover
            onClick={() => navigate('/mixes/create')}
            className="relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all" />
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-3">
                <Sparkles size={20} className="text-emerald-400" />
              </div>
              <h3 className="font-semibold text-white mb-1">Создать микс</h3>
              <p className="text-xs text-zinc-500">Собери свой вкус</p>
            </div>
          </Card>

          <Card
            variant="gradient"
            padding="lg"
            hover
            onClick={() => navigate('/mixes?sort=popular')}
            className="relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all" />
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center mb-3">
                <TrendingUp size={20} className="text-amber-400" />
              </div>
              <h3 className="font-semibold text-white mb-1">Популярное</h3>
              <p className="text-xs text-zinc-500">Топ миксов</p>
            </div>
          </Card>
        </div>
      </motion.section>

      {/* Popular Mixes */}
      {popularMixes.length > 0 && (
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>🔥</span> Популярные миксы
            </h2>
            <button 
              onClick={() => navigate('/mixes')}
              className="flex items-center gap-1 text-emerald-400 text-sm font-medium hover:text-emerald-300 transition-colors"
            >
              Все
              <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="space-y-3">
            {popularMixes.map((mix, index) => {
              const strength = strengthConfig[mix.userStrength] || strengthConfig.MEDIUM;
              const rating = mix.likesCount - mix.dislikesCount;
              
              return (
                <motion.div
                  key={mix.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card
                    variant="default"
                    padding="default"
                    hover
                    onClick={() => navigate(`/mixes/${mix.id}`)}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-white">{mix.name}</h3>
                      <Badge variant={strength.color}>
                        <Flame size={12} className="mr-1" />
                        {strength.label}
                      </Badge>
                    </div>

                    {/* Ingredients */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {mix.ingredients?.slice(0, 3).map((ing, i) => (
                        <span
                          key={i}
                          className="text-xs bg-zinc-800 text-zinc-400 px-2 py-1 rounded-lg"
                        >
                          {ing.flavor?.name} · {ing.percentage}%
                        </span>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                          <Heart 
                            size={14} 
                            className={rating > 0 ? 'text-pink-400 fill-pink-400' : 'text-zinc-600'} 
                          />
                          <span className={`text-sm ${rating > 0 ? 'text-pink-400' : 'text-zinc-600'}`}>
                            {rating > 0 ? `+${rating}` : rating}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <ShoppingBag size={14} className="text-zinc-600" />
                          <span className="text-sm text-zinc-600">{mix.ordersCount || 0}</span>
                        </div>
                      </div>
                      <span className="text-xs text-zinc-600">
                        {mix.author?.firstName || 'Аноним'}
                      </span>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.section>
      )}

      {/* Brands */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>🏷️</span> Бренды
          </h2>
          <button 
            onClick={() => navigate('/flavors')}
            className="flex items-center gap-1 text-emerald-400 text-sm font-medium hover:text-emerald-300 transition-colors"
          >
            Все вкусы
            <ChevronRight size={16} />
          </button>
        </div>
        
        <div className="space-y-2">
          {brands?.map((brand, index) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * index }}
            >
              <Card
                variant="default"
                padding="default"
                hover
                onClick={() => navigate(`/flavors?brand=${brand.slug}`)}
                className="flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-xl">
                  {brand.name === 'Darkside' && '🌑'}
                  {brand.name === 'Tangiers' && '🏺'}
                  {brand.name === 'Fumari' && ''}
                  {!['Darkside', 'Tangiers', 'Fumari'].includes(brand.name) && brand.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-white">{brand.name}</h3>
                  <p className="text-xs text-zinc-500">{brand._count?.flavors || 0} вкусов</p>
                </div>
                <ChevronRight size={18} className="text-zinc-600" />
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
