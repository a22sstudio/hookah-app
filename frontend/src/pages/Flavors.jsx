import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, SlidersHorizontal, Flame, ChevronRight } from 'lucide-react';
import { getFlavors, getBrands } from '../api';
import { Card, Badge } from '../components/ui';
import { PageLoader } from '../components/Loader';

const strengthConfig = {
  LIGHT: { label: 'Лёгкий', color: 'green', icon: '🌱' },
  MEDIUM: { label: 'Средний', color: 'orange', icon: '🔥' },
  STRONG: { label: 'Крепкий', color: 'red', icon: '💥' },
};

const tagLabels = {
  SWEET: '🍬 Сладкий',
  SOUR: '🍋 Кислый',
  FRESH: '❄️ Свежий',
  FRUITY: '🍎 Фруктовый',
  BERRY: '🫐 Ягодный',
  CITRUS: '🍊 Цитрус',
  MINT: '🌿 Мята',
  ICE: '🧊 Лёд',
  TROPICAL: '🥭 Тропик',
  CREAMY: '🥛 Сливочный',
  DESSERT: '🍰 Десерт',
  SPICY: '🌶️ Пряный',
};

export default function Flavors() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const brandFilter = searchParams.get('brand') || '';
  const tagFilter = searchParams.get('tag') || '';

  const { data: flavors, isLoading: flavorsLoading } = useQuery({
    queryKey: ['flavors'],
    queryFn: () => getFlavors(),
  });

  const { data: brands } = useQuery({
    queryKey: ['brands'],
    queryFn: getBrands,
  });

  const filteredFlavors = useMemo(() => {
    if (!flavors) return [];
    
    return flavors.filter((flavor) => {
      if (search) {
        const searchLower = search.toLowerCase();
        const matchesName = flavor.name.toLowerCase().includes(searchLower);
        const matchesBrand = flavor.brand?.name.toLowerCase().includes(searchLower);
        if (!matchesName && !matchesBrand) return false;
      }
      
      if (brandFilter && flavor.brand?.slug !== brandFilter) {
        return false;
      }
      
      if (tagFilter && !flavor.flavorProfile?.includes(tagFilter)) {
        return false;
      }
      
      return true;
    });
  }, [flavors, search, brandFilter, tagFilter]);

  const clearFilters = () => {
    setSearch('');
    setSearchParams({});
  };

  const hasFilters = search || brandFilter || tagFilter;

  if (flavorsLoading) {
    return <PageLoader />;
  }

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-white mb-1">Вкусы</h1>
        <p className="text-zinc-500">{filteredFlavors.length} вкусов</p>
      </motion.header>

      {/* Search */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative mb-4"
      >
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск вкусов..."
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-zinc-600 focus:border-emerald-500/50 focus:outline-none transition-colors"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
          >
            <X size={18} />
          </button>
        )}
      </motion.div>

      {/* Filter Button */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex items-center gap-2 mb-4"
      >
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            showFilters 
              ? 'bg-emerald-500 text-white' 
              : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
          }`}
        >
          <SlidersHorizontal size={16} />
          Фильтры
        </button>
        
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-4 py-2 rounded-xl bg-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/30 transition-colors"
          >
            <X size={14} />
            Сбросить
          </button>
        )}
      </motion.div>

      {/* Expanded Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <Card variant="default" padding="default">
              {/* Brands */}
              <div className="mb-4">
                <p className="text-xs text-zinc-500 mb-2 font-medium uppercase tracking-wider">Бренд</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSearchParams(prev => { prev.delete('brand'); return prev; })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      !brandFilter 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    Все
                  </button>
                  {brands?.map((brand) => (
                    <button
                      key={brand.id}
                      onClick={() => setSearchParams(prev => { prev.set('brand', brand.slug); return prev; })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        brandFilter === brand.slug 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {brand.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <p className="text-xs text-zinc-500 mb-2 font-medium uppercase tracking-wider">Характеристики</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSearchParams(prev => { prev.delete('tag'); return prev; })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      !tagFilter 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    Все
                  </button>
                  {Object.entries(tagLabels).map(([tag, label]) => (
                    <button
                      key={tag}
                      onClick={() => setSearchParams(prev => { prev.set('tag', tag); return prev; })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        tagFilter === tag 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flavors List */}
      {filteredFlavors.length > 0 ? (
        <div className="space-y-3">
          {filteredFlavors.map((flavor, index) => {
            const strength = strengthConfig[flavor.strength] || strengthConfig.MEDIUM;
            
            return (
              <motion.div
                key={flavor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.03 * index }}
              >
                <Card
                  variant="default"
                  padding="default"
                  hover
                  onClick={() => navigate(`/flavors/${flavor.id}`)}
                >
                  <div className="flex items-start gap-3">
                    {/* Strength Icon */}
                    <div className={`
                      w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg
                      ${strength.color === 'green' ? 'bg-emerald-500/20' : ''}
                      ${strength.color === 'orange' ? 'bg-amber-500/20' : ''}
                      ${strength.color === 'red' ? 'bg-red-500/20' : ''}
                    `}>
                      {strength.icon}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="min-w-0">
                          <h3 className="font-medium text-white truncate">{flavor.name}</h3>
                          <p className="text-xs text-zinc-500">{flavor.brand?.name}</p>
                        </div>
                        <Badge variant={strength.color} className="flex-shrink-0">
                          {strength.label}
                        </Badge>
                      </div>

                      {/* Tags */}
                      {flavor.flavorProfile && flavor.flavorProfile.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {flavor.flavorProfile.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded"
                            >
                              {tagLabels[tag]?.split(' ')[1] || tag}
                            </span>
                          ))}
                          {flavor.flavorProfile.length > 3 && (
                            <span className="text-xs text-zinc-600">
                              +{flavor.flavorProfile.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <ChevronRight size={18} className="text-zinc-700 flex-shrink-0 mt-1" />
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-zinc-500 mb-4">Вкусы не найдены</p>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-emerald-400 text-sm font-medium hover:text-emerald-300"
            >
              Сбросить фильтры
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
}
