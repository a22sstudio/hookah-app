import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Heart, ShoppingBag, Sparkles, Star, Flame } from 'lucide-react';

export default function Feature({ 
  title, 
  subtitle, 
  mockupType, 
  currentStep, 
  totalSteps, 
  onContinue, 
  onSkip 
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a] px-6 py-8">
      {/* Skip */}
      <div className="flex justify-end">
        <button
          onClick={onSkip}
          className="flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-300 press-effect"
        >
          Пропустить
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Mockup */}
      <div className="flex flex-1 items-center justify-center py-8">
        <motion.div
          key={mockupType}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Mockup type={mockupType} />
        </motion.div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        <motion.div
          key={title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3 text-center"
        >
          <h1 className="text-2xl font-bold text-white font-heading">{title}</h1>
          <p className="text-zinc-400">{subtitle}</p>
        </motion.div>

        {/* Dots */}
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === currentStep ? 'w-6 bg-emerald-500' : 'w-2 bg-zinc-700'
              }`}
            />
          ))}
        </div>

        {/* Button */}
        <button
          onClick={onContinue}
          className="w-full rounded-xl bg-zinc-800 py-4 text-base font-medium text-white hover:bg-zinc-700 press-effect"
        >
          Продолжить
        </button>
      </div>
    </div>
  );
}

function Mockup({ type }) {
  switch (type) {
    case 'mix-builder':
      return <MixBuilderMockup />;
    case 'brands':
      return <BrandsMockup />;
    case 'order':
      return <OrderMockup />;
    case 'social':
      return <SocialMockup />;
    default:
      return null;
  }
}

function MixBuilderMockup() {
  return (
    <div className="w-72 space-y-3">
      <div className="ml-auto w-fit max-w-[220px] rounded-2xl rounded-br-md bg-zinc-800 px-4 py-3">
        <p className="text-sm text-zinc-200">Создай микс из манго, мяты и цитруса 🍋</p>
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 p-4">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20">
            <Sparkles size={16} className="text-emerald-400" />
          </div>
          <span className="text-sm font-medium text-white">Твой микс готов!</span>
        </div>
        <div className="space-y-2">
          {[
            { name: 'Mango Tango', percent: 40, color: 'bg-amber-500' },
            { name: 'Fresh Mint', percent: 35, color: 'bg-emerald-500' },
            { name: 'Citrus Mix', percent: 25, color: 'bg-yellow-500' },
          ].map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${item.color}`} />
              <span className="flex-1 text-xs text-zinc-400">{item.name}</span>
              <span className="text-xs font-medium text-zinc-300">{item.percent}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-xl bg-zinc-800/50 px-4 py-3">
        <span className="flex-1 text-sm text-zinc-500">Опиши свой идеальный вкус...</span>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500">
          <ChevronRight size={16} className="text-white" />
        </div>
      </div>
    </div>
  );
}

function BrandsMockup() {
  const brands = [
    { name: 'Darkside', logo: '🌑', color: 'from-zinc-700 to-zinc-900' },
    { name: 'Tangiers', logo: '🏺', color: 'from-amber-700/50 to-amber-900/50' },
    { name: 'Fumari', logo: '🌈', color: 'from-pink-700/50 to-pink-900/50' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-3">
        {brands.map((brand) => (
          <div
            key={brand.name}
            className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${brand.color} text-2xl shadow-lg`}
          >
            {brand.logo}
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {brands.map((brand, i) => (
          <motion.div
            key={brand.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-3 rounded-xl bg-zinc-800/50 px-4 py-3"
          >
            <span className="text-xl">{brand.logo}</span>
            <span className="flex-1 text-sm font-medium text-white">{brand.name}</span>
            <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-xs text-emerald-400">5 вкусов</span>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center">
        <div className="rounded-full bg-zinc-800 px-4 py-2">
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-sm font-semibold text-transparent">
            15+ вкусов
          </span>
        </div>
      </div>
    </div>
  );
}

function OrderMockup() {
  return (
    <div className="w-72 space-y-3">
      <div className="rounded-2xl bg-gradient-to-br from-emerald-900/30 to-emerald-950/30 border border-emerald-500/20 p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-emerald-400" />
            <span className="font-medium text-white">Заказ #127</span>
          </div>
          <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-xs text-emerald-400">Готовится</span>
        </div>

        <div className="space-y-2 border-t border-zinc-700/50 pt-3">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">Микс:</span>
            <span className="text-white">Summer Breeze</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">Столик:</span>
            <span className="text-white">#5</span>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-3 rounded-xl bg-emerald-500 px-4 py-3"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
          <span className="text-lg">✓</span>
        </div>
        <div>
          <p className="text-sm font-medium text-white">Заказ принят!</p>
          <p className="text-xs text-emerald-100">Время ожидания ~5 мин</p>
        </div>
      </motion.div>
    </div>
  );
}

function SocialMockup() {
  return (
    <div className="w-72 space-y-3">
      <div className="rounded-2xl bg-zinc-800/80 p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500/30 to-orange-500/30">
            <span className="text-lg">🍑</span>
          </div>
          <div className="flex-1">
            <p className="font-medium text-white">Peach Paradise</p>
            <p className="text-xs text-zinc-500">by @smoker_pro</p>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-zinc-700/50 pt-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-pink-400">
              <Heart size={16} fill="currentColor" />
              <span className="text-sm">234</span>
            </div>
            <div className="flex items-center gap-1 text-amber-400">
              <Star size={16} fill="currentColor" />
              <span className="text-sm">4.8</span>
            </div>
          </div>
          <span className="text-xs text-zinc-500">127 заказов</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { value: '12', label: 'Миксов' },
          { value: '89', label: 'Лайков' },
          { value: '34', label: 'Заказов' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl bg-zinc-800/50 p-3 text-center">
            <p className="text-lg font-bold text-white">{stat.value}</p>
            <p className="text-xs text-zinc-500">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
