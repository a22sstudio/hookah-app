import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, Save, Check, ChevronRight, Sparkles, FlaskConical } from 'lucide-react';
import { useTelegram } from '../hooks/useTelegram';
import { getBrands, getFlavors, createMix } from '../api';
import { Button, Card, Badge } from '../components/ui';
import { PageLoader } from '../components/Loader';

const strengthConfig = {
  LIGHT: { label: 'Лёгкий', color: 'green', icon: '🌱' },
  MEDIUM: { label: 'Средний', color: 'orange', icon: '🔥' },
  STRONG: { label: 'Крепкий', color: 'red', icon: '💥' },
};

export default function CreateMix() {
  const navigate = useNavigate();
  const { user, tg } = useTelegram();
  
  // State
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [showFlavorSelect, setShowFlavorSelect] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);

  // Queries
  const { data: brands, isLoading: brandsLoading } = useQuery({ 
    queryKey: ['brands'], 
    queryFn: getBrands 
  });
  
  const { data: flavors, isLoading: flavorsLoading } = useQuery({ 
    queryKey: ['flavors', selectedBrand], 
    queryFn: () => getFlavors({ brandId: selectedBrand }),
    enabled: !!selectedBrand 
  });

  const createMutation = useMutation({
    mutationFn: createMix,
    onSuccess: () => {
      if (tg?.HapticFeedback) {
        tg.HapticFeedback.notificationOccurred('success');
      }
      navigate('/mixes');
    },
  });

  // Helpers
  const totalPercentage = ingredients.reduce((sum, i) => sum + i.percentage, 0);
  
  const addIngredient = (flavor) => {
    if (ingredients.find(i => i.flavorId === flavor.id)) return;
    
    if (tg?.HapticFeedback) {
      tg.HapticFeedback.impactOccurred('light');
    }
    
    setIngredients([...ingredients, { 
      ...flavor, 
      flavorId: flavor.id, 
      percentage: Math.min(100 - totalPercentage, 30) // Auto-calculate
    }]);
    setShowFlavorSelect(false);
    setSelectedBrand(null);
  };

  const removeIngredient = (index) => {
    if (tg?.HapticFeedback) {
      tg.HapticFeedback.impactOccurred('medium');
    }
    const newIng = [...ingredients];
    newIng.splice(index, 1);
    setIngredients(newIng);
  };

  const updatePercentage = (index, value) => {
    const newIng = [...ingredients];
    newIng[index].percentage = parseInt(value) || 0;
    setIngredients(newIng);
  };

  const handleSubmit = () => {
    if (!name || ingredients.length === 0) return;
    
    if (tg?.HapticFeedback) {
      tg.HapticFeedback.impactOccurred('heavy');
    }
    
    createMutation.mutate({
      name,
      description,
      authorId: user?.id,
      ingredients: ingredients.map(i => ({
        flavorId: i.flavorId,
        percentage: i.percentage
      }))
    });
  };

  // --- Flavor Selection Modal ---
  if (showFlavorSelect) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-[#0a0a0a] px-4 py-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => {
              if (selectedBrand) {
                setSelectedBrand(null);
              } else {
                setShowFlavorSelect(false);
              }
            }}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span>{selectedBrand ? 'Назад' : 'Отмена'}</span>
          </button>
          <h2 className="text-lg font-bold text-white">
            {selectedBrand ? 'Выберите вкус' : 'Выберите бренд'}
          </h2>
          <div className="w-16" />
        </div>

        {/* Content */}
        <div className="space-y-2">
          {!selectedBrand ? (
            // Brand Selection
            <>
              {brandsLoading ? (
                <PageLoader />
              ) : (
                brands?.map((brand, index) => (
                  <motion.div
                    key={brand.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * index }}
                  >
                    <Card 
                      variant="default"
                      padding="default"
                      hover
                      onClick={() => setSelectedBrand(brand.id)}
                      className="flex items-center gap-4"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-xl">
                        {brand.name === 'Darkside' && '🌑'}
                        {brand.name === 'Tangiers' && '🏺'}
                        {brand.name === 'Fumari' && '🌈'}
                        {!['Darkside', 'Tangiers', 'Fumari'].includes(brand.name) && brand.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-white">{brand.name}</h3>
                        <p className="text-xs text-zinc-500">{brand._count?.flavors || 0} вкусов</p>
                      </div>
                      <ChevronRight size={18} className="text-zinc-600" />
                    </Card>
                  </motion.div>
                ))
              )}
            </>
          ) : (
            // Flavor Selection
            <>
              {flavorsLoading ? (
                <PageLoader />
              ) : (
                flavors?.map((flavor, index) => {
                  const isAdded = ingredients.find(i => i.flavorId === flavor.id);
                  const strength = strengthConfig[flavor.strength] || strengthConfig.MEDIUM;
                  
                  return (
                    <motion.div
                      key={flavor.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.03 * index }}
                    >
                      <Card 
                        variant="default"
                        padding="default"
                        hover={!isAdded}
                        onClick={() => !isAdded && addIngredient(flavor)}
                        className={`flex items-center gap-3 ${isAdded ? 'opacity-50' : ''}`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                          strength.color === 'green' ? 'bg-emerald-500/20' :
                          strength.color === 'orange' ? 'bg-amber-500/20' :
                          'bg-red-500/20'
                        }`}>
                          {strength.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-white truncate">{flavor.name}</h4>
                          <div className="flex gap-1 mt-1">
                            {flavor.flavorProfile?.slice(0, 2).map(tag => (
                              <span key={tag} className="text-xs bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        {isAdded ? (
                          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                            <Check size={16} className="text-white" />
                          </div>
                        ) : (
                          <Plus size={20} className="text-zinc-600" />
                        )}
                      </Card>
                    </motion.div>
                  );
                })
              )}
            </>
          )}
        </div>
      </motion.div>
    );
  }

  // --- Step 1: Ingredients ---
  if (step === 1) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] px-4 py-6 pb-32">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-6"
        >
          <button 
            onClick={() => navigate(-1)} 
            className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">Создание микса</h1>
            <p className="text-sm text-zinc-500">Шаг 1 из 2 · Состав</p>
          </div>
        </motion.div>

        {/* Progress */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex gap-2 mb-2">
            <div className="flex-1 h-1 bg-emerald-500 rounded-full" />
            <div className="flex-1 h-1 bg-zinc-800 rounded-full" />
          </div>
        </motion.div>

        {/* Ingredients List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {ingredients.length === 0 ? (
            <Card 
              variant="default" 
              padding="lg" 
              className="border-2 border-dashed border-zinc-800 text-center mb-4"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-zinc-800 flex items-center justify-center">
                <FlaskConical size={32} className="text-zinc-600" />
              </div>
              <p className="text-zinc-500 mb-4">Добавьте вкусы для микса</p>
              <Button 
                variant="secondary"
                onClick={() => setShowFlavorSelect(true)} 
                icon={Plus}
              >
                Добавить вкус
              </Button>
            </Card>
          ) : (
            <div className="space-y-3 mb-4">
              <AnimatePresence>
                {ingredients.map((ing, idx) => {
                  const strength = strengthConfig[ing.strength] || strengthConfig.MEDIUM;
                  
                  return (
                    <motion.div
                      key={ing.flavorId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: 0.05 * idx }}
                    >
                      <Card variant="default" padding="default">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                              strength.color === 'green' ? 'bg-emerald-500/20' :
                              strength.color === 'orange' ? 'bg-amber-500/20' :
                              'bg-red-500/20'
                            }`}>
                              {strength.icon}
                            </div>
                            <div>
                              <h4 className="font-medium text-white">{ing.name}</h4>
                              <p className="text-xs text-zinc-500">{ing.brand?.name}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => removeIngredient(idx)}
                            className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/30 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        
                        {/* Slider */}
                        <div className="flex items-center gap-3">
                          <input
                            type="range"
                            min="5"
                            max="100"
                            value={ing.percentage}
                            onChange={(e) => updatePercentage(idx, e.target.value)}
                            className="flex-1 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                          />
                          <div className="w-14 text-right">
                            <span className="text-lg font-bold text-emerald-400">{ing.percentage}</span>
                            <span className="text-zinc-500">%</span>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Add More Button */}
              <button
                onClick={() => setShowFlavorSelect(true)}
                className="w-full py-4 rounded-2xl border-2 border-dashed border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-700 transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                Добавить ещё
              </button>
            </div>
          )}
        </motion.div>

        {/* Total */}
        {ingredients.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card 
              variant={totalPercentage === 100 ? 'default' : 'default'} 
              padding="default"
              className={`mb-6 ${
                totalPercentage === 100 
                  ? 'bg-emerald-500/10 border-emerald-500/30' 
                  : totalPercentage > 100 
                    ? 'bg-red-500/10 border-red-500/30' 
                    : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {totalPercentage === 100 ? (
                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                      <Check size={16} className="text-white" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                      <Sparkles size={16} className="text-zinc-400" />
                    </div>
                  )}
                  <span className="font-medium text-white">Всего</span>
                </div>
                <span className={`text-2xl font-bold ${
                  totalPercentage === 100 ? 'text-emerald-400' : 
                  totalPercentage > 100 ? 'text-red-400' : 'text-zinc-400'
                }`}>
                  {totalPercentage}%
                </span>
              </div>
              
              {totalPercentage !== 100 && (
                <p className="text-xs text-zinc-500 mt-2">
                  {totalPercentage < 100 
                    ? `Добавьте ещё ${100 - totalPercentage}%` 
                    : `Уберите ${totalPercentage - 100}%`
                  }
                </p>
              )}
            </Card>
          </motion.div>
        )}

        {/* Fixed Bottom Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a] to-transparent pt-8">
          <Button 
            variant="primary"
            size="lg"
            fullWidth
            disabled={ingredients.length === 0 || totalPercentage !== 100}
            onClick={() => setStep(2)}
          >
            Далее
          </Button>
        </div>
      </div>
    );
  }

  // --- Step 2: Name & Description ---
  return (
    <div className="min-h-screen bg-[#0a0a0a] px-4 py-6 pb-32">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-6"
      >
        <button 
          onClick={() => setStep(1)} 
          className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-white">Создание микса</h1>
          <p className="text-sm text-zinc-500">Шаг 2 из 2 · Название</p>
        </div>
      </motion.div>

      {/* Progress */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="flex gap-2 mb-2">
          <div className="flex-1 h-1 bg-emerald-500 rounded-full" />
          <div className="flex-1 h-1 bg-emerald-500 rounded-full" />
        </div>
      </motion.div>

      {/* Preview Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <Card variant="gradient" padding="default">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-emerald-400" />
            <span className="text-sm text-zinc-400">Твой микс</span>
          </div>
          <div className="space-y-2">
            {ingredients.map((ing) => (
              <div key={ing.flavorId} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="flex-1 text-sm text-zinc-300">{ing.name}</span>
                <span className="text-sm font-medium text-zinc-400">{ing.percentage}%</span>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <div>
          <label className="block text-sm text-zinc-400 mb-2">Название микса</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Например: Летний бриз"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white placeholder:text-zinc-600 focus:border-emerald-500/50 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-2">Описание (опционально)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Расскажите про ваш микс..."
            rows={4}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white placeholder:text-zinc-600 focus:border-emerald-500/50 focus:outline-none transition-colors resize-none"
          />
        </div>
      </motion.div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a] to-transparent pt-8">
        <Button 
          variant="primary"
          size="lg"
          fullWidth
          icon={Save}
          disabled={!name || createMutation.isPending}
          onClick={handleSubmit}
        >
          {createMutation.isPending ? 'Создание...' : 'Сохранить микс'}
        </Button>
      </div>
    </div>
  );
}
