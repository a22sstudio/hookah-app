import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, TrendingUp, Clock, Star } from 'lucide-react';
import { getMixes } from '../api';
import MixCard from '../components/MixCard';
import { PageLoader } from '../components/Loader';
import { Button } from '../components/ui';

const sortOptions = [
  { value: 'popular', label: 'Популярные', icon: TrendingUp },
  { value: 'new', label: 'Новые', icon: Clock },
  { value: 'rating', label: 'По рейтингу', icon: Star },
];

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
    <div className="px-4 py-6 animate-fade-in">
      {/* Header */}
      <header className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-heading text-title-1 text-text-primary mb-1">
            Миксы
          </h1>
          <p className="text-subheadline text-text-secondary">
            {mixes?.length || 0} миксов
          </p>
        </div>
        
        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => navigate('/mixes/create')}
        >
          Создать
        </Button>
      </header>

      {/* Sort Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {sortOptions.map((option) => {
          const Icon = option.icon;
          const isActive = currentSort === option.value;
          
          return (
            <button
              key={option.value}
              onClick={() => setSearchParams({ sort: option.value })}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-ios-xl text-subheadline font-medium transition-all press-effect flex-shrink-0 ${
                isActive
                  ? 'bg-accent-green text-white shadow-ios-glow'
                  : 'bg-surface-solid border border-border text-text-secondary'
              }`}
            >
              <Icon size={16} />
              {option.label}
            </button>
          );
        })}
      </div>

      {/* Mixes List */}
      {mixes && mixes.length > 0 ? (
        <div className="flex flex-col gap-4">
          {mixes.map((mix) => (
            <MixCard key={mix.id} mix={mix} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface-elevated flex items-center justify-center">
            <Plus size={32} className="text-text-tertiary" />
          </div>
          <p className="text-text-secondary text-body mb-4">
            Пока нет миксов
          </p>
          <Button
            variant="primary"
            onClick={() => navigate('/mixes/create')}
          >
            Создать первый микс
          </Button>
        </div>
      )}
    </div>
  );
}
