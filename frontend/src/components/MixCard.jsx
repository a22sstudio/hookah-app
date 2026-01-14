import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Flame } from 'lucide-react';
import { Card, Badge } from './ui';

const strengthConfig = {
  LIGHT: { label: 'Лёгкий', color: 'green' },
  MEDIUM: { label: 'Средний', color: 'orange' },
  STRONG: { label: 'Крепкий', color: 'red' },
};

export default function MixCard({ mix }) {
  const navigate = useNavigate();
  const strength = strengthConfig[mix.userStrength] || strengthConfig.MEDIUM;
  
  const rating = mix.likesCount - mix.dislikesCount;

  return (
    <Card
      variant="default"
      padding="none"
      onClick={() => navigate(`/mixes/${mix.id}`)}
      className="overflow-hidden group"
    >
      {/* Header gradient */}
      <div className="h-2 gradient-accent opacity-60" />
      
      <div className="p-4">
        {/* Title and strength */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="font-heading font-semibold text-headline text-text-primary line-clamp-2">
            {mix.name}
          </h3>
          <Badge variant={strength.color} className="flex-shrink-0">
            <Flame size={12} className="mr-1" />
            {strength.label}
          </Badge>
        </div>

        {/* Ingredients */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {mix.ingredients?.slice(0, 3).map((ing, index) => (
            <span
              key={index}
              className="text-caption-1 bg-surface-elevated text-text-secondary px-2.5 py-1 rounded-full"
            >
              {ing.flavor?.name || 'Вкус'} · {ing.percentage}%
            </span>
          ))}
          {mix.ingredients?.length > 3 && (
            <span className="text-caption-1 text-text-tertiary px-2 py-1">
              +{mix.ingredients.length - 3}
            </span>
          )}
        </div>

        {/* Footer stats */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-4">
            {/* Likes */}
            <div className="flex items-center gap-1.5">
              <Heart 
                size={16} 
                className={rating > 0 ? 'text-accent-red fill-accent-red' : 'text-text-tertiary'} 
              />
              <span className={`text-subheadline font-medium ${
                rating > 0 ? 'text-accent-red' : 'text-text-tertiary'
              }`}>
                {rating > 0 ? `+${rating}` : rating}
              </span>
            </div>
            
            {/* Orders */}
            <div className="flex items-center gap-1.5">
              <ShoppingBag size={16} className="text-text-tertiary" />
              <span className="text-subheadline text-text-tertiary">
                {mix.ordersCount || 0}
              </span>
            </div>
          </div>

          {/* Author */}
          <span className="text-caption-1 text-text-tertiary">
            {mix.author?.firstName || 'Аноним'}
          </span>
        </div>
      </div>
    </Card>
  );
}
