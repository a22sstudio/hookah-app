import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame } from 'lucide-react';
import { Card, Badge } from './ui';

const strengthConfig = {
  LIGHT: { label: 'Лёгкий', color: 'green', dots: 1 },
  MEDIUM: { label: 'Средний', color: 'orange', dots: 2 },
  STRONG: { label: 'Крепкий', color: 'red', dots: 3 },
};

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

export default function FlavorCard({ flavor, showBrand = true }) {
  const navigate = useNavigate();
  const strength = strengthConfig[flavor.strength] || strengthConfig.MEDIUM;

  return (
    <Card
      variant="default"
      padding="default"
      onClick={() => navigate(`/flavors/${flavor.id}`)}
      className="group"
    >
      <div className="flex items-start gap-3">
        {/* Strength indicator */}
        <div className={`
          w-10 h-10 rounded-ios-lg flex items-center justify-center flex-shrink-0
          ${strength.color === 'green' ? 'bg-accent-green/15' : ''}
          ${strength.color === 'orange' ? 'bg-accent-orange/15' : ''}
          ${strength.color === 'red' ? 'bg-accent-red/15' : ''}
        `}>
          <Flame 
            size={20} 
            className={`
              ${strength.color === 'green' ? 'text-accent-green' : ''}
              ${strength.color === 'orange' ? 'text-accent-orange' : ''}
              ${strength.color === 'red' ? 'text-accent-red' : ''}
            `}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-heading font-semibold text-headline text-text-primary truncate">
                {flavor.name}
              </h3>
              {showBrand && flavor.brand && (
                <p className="text-subheadline text-text-secondary mt-0.5">
                  {flavor.brand.name}
                </p>
              )}
            </div>
            
            {/* Strength badge */}
            <Badge variant={strength.color} className="flex-shrink-0">
              {strength.label}
            </Badge>
          </div>

          {/* Tags */}
          {flavor.flavorProfile && flavor.flavorProfile.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {flavor.flavorProfile.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-caption-1 text-text-tertiary bg-surface-elevated px-2 py-0.5 rounded-full"
                >
                  {tagLabels[tag] || tag}
                </span>
              ))}
              {flavor.flavorProfile.length > 3 && (
                <span className="text-caption-1 text-text-tertiary">
                  +{flavor.flavorProfile.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
