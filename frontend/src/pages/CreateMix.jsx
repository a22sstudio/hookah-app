import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ArrowLeft, Plus, Trash2, Save, Check } from 'lucide-react';
import { useTelegram } from '../hooks/useTelegram';
import { getBrands, getFlavors, createMix } from '../api';
import { Button, Card, Badge } from '../components/ui';
import { PageLoader } from '../components/Loader';

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
  const { data: brands } = useQuery({ 
    queryKey: ['brands'], 
    queryFn: getBrands 
  });
  
  const { data: flavors } = useQuery({ 
    queryKey: ['flavors', selectedBrand], 
    queryFn: () => getFlavors({ brandId: selectedBrand }),
    enabled: !!selectedBrand 
  });

  const createMutation = useMutation({
    mutationFn: createMix,
    onSuccess: () => {
      tg.HapticFeedback.notificationOccurred('success');
      navigate('/mixes');
    },
  });

  // Helpers
  const totalPercentage = ingredients.reduce((sum, i) => sum + i.percentage, 0);
  
  const addIngredient = (flavor) => {
    if (ingredients.find(i => i.flavorId === flavor.id)) return;
    setIngredients([...ingredients, { ...flavor, flavorId: flavor.id, percentage: 20 }]);
    setShowFlavorSelect(false);
    setSelectedBrand(null);
  };

  const removeIngredient = (index) => {
    const newIng = [...ingredients];
    newIng.splice(index, 1);
    setIngredients(newIng);
  };

  const updatePercentage = (index, value) => {
    const newIng = [...ingredients];
    newIng[index].percentage = parseInt(value);
    setIngredients(newIng);
  };

  const handleSubmit = () => {
    if (!name || ingredients.length === 0) return;
    
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

  // --- Step 1: Ingredients ---
  if (step === 1) {
    return (
      <div className="pb-24 animate-fade-in px-4 py-4 min-h-screen flex flex-col">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-text-secondary">
            <ArrowLeft size={24} />
          </button>
          <h1 className="font-heading text-title-2">Создание микса</h1>
        </div>

        {/* Ingredients List */}
        <div className="flex-1">
          {ingredients.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-border rounded-ios-xl">
              <p className="text-text-secondary mb-4">Микс пока пуст</p>
              <Button onClick={() => setShowFlavorSelect(true)} variant="secondary" icon={Plus}>
                Добавить вкус
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {ingredients.map((ing, idx) => (
                <Card key={idx} className="relative">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">{ing.name}</h4>
                      <p className="text-caption-1 text-text-secondary">{ing.brand?.name}</p>
                    </div>
                    <button 
                      onClick={() => removeIngredient(idx)}
                      className="text-text-tertiary p-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  
                  {/* Slider */}
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={ing.percentage}
                      onChange={(e) => updatePercentage(idx, e.target.value)}
                      className="flex-1 h-2 bg-surface-elevated rounded-lg appearance-none cursor-pointer accent-accent-green"
                    />
                    <span className="w-12 text-right font-mono font-medium">{ing.percentage}%</span>
                  </div>
                </Card>
              ))}

              <Button 
                onClick={() => setShowFlavorSelect(true)} 
                variant="ghost" 
                fullWidth 
                icon={Plus}
                className="border border-dashed border-border py-4"
              >
                Добавить еще
              </Button>

              {/* Total Check */}
              <div className={`flex justify-between items-center p-4 rounded-ios-xl ${
                totalPercentage === 100 ? 'bg-accent-green/10 text-accent-green' : 'bg-surface-elevated text-text-secondary'
              }`}>
                <span className="font-medium">Всего:</span>
                <span className={`font-bold ${totalPercentage !== 100 ? 'text-accent-red' : ''}`}>
                  {totalPercentage}%
                </span>
              </div>
            </div>
          )}
        </div>

        <Button 
          className="mt-6" 
          disabled={ingredients.length === 0 || totalPercentage !== 100}
          onClick={() => setStep(2)}
        >
          Далее
        </Button>

        {/* Modal for Selecting Flavors */}
        {showFlavorSelect && (
          <div className="fixed inset-0 z-50 bg-dark/95 backdrop-blur-sm p-4 flex flex-col animate-scale-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-title-3 font-bold">
                {selectedBrand ? 'Выберите вкус' : 'Выберите бренд'}
              </h2>
              <button onClick={() => setShowFlavorSelect(false)} className="text-text-secondary">Закрыть</button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
              {!selectedBrand ? (
                brands?.map(brand => (
                  <Card 
                    key={brand.id} 
                    onClick={() => setSelectedBrand(brand.id)}
                    className="flex justify-between items-center p-4 cursor-pointer hover:bg-surface-elevated"
                  >
                    <span>{brand.name}</span>
                    <ArrowLeft size={16} className="rotate-180 text-text-tertiary" />
                  </Card>
                ))
              ) : (
                <>
                  <button 
                    onClick={() => setSelectedBrand(null)} 
                    className="mb-4 text-accent-green text-subheadline flex items-center gap-1"
                  >
                    <ArrowLeft size={16} /> Назад к брендам
                  </button>
                  {flavors?.map(flavor => (
                    <Card 
                      key={flavor.id} 
                      onClick={() => addIngredient(flavor)}
                      className="p-4 cursor-pointer hover:bg-surface-elevated"
                    >
                      <h4 className="font-medium">{flavor.name}</h4>
                      <div className="flex gap-2 mt-1">
                        {flavor.flavorProfile?.slice(0, 3).map(tag => (
                          <span key={tag} className="text-caption-2 bg-surface-elevated px-2 py-0.5 rounded-full text-text-secondary">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </Card>
                  ))}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- Step 2: Info ---
  return (
    <div className="pb-24 animate-fade-in px-4 py-4 min-h-screen flex flex-col">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => setStep(1)} className="p-2 -ml-2 text-text-secondary">
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-heading text-title-2">Описание</h1>
      </div>

      <div className="space-y-6 flex-1">
        <div>
          <label className="block text-subheadline text-text-secondary mb-2">Название микса</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Например: Летний бриз"
            className="w-full bg-surface-solid border border-border rounded-ios-xl p-4 text-body text-text-primary focus:border-accent-green focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-subheadline text-text-secondary mb-2">Описание (опционально)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Расскажите, какой это микс..."
            rows={4}
            className="w-full bg-surface-solid border border-border rounded-ios-xl p-4 text-body text-text-primary focus:border-accent-green focus:outline-none resize-none"
          />
        </div>
      </div>

      <Button 
        onClick={handleSubmit} 
        icon={Save}
        disabled={!name || createMutation.isPending}
      >
        {createMutation.isPending ? 'Создание...' : 'Сохранить микс'}
      </Button>
    </div>
  );
}
