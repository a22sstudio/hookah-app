import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Sparkles, TrendingUp, Flame } from 'lucide-react';
import { getBrands, getMixes } from '../api';
import { Card, Button, Badge } from '../components/ui';
import BrandCard from '../components/BrandCard';
import MixCard from '../components/MixCard';
import { PageLoader } from '../components/Loader';

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
    <div className="px-4 py-6 animate-fade-in">
      {/* Header */}
      <header className="mb-8">
        <h1 className="font-heading text-display text-text-primary mb-2">
          Кальянная
        </h1>
        <p className="text-body text-text-secondary">
          Выбери идеальный микс для себя
        </p>
      </header>

      {/* Quick Actions */}
      <section className="mb-8">
        <div className="grid grid-cols-2 gap-3">
          <Card
            variant="elevated"
            padding="default"
            onClick={() => navigate('/mixes/create')}
            className="relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-accent-green/10 rounded-full blur-2xl" />
            <div className="relative">
              <div className="w-10 h-10 rounded-ios-lg bg-accent-green/15 flex items-center justify-center mb-3">
                <Sparkles size={20} className="text-accent-green" />
              </div>
              <h3 className="font-heading font-semibold text-headline text-text-primary">
                Создать микс
              </h3>
              <p className="text-caption-1 text-text-secondary mt-1">
                Собери свой вкус
              </p>
            </div>
          </Card>

          <Card
            variant="elevated"
            padding="default"
            onClick={() => navigate('/mixes?sort=popular')}
            className="relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-accent-orange/10 rounded-full blur-2xl" />
            <div className="relative">
              <div className="w-10 h-10 rounded-ios-lg bg-accent-orange/15 flex items-center justify-center mb-3">
                <TrendingUp size={20} className="text-accent-orange" />
              </div>
              <h3 className="font-heading font-semibold text-headline text-text-primary">
                Популярное
              </h3>
              <p className="text-caption-1 text-text-secondary mt-1">
                Топ миксов
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Popular Mixes */}
      {popularMixes.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-bold text-title-3 text-text-primary">
              🔥 Популярные миксы
            </h2>
            <button 
              onClick={() => navigate('/mixes')}
              className="flex items-center gap-1 text-accent-green text-subheadline font-medium press-effect"
            >
              Все
              <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="flex flex-col gap-3">
            {popularMixes.map((mix) => (
              <MixCard key={mix.id} mix={mix} />
            ))}
          </div>
        </section>
      )}

      {/* Brands */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-bold text-title-3 text-text-primary">
            🏷️ Бренды
          </h2>
          <button 
            onClick={() => navigate('/flavors')}
            className="flex items-center gap-1 text-accent-green text-subheadline font-medium press-effect"
          >
            Все вкусы
            <ChevronRight size={16} />
          </button>
        </div>
        
        <div className="flex flex-col gap-3">
          {brands?.map((brand) => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </div>
      </section>
    </div>
  );
}
