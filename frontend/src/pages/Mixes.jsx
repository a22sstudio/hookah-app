import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, TrendingUp, Clock, Star, Heart, ShoppingBag, Flame } from 'lucide-react';
import { getMixes } from '../api';
import { Card, Button, Badge } from '../components/ui';
import { PageLoader } from '../components/Loader';

const sortOptions = [
  { value: 'popular', label: 'Популярные', icon: TrendingUp },
  { value: 'new', label: 'Новые', icon: Clock },
  { value: 'rating', label: 'По рейтингу', icon: Star },
];

const strengthConfig = {
  LIGHT: { label: 'Лёгкий', color: 'green' },
  MEDIUM: { label: 'Средний', color: 'orange' },
  STRONG: { label: 'Крепкий', color: 'red' },
};

export default function Mixes() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentSort = searchParams.get('sort') || 'popular';

  const { data: mixes, isLoading } = useQuery({
    queryKey: ['mixes', currentSort],
    queryFn: () => getMixes({ sort: currentSort }),
  });

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between mb-6"
      >
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Миксы</h1>
          <p className="text-zinc-500">{mixes?.length || 0} миксов</p>
        </div>
        
        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => navigate('/mixes/create')}
        >
          Создать
        </Button>
      </motion.header>

      {/* Sort Tabs */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide"
      >
        {sortOptions.map((option) => {
          const Icon = option.icon;
          const isActive = currentSort === option.value;
          
          return (
            <button
              key={option.value}
              onClick={() => setSearchParams({ sort: option.value })}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              <Icon size={16} />
              {option.label}
            </button>
          );
        })}
      </motion.div>

      {/* Mixes List */}
      {mixes && mixes.length > 0 ? (
        <div className="space-y-4">
          {mixes.map((mix, index) => {
            const strength = strengthConfig[mix.userStrength] || strengthConfig.MEDIUM;
            const rating = mix.likesCount - mix.dislikesCount;
            
            return (
              <motion.div
                key={mix.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
              >
                <Card
                  variant="default"
                  padding="none"
                  hover
                  onClick={() => navigate(`/mixes/${mix.id}`)}
                  className="overflow-hidden"
                >
                  {/* Top gradient line */}
                  <div className="h-1 bg-gradient-to-r from-emerald-500 to-emerald-600" />
                  
                  <div className="p-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className="font-semibold text-white line-clamp-2">{mix.name}</h3>
                      <Badge variant={strength.color} className="flex-shrink-0">
                        <Flame size={12} className="mr-1" />
                        {strength.label}
                      </Badge>
                    </div>

                    {/* Ingredients */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {mix.ingredients?.slice(0, 3).map((ing, i) => (
                        <span
                          key={i}
                          className="text-xs bg-zinc-800 text-zinc-400 px-2.5 py-1 rounded-lg"
                        >
                          {ing.flavor?.name} · {ing.percentage}%
                        </span>
                      ))}
                      {mix.ingredients?.length > 3 && (
                        <span className="text-xs text-zinc-600 px-2 py-1">
                          +{mix.ingredients.length - 3}
                        </span>
                      )}
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
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-zinc-900 flex items-center justify-center">
            <Plus size={32} className="text-zinc-600" />
          </div>
          <p className="text-zinc-500 mb-4">Пока нет миксов</p>
          <Button
            variant="primary"
            onClick={() => navigate('/mixes/create')}
          >
            Создать первый микс
          </Button>
        </motion.div>
      )}
    </div>
  );
}
