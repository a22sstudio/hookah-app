import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Flame, Tag } from 'lucide-react';
import { getFlavorById } from '../api';
import { Card, Badge } from '../components/ui';
import { PageLoader } from '../components/Loader';

const strengthConfig = {
  LIGHT: { label: 'Лёгкий', color: 'green' },
  MEDIUM: { label: 'Средний', color: 'orange' },
  STRONG: { label: 'Крепкий', color: 'red' },
};

export default function FlavorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: flavor, isLoading } = useQuery({
    queryKey: ['flavor', id],
    queryFn: () => getFlavorById(id),
  });

  if (isLoading) return <PageLoader />;
  if (!flavor) return <div className="p-4 text-center">Вкус не найден</div>;

  const strength = strengthConfig[flavor.strength] || strengthConfig.MEDIUM;

  return (
    <div className="min-h-screen bg-dark animate-fade-in">
      {/* Header Image / Pattern */}
      <div className="h-48 bg-surface-elevated relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-dark" />
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <span className="text-[120px] font-bold text-white">{flavor.name.charAt(0)}</span>
        </div>
        
        {/* Nav */}
        <div className="absolute top-0 left-0 right-0 p-4 safe-top flex items-center">
          <button 
            onClick={() => navigate(-1)} 
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white press-effect"
          >
            <ArrowLeft size={20} />
          </button>
        </div>
      </div>

      <div className="px-4 -mt-12 relative z-10">
        <div className="flex justify-between items-end mb-4">
          <div className="w-24 h-24 rounded-ios-xl bg-surface-elevated border-4 border-dark flex items-center justify-center shadow-lg">
             {flavor.brand.logo ? (
                <img src={flavor.brand.logo} alt="" className="w-16 h-16 object-contain" />
             ) : (
                <span className="text-3xl font-bold text-accent-green">{flavor.brand.name.charAt(0)}</span>
             )}
          </div>
          <Badge variant={strength.color} className="mb-4 px-3 py-1.5 text-body">
            <Flame size={16} className="mr-1.5" />
            {strength.label}
          </Badge>
        </div>

        <h1 className="font-heading text-display text-text-primary mb-2">
          {flavor.name}
        </h1>
        <p className="text-title-3 text-text-secondary mb-6">
          {flavor.brand.name}
        </p>

        {flavor.description && (
          <div className="mb-8">
            <h3 className="font-heading font-semibold text-headline mb-2">Описание</h3>
            <p className="text-body text-text-secondary leading-relaxed">
              {flavor.description}
            </p>
          </div>
        )}

        {/* Tags */}
        <div className="mb-8">
          <h3 className="font-heading font-semibold text-headline mb-3 flex items-center gap-2">
            <Tag size={18} />
            Характеристики
          </h3>
          <div className="flex flex-wrap gap-2">
            {flavor.flavorProfile?.map((tag) => (
              <span 
                key={tag}
                className="px-4 py-2 rounded-full bg-surface-elevated text-text-secondary text-subheadline border border-border"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
