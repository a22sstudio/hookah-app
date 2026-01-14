import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { getFlavors, getBrands, getTags } from '../api';
import FlavorCard from '../components/FlavorCard';
import { PageLoader } from '../components/Loader';
import { Badge } from '../components/ui';

const tagLabels = {
  SWEET: 'Сладкий',
  SOUR: 'Кислый',
  FRESH: 'Свежий',
  FRUITY: 'Фруктовый',
  BERRY: 'Ягодный',
  CITRUS: 'Цитрус',
  MINT: 'Мята',
  ICE: 'Лёд',
  TROPICAL: 'Тропик',
  CREAMY: 'Сливочный',
  DESSERT: 'Десерт',
  SPICY: 'Пряный',
};

export default function Flavors() {
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

  // Filter flavors
  const filteredFlavors = useMemo(() => {
    if (!flavors) return [];
    
    return flavors.filter((flavor) => {
      // Search filter
      if (search) {
        const searchLower = search.toLowerCase();
        const matchesName = flavor.name.toLowerCase().includes(searchLower);
        const matchesBrand = flavor.brand?.name.toLowerCase().includes(searchLower);
        if (!matchesName && !matchesBrand) return false;
      }
      
      // Brand filter
      if (brandFilter && flavor.brand?.slug !== brandFilter) {
        return false;
      }
      
      // Tag filter
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
    <div className="px-4 py-6 animate-fade-in">
      {/* Header */}
      <header className="mb-6">
        <h1 className="font-heading text-title-1 text-text-primary mb-1">
          Вкусы
        </h1>
        <p className="text-subheadline text-text-secondary">
          {filteredFlavors.length} вкусов
        </p>
      </header>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск вкусов..."
          className="w-full bg-surface-solid border border-border rounded-ios-xl py-3 pl-11 pr-4 text-body text-text-primary placeholder:text-text-tertiary focus:border-accent-green/50 transition-colors"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary press-effect"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Filter Toggles */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-subheadline font-medium transition-colors press-effect flex-shrink-0 ${
            showFilters 
              ? 'bg-accent-green text-white' 
              : 'bg-surface-solid border border-border text-text-secondary'
          }`}
        >
          <SlidersHorizontal size={16} />
          Фильтры
        </button>
        
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-4 py-2 rounded-full bg-accent-red/15 text-accent-red text-subheadline font-medium press-effect flex-shrink-0"
          >
            <X size={14} />
            Сбросить
          </button>
        )}
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="mb-6 p-4 bg-surface-solid rounded-ios-xl border border-border animate-fade-in">
          {/* Brands */}
          <div className="mb-4">
            <p className="text-caption-1 text-text-secondary mb-2 font-medium">Бренд</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSearchParams(prev => { prev.delete('brand'); return prev; })}
                className={`px-3 py-1.5 rounded-full text-caption-1 font-medium transition-colors press-effect ${
                  !brandFilter 
                    ? 'bg-accent-green text-white' 
                    : 'bg-surface-elevated text-text-secondary'
                }`}
              >
                Все
              </button>
              {brands?.map((brand) => (
                <button
                  key={brand.id}
                  onClick={() => setSearchParams(prev => { prev.set('brand', brand.slug); return prev; })}
                  className={`px-3 py-1.5 rounded-full text-caption-1 font-medium transition-colors press-effect ${
                    brandFilter === brand.slug 
                      ? 'bg-accent-green text-white' 
                      : 'bg-surface-elevated text-text-secondary'
                  }`}
                >
                  {brand.name}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <p className="text-caption-1 text-text-secondary mb-2 font-medium">Вкус</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSearchParams(prev => { prev.delete('tag'); return prev; })}
                className={`px-3 py-1.5 rounded-full text-caption-1 font-medium transition-colors press-effect ${
                  !tagFilter 
                    ? 'bg-accent-green text-white' 
                    : 'bg-surface-elevated text-text-secondary'
                }`}
              >
                Все
              </button>
              {Object.entries(tagLabels).map(([tag, label]) => (
                <button
                  key={tag}
                  onClick={() => setSearchParams(prev => { prev.set('tag', tag); return prev; })}
                  className={`px-3 py-1.5 rounded-full text-caption-1 font-medium transition-colors press-effect ${
                    tagFilter === tag 
                      ? 'bg-accent-green text-white' 
                      : 'bg-surface-elevated text-text-secondary'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Flavors List */}
      {filteredFlavors.length > 0 ? (
        <div className="flex flex-col gap-3">
          {filteredFlavors.map((flavor) => (
            <FlavorCard key={flavor.id} flavor={flavor} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-text-secondary text-body mb-4">
            Вкусы не найдены
          </p>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-accent-green text-subheadline font-medium press-effect"
            >
              Сбросить фильтры
            </button>
          )}
        </div>
      )}
    </div>
  );
}
