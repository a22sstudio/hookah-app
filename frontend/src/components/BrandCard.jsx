import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Card, Badge } from './ui';

export default function BrandCard({ brand }) {
  const navigate = useNavigate();

  return (
    <Card
      variant="default"
      padding="none"
      onClick={() => navigate(`/flavors?brand=${brand.slug}`)}
      className="overflow-hidden group"
    >
      <div className="flex items-center gap-4 p-4">
        {/* Logo */}
        <div className="w-14 h-14 rounded-ios-lg bg-surface-elevated flex items-center justify-center overflow-hidden flex-shrink-0">
          {brand.logo ? (
            <img 
              src={brand.logo} 
              alt={brand.name}
              className="w-10 h-10 object-contain"
            />
          ) : (
            <span className="text-title-3 font-heading font-bold text-accent-green">
              {brand.name.charAt(0)}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-semibold text-headline text-text-primary truncate">
            {brand.name}
          </h3>
          <p className="text-subheadline text-text-secondary mt-0.5">
            {brand._count?.flavors || 0} вкусов
          </p>
        </div>

        {/* Arrow */}
        <ChevronRight 
          size={20} 
          className="text-text-tertiary group-hover:text-text-secondary transition-colors flex-shrink-0" 
        />
      </div>
    </Card>
  );
}
