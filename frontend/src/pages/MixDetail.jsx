import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Heart, ShoppingBag, Share2, Flame, User, ArrowLeft, Check } from 'lucide-react';
import { useTelegram } from '../hooks/useTelegram';
import { getMixById, mixAction } from '../api';
import { Button, Card, Badge } from '../components/ui';
import { PageLoader } from '../components/Loader';

const strengthConfig = {
  LIGHT: { label: 'Лёгкий', color: 'green', percent: 30 },
  MEDIUM: { label: 'Средний', color: 'orange', percent: 60 },
  STRONG: { label: 'Крепкий', color: 'red', percent: 90 },
};

export default function MixDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, tg } = useTelegram();
  const queryClient = useQueryClient();
  const [orderTable, setOrderTable] = useState('');

  const { data: mix, isLoading } = useQuery({
    queryKey: ['mix', id],
    queryFn: () => getMixById(id),
  });

  const actionMutation = useMutation({
    mutationFn: (data) => mixAction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['mix', id]);
      tg.HapticFeedback.notificationOccurred('success');
    },
  });

  if (isLoading) return <PageLoader />;
  if (!mix) return <div className="p-4 text-center">Микс не найден</div>;

  const strength = strengthConfig[mix.userStrength] || strengthConfig.MEDIUM;
  const rating = mix.likesCount - mix.dislikesCount;

  const handleAction = (type) => {
    if (!user) return;
    tg.HapticFeedback.impactOccurred('medium');
    
    if (type === 'ORDER') {
      const table = prompt('Введите номер столика:', orderTable);
      if (table) {
        setOrderTable(table);
        actionMutation.mutate({ userId: user.id, type, tableNumber: parseInt(table) });
        alert(`Микс "${mix.name}" заказан на столик ${table}!`);
      }
    } else {
      actionMutation.mutate({ userId: user.id, type });
    }
  };

  return (
    <div className="pb-24 animate-fade-in">
      {/* Navbar with back button */}
      <div className="sticky top-0 z-10 px-4 py-2 glass flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-text-primary press-effect">
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-heading font-semibold text-headline truncate flex-1">
          {mix.name}
        </h1>
        <button onClick={() => handleAction('ORDER')} className="text-accent-blue press-effect">
          <Share2 size={24} />
        </button>
      </div>

      <div className="px-4 py-6">
        {/* Header Card */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-surface-elevated mb-4 shadow-ios-glow">
            <Flame size={40} className={`text-accent-${strength.color}`} />
          </div>
          <h1 className="font-heading text-title-1 text-text-primary mb-2">
            {mix.name}
          </h1>
          <div className="flex items-center justify-center gap-2">
            <Badge variant={strength.color} className="text-subheadline px-3 py-1">
              {strength.label}
            </Badge>
            <span className="text-text-tertiary">•</span>
            <span className="text-text-secondary flex items-center gap-1">
              <User size={14} />
              {mix.author?.firstName || 'Аноним'}
            </span>
          </div>
          {mix.description && (
            <p className="mt-4 text-body text-text-secondary leading-relaxed">
              {mix.description}
            </p>
          )}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <Card variant="elevated" className="flex flex-col items-center justify-center py-4">
            <Heart size={24} className="text-accent-red mb-1" />
            <span className="font-bold text-title-3">{mix.likesCount}</span>
            <span className="text-caption-1 text-text-tertiary">Лайков</span>
          </Card>
          <Card variant="elevated" className="flex flex-col items-center justify-center py-4">
            <ShoppingBag size={24} className="text-accent-blue mb-1" />
            <span className="font-bold text-title-3">{mix.ordersCount}</span>
            <span className="text-caption-1 text-text-tertiary">Заказов</span>
          </Card>
          <Card variant="elevated" className="flex flex-col items-center justify-center py-4">
            <Flame size={24} className="text-accent-orange mb-1" />
            <span className="font-bold text-title-3">{strength.percent}%</span>
            <span className="text-caption-1 text-text-tertiary">Крепость</span>
          </Card>
        </div>

        {/* Ingredients */}
        <section className="mb-8">
          <h2 className="font-heading font-bold text-title-3 mb-4">Состав микса</h2>
          <div className="flex flex-col gap-3">
            {mix.ingredients?.map((ing) => (
              <div key={ing.id} className="relative">
                <div className="flex items-center justify-between mb-1.5 z-10 relative">
                  <span className="font-medium text-body">{ing.flavor.name}</span>
                  <span className="text-subheadline text-text-secondary">{ing.percentage}%</span>
                </div>
                {/* Progress Bar */}
                <div className="h-3 bg-surface-elevated rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-accent-green opacity-80 rounded-full"
                    style={{ width: `${ing.percentage}%` }}
                  />
                </div>
                <p className="text-caption-1 text-text-tertiary mt-1">
                  {ing.flavor.brand.name}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Actions */}
        <div className="flex gap-3 mt-auto">
          <Button 
            variant="secondary" 
            className="flex-1"
            onClick={() => handleAction('LIKE')}
            icon={Heart}
          >
            Лайк
          </Button>
          <Button 
            variant="primary" 
            className="flex-[2]"
            onClick={() => handleAction('ORDER')}
            icon={ShoppingBag}
          >
            Заказать
          </Button>
        </div>
      </div>
    </div>
  );
}
