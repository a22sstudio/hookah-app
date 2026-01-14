import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { User, Heart, ShoppingBag, Plus, ChevronRight } from 'lucide-react';
import { useTelegram } from '../hooks/useTelegram';
import { getUser, getUserActions } from '../api';
import { Card, Badge } from '../components/ui';
import { PageLoader } from '../components/Loader';

export default function Profile() {
  const { user: tgUser, isReady } = useTelegram();

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['user', tgUser?.id],
    queryFn: () => getUser(tgUser?.id),
    enabled: !!tgUser?.id,
  });

  const { data: actions, isLoading: actionsLoading } = useQuery({
    queryKey: ['userActions', tgUser?.id],
    queryFn: () => getUserActions(tgUser?.id),
    enabled: !!tgUser?.id,
  });

  if (!isReady || userLoading) {
    return <PageLoader />;
  }

  const displayName = tgUser?.first_name || user?.firstName || 'Гость';
  const username = tgUser?.username || user?.username;

  const stats = {
    likes: actions?.filter(a => a.type === 'LIKE').length || 0,
    orders: actions?.filter(a => a.type === 'ORDER').length || 0,
    mixes: user?.mixes?.length || 0,
  };

  return (
    <div className="px-4 py-6 animate-fade-in">
      {/* Profile Header */}
      <header className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-green to-accent-blue flex items-center justify-center">
          <span className="text-title-1 font-heading font-bold text-white">
            {displayName.charAt(0).toUpperCase()}
          </span>
        </div>
        
        <div className="flex-1">
          <h1 className="font-heading text-title-2 text-text-primary">
            {displayName}
          </h1>
          {username && (
            <p className="text-subheadline text-text-secondary">
              @{username}
            </p>
          )}
        </div>
      </header>

      {/* Stats */}
      <section className="mb-8">
        <div className="grid grid-cols-3 gap-3">
          <Card variant="default" padding="default" className="text-center">
            <div className="w-10 h-10 mx-auto mb-2 rounded-ios-lg bg-accent-red/15 flex items-center justify-center">
              <Heart size={20} className="text-accent-red" />
            </div>
            <p className="font-heading font-bold text-title-3 text-text-primary">
              {stats.likes}
            </p>
            <p className="text-caption-1 text-text-secondary">
              Лайков
            </p>
          </Card>

          <Card variant="default" padding="default" className="text-center">
            <div className="w-10 h-10 mx-auto mb-2 rounded-ios-lg bg-accent-blue/15 flex items-center justify-center">
              <ShoppingBag size={20} className="text-accent-blue" />
            </div>
            <p className="font-heading font-bold text-title-3 text-text-primary">
              {stats.orders}
            </p>
            <p className="text-caption-1 text-text-secondary">
              Заказов
            </p>
          </Card>

          <Card variant="default" padding="default" className="text-center">
            <div className="w-10 h-10 mx-auto mb-2 rounded-ios-lg bg-accent-green/15 flex items-center justify-center">
              <Plus size={20} className="text-accent-green" />
            </div>
            <p className="font-heading font-bold text-title-3 text-text-primary">
              {stats.mixes}
            </p>
            <p className="text-caption-1 text-text-secondary">
              Миксов
            </p>
          </Card>
        </div>
      </section>

      {/* Recent Activity */}
      <section>
        <h2 className="font-heading font-bold text-title-3 text-text-primary mb-4">
          Последняя активность
        </h2>
        
        {actions && actions.length > 0 ? (
          <div className="flex flex-col gap-3">
            {actions.slice(0, 5).map((action) => (
              <Card key={action.id} variant="default" padding="default">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-ios-lg flex items-center justify-center ${
                    action.type === 'LIKE' ? 'bg-accent-red/15' :
                    action.type === 'ORDER' ? 'bg-accent-blue/15' :
                    'bg-surface-elevated'
                  }`}>
                    {action.type === 'LIKE' && <Heart size={18} className="text-accent-red" />}
                    {action.type === 'ORDER' && <ShoppingBag size={18} className="text-accent-blue" />}
                    {action.type === 'DISLIKE' && <Heart size={18} className="text-text-tertiary" />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-body text-text-primary truncate">
                      {action.mix?.name || 'Микс'}
                    </p>
                    <p className="text-caption-1 text-text-secondary">
                      {action.type === 'LIKE' && 'Понравилось'}
                      {action.type === 'DISLIKE' && 'Не понравилось'}
                      {action.type === 'ORDER' && `Заказ на стол ${action.tableNumber || '—'}`}
                    </p>
                  </div>
                  
                  <ChevronRight size={18} className="text-text-tertiary" />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card variant="default" padding="lg" className="text-center">
            <p className="text-text-secondary text-body">
              Пока нет активности
            </p>
            <p className="text-text-tertiary text-caption-1 mt-1">
              Лайкайте миксы и делайте заказы
            </p>
          </Card>
        )}
      </section>
    </div>
  );
}
