import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Flame, Tag } from 'lucide-react';
import { getFlavorById } from '../api';
import { Card, Badge, Button } from '../components/ui';
import { PageLoader } from '../components/Loader';

const strengthConfig = {
  LIGHT: { label: 'Лёгкий', color: 'green', icon: '🌱', percent: 30 },
  MEDIUM: { label: 'Средний', color: 'orange', icon: '🔥', percent: 60 },
  STRONG: { label: 'Крепкий', color: 'red', icon: '💥', percent: 90 },
};

const tagLabels = {
  SWEET: '🍬 Сладкий',
  SOUR: '🍋 Кислый',
  FRESH: '❄️ Свежий',
  FRUITY: '🍎 Фруктовый',
  BERRY: '🫐 Ягодный',
  CITRUS: '🍊 Цитрус',
  MINT: '🌿 Мята',
  ICE: '🧊 Лёд',
  TROPICAL: '🥭 Тропик',
  CREAMY: '🥛 Сливочный',
  DESSERT: '🍰 Десерт',
  SPICY: '🌶️ Пряный',
};

export default function FlavorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: flavor, isLoading } = useQuery({
    queryKey: ['flavor', id],
    queryFn: () => getFlavorById(id),
  });

  if (isLoading) return <PageLoader />;
  if (!flavor) return <div className="p-4 text-center text-zinc-500">Вкус не найден</div>;

  const strength = strengthConfig[flavor.strength] || strengthConfig.MEDIUM;

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header with gradient */}
      <div className="relative h-48 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${
          strength.color === 'green' ? 'from-emerald-900/50 to-emerald-950/30' :
          strength.color === 'orange' ? 'from-amber-900/50 to-amber-950/30' :
          'from-red-900/50 to-red-950/30'
        }`} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
        
        {/* Back Button */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-4 left-4"
        >
          <button 
            onClick={() => navigate(-1)} 
            className="w-10 h-10 rounded-xl bg-black/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/50 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
        </motion.div>

        {/* Strength Icon */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"
        >
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-xl ${
            strength.color === 'green' ? 'bg-emerald-500/20 shadow-emerald-500/20' :
            strength.color === 'orange' ? 'bg-amber-500/20 shadow-amber-500/20' :
            'bg-red-500/20 shadow-red-500/20'
          }`}>
            {strength.icon}
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="px-4 pt-14 pb-8">
        {/* Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-bold text-white mb-2">{flavor.name}</h1>
          <p className="text-zinc-500">{flavor.brand?.name}</p>
          <Badge variant={strength.color} className="mt-3">
            <Flame size={12} className="mr-1" />
            {strength.label}
          </Badge>
        </motion.div>

        {/* Strength Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card variant="default" padding="default" className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-zinc-400">Крепость</span>
              <span className="text-sm font-medium text-white">{strength.percent}%</span>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${strength.percent}%` }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className={`h-full rounded-full ${
                  strength.color === 'green' ? 'bg-emerald-500' :
                  strength.color === 'orange' ? 'bg-amber-500' :
                  'bg-red-500'
                }`}
              />
            </div>
          </Card>
        </motion.div>

        {/* Description */}
        {flavor.description && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card variant="default" padding="default" className="mb-6">
              <h3 className="text-sm font-medium text-zinc-400 mb-2">Описание</h3>
              <p className="text-white leading-relaxed">{flavor.description}</p>
            </Card>
          </motion.div>
        )}

        {/* Tags */}
        {flavor.flavorProfile && flavor.flavorProfile.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card variant="default" padding="default" className="mb-6">
              <h3 className="text-sm font-medium text-zinc-400 mb-3 flex items-center gap-2">
                <Tag size={14} />
                Характеристики
              </h3>
              <div className="flex flex-wrap gap-2">
                {flavor.flavorProfile.map((tag) => (
                  <span 
                    key={tag}
                    className="px-3 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-sm"
                  >
                    {tagLabels[tag] || tag}
                  </span>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Add to Mix Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => navigate('/mixes/create')}
          >
            Добавить в микс
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
