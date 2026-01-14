import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, FlaskConical, ChevronRight, Settings } from 'lucide-react';
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

  const { data: actions } = useQuery({
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
    <div className="px-4 py-6">
      {/* Profile Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-8"
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <span className="text-2xl font-bold text-white">
            {displayName.charAt(0).toUpperCase()}
          </span>
        </div>
        
        <div className="flex-1">
          <h1 className="text-xl font-bold text-white">{displayName}</h1>
          {username && (
            <p className="text-zinc-500 text-sm">@{username}</p>
          )}
        </div>

        <button className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
          <Settings size={20} />
        </button>
      </motion.header>

      {/* Stats */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Heart, value: stats.likes, label: 'Лайков', color: 'pink' },
            { icon: ShoppingBag, value: stats.orders, label: 'Заказов', color: 'blue' },
            { icon: FlaskConical, value: stats.mixes, label: 'Миксов', color: 'emerald' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <Card variant="default" padding="default" className="text-center">
                <div className={`w-10 h-10 mx-auto mb-2 rounded-xl flex items-center justify-center bg-${stat.color}-500/20`}>
                  <stat.icon size={20} className={`text-${stat.color}-400`} />
                </div>
                <p className="text-xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-zinc-500">{stat.label}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Recent Activity */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-lg font-bold text-white mb-4">Последняя активность</h2>
        
        {actions && actions.length > 0 ? (
          <div className="space-y-2">
            {actions.slice(0, 5).map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index }}
              >
                <Card variant="default" padding="default" hover>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      action.type === 'LIKE' ? 'bg-pink-500/20' :
                      action.type === 'ORDER' ? 'bg-blue-500/20' :
                      'bg-zinc-800'
                    }`}>
                      {action.type === 'LIKE' && <Heart size={18} className="text-pink-400" />}
                      {action.type === 'ORDER' && <ShoppingBag size={18} className="text-blue-400" />}
                      {action.type === 'DISLIKE' && <Heart size={18} className="text-zinc-500" />}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">
                        {action.mix?.name || 'Микс'}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {action.type === 'LIKE' && 'Понравилось'}
                        {action.type === 'DISLIKE' && 'Не понравилось'}
                        {action.type === 'ORDER' && `Заказ на стол ${action.tableNumber || '—'}`}
                      </p>
                    </div>
                    
                    <ChevronRight size={18} className="text-zinc-700" />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card variant="default" padding="lg" className="text-center">
            <p className="text-zinc-500">Пока нет активности</p>
            <p className="text-xs text-zinc-600 mt-1">
              Лайкайте миксы и делайте заказы
            </p>
          </Card>
        )}
      </motion.section>
    </div>
  );
}
