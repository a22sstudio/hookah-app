import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Trash2, Check } from 'lucide-react';
import { getFlavors, createMix } from '../api';
import FlavorCard from '../components/FlavorCard';
import SearchBar from '../components/SearchBar';
import Loader from '../components/Loader';
import { useTelegram } from '../hooks/useTelegram';

const CreateMix = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, hapticFeedback, showAlert } = useTelegram();
  
  const [step, setStep] = useState(1); // 1: выбор вкусов, 2: проценты, 3: название
  const [flavors, setFlavors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedFlavors, setSelectedFlavors] = useState([]);
  const [mixName, setMixName] = useState('');
  const [mixDescription, setMixDescription] = useState('');
  const [strength, setStrength] = useState('MEDIUM');
  const [saving, setSaving] = useState(false);

  // Если пришли с FlavorDetail с выбранным вкусом
  useEffect(() => {
    if (location.state?.selectedFlavor) {
      const flavor = location.state.selectedFlavor;
      setSelectedFlavors([{ ...flavor, percentage: 100 }]);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchFlavors = async () => {
      try {
        const params = search ? { search } : {};
        const data = await getFlavors(params);
        setFlavors(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    const debounce = setTimeout(fetchFlavors, 300);
    return () => clearTimeout(debounce);
  }, [search]);

  const handleSelectFlavor = (flavor) => {
    hapticFeedback('impact', 'light');
    
    const exists = selectedFlavors.find(f => f.id === flavor.id);
    if (exists) {
      setSelectedFlavors(selectedFlavors.filter(f => f.id !== flavor.id));
    } else {
      if (selectedFlavors.length >= 5) {
        showAlert('Максимум 5 вкусов в миксе');
        return;
      }
      // Распределяем проценты поровну
      const newSelected = [...selectedFlavors, { ...flavor, percentage: 0 }];
      const equalPercentage = Math.floor(100 / newSelected.length);
      const remainder = 100 - (equalPercentage * newSelected.length);
      
      setSelectedFlavors(newSelected.map((f, i) => ({
        ...f,
        percentage: equalPercentage + (i === 0 ? remainder : 0)
      })));
    }
  };

  const updatePercentage = (flavorId, delta) => {
    hapticFeedback('selection');
    
    setSelectedFlavors(prev => {
      const updated = prev.map(f => {
        if (f.id === flavorId) {
          const newPercentage = Math.max(5, Math.min(95, f.percentage + delta));
          return { ...f, percentage: newPercentage };
        }
        return f;
      });
      
      // Нормализуем до 100%
      const total = updated.reduce((sum, f) => sum + f.percentage, 0);
      if (total !== 100) {
        const diff = 100 - total;
        const otherIndex = updated.findIndex(f => f.id !== flavorId);
        if (otherIndex !== -1) {
          updated[otherIndex].percentage += diff;
        }
      }
      
      return updated;
    });
  };

  const removeFlavor = (flavorId) => {
    hapticFeedback('impact', 'medium');
    const remaining = selectedFlavors.filter(f => f.id !== flavorId);
    
    if (remaining.length > 0) {
      const equalPercentage = Math.floor(100 / remaining.length);
      const remainder = 100 - (equalPercentage * remaining.length);
      setSelectedFlavors(remaining.map((f, i) => ({
        ...f,
        percentage: equalPercentage + (i === 0 ? remainder : 0)
      })));
    } else {
      setSelectedFlavors([]);
    }
  };

  const handleSave = async () => {
    if (!user) {
      showAlert('Откройте через Telegram');
      return;
    }
    
    if (!mixName.trim()) {
      showAlert('Введите название микса');
      return;
    }
    
    if (selectedFlavors.length < 2) {
      showAlert('Выберите минимум 2 вкуса');
      return;
    }
    
    const total = selectedFlavors.reduce((sum, f) => sum + f.percentage, 0);
    if (total !== 100) {
      showAlert('Сумма процентов должна быть 100%');
      return;
    }
    
    setSaving(true);
    hapticFeedback('notification', 'success');
    
    try {
      await createMix({
        name: mixName.trim(),
        description: mixDescription.trim(),
        authorId: user.id,
        strength,
        ingredients: selectedFlavors.map(f => ({
          flavorId: f.id,
          percentage: f.percentage
        }))
      });
      
      showAlert('✅ Микс создан!');
      navigate('/mixes');
    } catch (error) {
      console.error('Error:', error);
      showAlert('Ошибка при создании микса');
    } finally {
      setSaving(false);
    }
  };

  const totalPercentage = selectedFlavors.reduce((sum, f) => sum + f.percentage, 0);

  return (
    <div className="min-h-screen pb-32">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-hookah-dark/95 backdrop-blur-lg border-b border-white/5">
        <div className="flex items-center gap-4 px-4 py-4">
          <button
            onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)}
            className="p-2 hover:bg-white/5 rounded-xl transition-colors"
          >
            <ArrowLeft size={24} className="text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-white">Создать микс</h1>
            <p className="text-sm text-gray-400">Шаг {step} из 3</p>
          </div>
        </div>
        
        {/* Progress */}
        <div className="flex gap-1 px-4 pb-4">
          {[1, 2, 3].map(s => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors ${
                s <= step ? 'bg-hookah-primary' : 'bg-white/10'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step 1: Select Flavors */}
      {step === 1 && (
        <div className="px-4 py-6">
          <h2 className="text-xl font-bold text-white mb-2">Выберите вкусы</h2>
          <p className="text-gray-400 mb-4">От 2 до 5 вкусов</p>
          
          {/* Selected */}
          {selectedFlavors.length > 0 && (
            <div className="mb-4 p-4 bg-hookah-card rounded-2xl border border-hookah-primary/30">
              <p className="text-sm text-gray-400 mb-2">
                Выбрано: {selectedFlavors.length}/5
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedFlavors.map(f => (
                  <span
                    key={f.id}
                    className="px-3 py-1.5 bg-hookah-primary/20 text-hookah-primary 
                               rounded-full text-sm font-medium"
                  >
                    {f.name}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Search */}
          <div className="mb-4">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Поиск вкуса..."
            />
          </div>
          
          {/* Flavors List */}
          {loading ? (
            <Loader />
          ) : (
            <div className="space-y-3">
              {flavors.map(flavor => (
                <FlavorCard
                  key={flavor.id}
                  flavor={flavor}
                  selectable
                  selected={selectedFlavors.some(f => f.id === flavor.id)}
                  onSelect={handleSelectFlavor}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 2: Adjust Percentages */}
      {step === 2 && (
        <div className="px-4 py-6">
          <h2 className="text-xl font-bold text-white mb-2">Настройте пропорции</h2>
          <p className="text-gray-400 mb-6">Общая сумма должна быть 100%</p>
          
          {/* Total indicator */}
          <div className={`mb-6 p-4 rounded-2xl border ${
            totalPercentage === 100 
              ? 'bg-green-500/10 border-green-500/30' 
              : 'bg-yellow-500/10 border-yellow-500/30'
          }`}>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Итого:</span>
              <span className={`text-2xl font-bold ${
                totalPercentage === 100 ? 'text-green-500' : 'text-yellow-500'
              }`}>
                {totalPercentage}%
              </span>
            </div>
          </div>
          
          {/* Ingredients */}
          <div className="space-y-4">
            {selectedFlavors.map(flavor => (
              <div
                key={flavor.id}
                className="p-4 bg-hookah-card rounded-2xl border border-white/5"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-medium text-white">{flavor.name}</p>
                    <p className="text-sm text-gray-400">{flavor.brand?.name}</p>
                  </div>
                  <button
                    onClick={() => removeFlavor(flavor.id)}
                    className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => updatePercentage(flavor.id, -5)}
                    className="p-2 bg-hookah-dark rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <Minus size={20} className="text-gray-300" />
                  </button>
                  
                  <div className="flex-1 text-center">
                    <span className="text-3xl font-bold text-hookah-primary">
                      {flavor.percentage}%
                    </span>
                  </div>
                  
                  <button
                    onClick={() => updatePercentage(flavor.id, 5)}
                    className="p-2 bg-hookah-dark rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <Plus size={20} className="text-gray-300" />
                  </button>
                </div>
                
                {/* Progress bar */}
                <div className="mt-3 h-2 bg-hookah-dark rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-hookah-primary to-hookah-secondary transition-all"
                    style={{ width: `${flavor.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Name & Save */}
      {step === 3 && (
        <div className="px-4 py-6">
          <h2 className="text-xl font-bold text-white mb-6">Завершите создание</h2>
          
          {/* Name */}
          <div className="mb-4">
            <label className="text-sm text-gray-400 mb-2 block">Название микса *</label>
            <input
              type="text"
              value={mixName}
              onChange={(e) => setMixName(e.target.value)}
              placeholder="Например: Летний бриз"
              className="w-full p-4 bg-hookah-card border border-white/10 rounded-xl 
                         text-white placeholder-gray-500 focus:outline-none focus:border-hookah-primary/50"
            />
          </div>
          
          {/* Description */}
          <div className="mb-4">
            <label className="text-sm text-gray-400 mb-2 block">Описание</label>
            <textarea
              value={mixDescription}
              onChange={(e) => setMixDescription(e.target.value)}
              placeholder="Расскажите о вкусе..."
              rows={3}
              className="w-full p-4 bg-hookah-card border border-white/10 rounded-xl 
                         text-white placeholder-gray-500 focus:outline-none focus:border-hookah-primary/50
                         resize-none"
            />
          </div>
          
          {/* Strength */}
          <div className="mb-6">
            <label className="text-sm text-gray-400 mb-2 block">Крепость</label>
            <div className="flex gap-2">
              {[
                { value: 'LIGHT', label: '🌱 Лёгкий' },
                { value: 'MEDIUM', label: '🌿 Средний' },
                { value: 'STRONG', label: '🔥 Крепкий' },
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => setStrength(option.value)}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                    strength === option.value
                      ? 'bg-hookah-primary text-white'
                      : 'bg-hookah-card text-gray-400 hover:text-white'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Summary */}
          <div className="p-4 bg-hookah-card rounded-2xl border border-white/5 mb-6">
            <h3 className="font-medium text-white mb-3">Состав микса:</h3>
            <div className="space-y-2">
              {selectedFlavors.map(f => (
                <div key={f.id} className="flex justify-between text-sm">
                  <span className="text-gray-300">{f.name}</span>
                  <span className="text-hookah-primary font-medium">{f.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Actions */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-hookah-dark/95 backdrop-blur-lg border-t border-white/5">
        {step === 1 && (
          <button
            onClick={() => setStep(2)}
            disabled={selectedFlavors.length < 2}
            className={`w-full py-4 rounded-2xl font-semibold transition-all flex items-center justify-center gap-2
              ${selectedFlavors.length >= 2
                ? 'bg-gradient-to-r from-hookah-primary to-hookah-secondary text-white'
                : 'bg-hookah-card text-gray-500 cursor-not-allowed'
              }`}
          >
            Далее
            <span className="text-sm opacity-75">({selectedFlavors.length}/5 выбрано)</span>
          </button>
        )}
        
        {step === 2 && (
          <button
            onClick={() => setStep(3)}
            disabled={totalPercentage !== 100}
            className={`w-full py-4 rounded-2xl font-semibold transition-all
              ${totalPercentage === 100
                ? 'bg-gradient-to-r from-hookah-primary to-hookah-secondary text-white'
                : 'bg-hookah-card text-gray-500 cursor-not-allowed'
              }`}
          >
            {totalPercentage === 100 ? 'Далее' : `Сумма: ${totalPercentage}% (нужно 100%)`}
          </button>
        )}
        
        {step === 3 && (
          <button
            onClick={handleSave}
            disabled={saving || !mixName.trim()}
            className={`w-full py-4 rounded-2xl font-semibold transition-all flex items-center justify-center gap-2
              ${!saving && mixName.trim()
                ? 'bg-gradient-to-r from-hookah-primary to-hookah-secondary text-white'
                : 'bg-hookah-card text-gray-500 cursor-not-allowed'
              }`}
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Сохранение...
              </>
            ) : (
              <>
                <Check size={20} />
                Создать микс
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default CreateMix;
