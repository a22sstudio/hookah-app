import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, ShoppingBag, Share2, Flame, User, ThumbsDown } from 'lucide-react';
import { useTelegram } from '../hooks/useTelegram';
import { getMixById, mixAction } from '../api';
import { Card, Button, Badge } from '../components/ui';
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
  const [isLiked, setIsLiked] = useState(false);

  const { data: mix, isLoading } = useQuery({
    queryKey: ['mix', id],
    queryFn: () => getMixById(id),
  });

  const actionMutation = useMutation({
    mutationFn: (data) => mixAction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['mix', id]);
      if (tg?.HapticFeedback) {
        tg.HapticFeedback.notificationOccurred('success');
      }
    },
  });

  if (isLoading) return <PageLoader />;
  if (!mix) return <div className="p-4 text-center text-zinc-500">Микс не найден</div>;

  const strength = strengthConfig[mix.userStrength] || strengthConfig.MEDIUM;
  const rating = mix.likesCount - mix.dislikesCount;

  const handleAction = (type) => {
    if (!user) {
      alert('Войдите через Telegram');
      return;
    }
    
    if (tg?.HapticFeedback) {
      tg.HapticFeedback.impactOccurred('medium');
    }
    
    if (type === 'ORDER') {
      const table = prompt('Введите номер столика:');
      if (table) {
        actionMutation.mutate({ userId: user.id, type, tableNumber: parseInt(table) });
        alert(`✅ Микс "${mix.name}" заказан на столик ${table}!`);
      }
    } else if (type === 'LIKE') {
      setIsLiked(true);
      actionMutation.mutate({ userId: user.id, type });
    } else {
      actionMutation.mutate({ userId: user.id, type });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-32">
      {/* Header */}
      <div className="relative h-56 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 to-emerald-950/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
        
        {/* Navigation */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <motion.button 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)} 
            className="w-10 h-10 rounded-xl bg-black/30 backdrop-blur-md flex items-center justify-center text-white"
          >
            <ArrowLeft size={20} />
          </motion.button>
          
          <motion.button 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-10 h-10 rounded-xl bg-black/30 backdrop-blur-md flex items-center justify-center text-white"
          >
            <Share2 size={20} />
          </motion.button>
        </div>

        {/* Icon */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"
        >
          <div className="w-20 h-20 rounded-2xl bg-emerald-500/20 flex items-center justify-center shadow-xl shadow-emerald-500/20">
            <Flame size={40} className="text-emerald-400" />
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="px-4 pt-14">
        {/* Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-6"
        >
          <h1 className="text-2xl font-bold text-white mb-2">{mix.name}</h1>
          <div className="flex items-center justify-center gap-3">
            <Badge variant={strength.color}>
              <Flame size={12} className="mr-1" />
              {strength.label}
            </Badge>
            <span className="text-zinc-500 flex items-center gap-1 text-sm">
              <User size={14} />
              {mix.author?.firstName || 'Аноним'}
            </span>
          </div>
          {mix.description && (
            <p className="mt-4 text-zinc-400 text-sm leading-relaxed">{mix.description}</p>
          )}
        </motion.div>

        {/* Stats Row */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          {[
            { icon: Heart, value: mix.likesCount, label: 'Лайков', color: 'pink' },
            { icon: ShoppingBag, value: mix.ordersCount, label: 'Заказов', color: 'blue' },
            { icon: Flame, value: `${strength.percent}%`, label: 'Крепость', color: 'emerald' },
          ].map((stat, index) => (
            <Card key={stat.label} variant="elevated" padding="default" className="text-center">
              <stat.icon size={20} className={`mx-auto mb-1 text-${stat.color}-400`} />
              <p className="text-lg font-bold text-white">{stat.value}</p>
              <p className="text-xs text-zinc-500">{stat.label}</p>
            </Card>
          ))}
        </motion.div>

        {/* Ingredients */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-lg font-bold text-white mb-4">Состав микса</h2>
          <div className="space-y-3">
            {mix.ingredients?.map((ing, index) => (
              <motion.div
                key={ing.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card variant="default" padding="default">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-white">{ing.flavor.name}</span>
                    <span className="text-emerald-400 font-semibold">{ing.percentage}%</span>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${ing.percentage}%` }}
                      transition={{ delay: 0.3 + 0.1 * index, duration: 0.5 }}
                      className="h-full bg-emerald-500 rounded-full"
                    />
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">{ing.flavor.brand?.name}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>

      {/* Fixed Bottom Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a] to-transparent pt-8"
      >
        <div className="flex gap-3 max-w-md mx-auto">
          <Button 
            variant={isLiked ? 'primary' : 'secondary'}
            className="flex-1"
            onClick={() => handleAction('LIKE')}
            icon={Heart}
          >
            {isLiked ? 'Liked!' : 'Лайк'}
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
      </motion.div>
    </div>
  );
}
