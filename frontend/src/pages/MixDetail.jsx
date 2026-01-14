import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, ThumbsDown, ShoppingCart, User } from 'lucide-react';
import { getMixById, mixAction } from '../api';
import Loader from '../components/Loader';
import { formatStrength } from '../utils/helpers';
import { useTelegram } from '../hooks/useTelegram';

const MixDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, hapticFeedback, showAlert } = useTelegram();
  const [mix, setMix] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);
  const [tableNumber, setTableNumber] = useState('');

  useEffect(() => {
    const fetchMix = async () => {
      try {
        const data = await getMixById(id);
        setMix(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMix();
  }, [id]);

  const handleLike = async () => {
    if (!user) return showAlert('Откройте через Telegram');
    hapticFeedback('impact', 'light');
    try {
      await mixAction(mix.id, { userId: user.id, type: 'LIKE' });
      setMix(prev => ({ ...prev, likesCount: (prev.likesCount || 0) + 1 }));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDislike = async () => {
    if (!user) return showAlert('Откройте через Telegram');
    hapticFeedback('impact', 'light');
    try {
      await mixAction(mix.id, { userId: user.id, type: 'DISLIKE' });
      setMix(prev => ({ ...prev, dislikesCount: (prev.dislikesCount || 0) + 1 }));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleOrder = async () => {
    if (!user) return showAlert('Откройте через Telegram');
    if (!tableNumber) return showAlert('Укажите номер столика');
    
    hapticFeedback('notification', 'success');
    try {
      await mixAction(mix.id, {
        userId: user.id,
        type: 'ORDER',
        tableNumber: parseInt(tableNumber),
      });
      showAlert('✅ Заказ отправлен!');
      setOrdering(false);
      setTableNumber('');
      setMix(prev => ({ ...prev, ordersCount: (prev.ordersCount || 0) + 1 }));
    } catch (error) {
      console.error('Error:', error);
      showAlert('Ошибка при заказе');
    }
  };

  if (loading) return <Loader />;
  if (!mix) return <div className="p-4 text-center text-gray-400">Микс не найден</div>;

  return (
    <div className="min-h-screen pb-32">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-hookah-dark/95 backdrop-blur-lg border-b border-white/5">
        <div className="flex items-center gap-4 px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/5 rounded-xl transition-colors"
          >
            <ArrowLeft size={24} className="text-white" />
          </button>
          <h1 className="text-lg font-semibold text-white truncate">{mix.name}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {/* Info Card */}
        <div className="bg-hookah-card rounded-2xl p-6 border border-white/5 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{mix.name}</h2>
              <div className="flex items-center gap-2 text-gray-400">
                <User size={16} />
                <span>{mix.author?.firstName || mix.author?.username || 'Аноним'}</span>
              </div>
            </div>
            <span className="px-3 py-1.5 bg-hookah-primary/20 text-hookah-primary text-sm rounded-lg font-medium">
              {formatStrength(mix.userStrength)}
            </span>
          </div>

          {mix.description && (
            <p className="text-gray-300 mb-4">{mix.description}</p>
          )}

          {/* Stats */}
          <div className="flex gap-6 pt-4 border-t border-white/5">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{mix.likesCount || 0}</p>
              <p className="text-xs text-gray-400">Лайков</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{mix.ordersCount || 0}</p>
              <p className="text-xs text-gray-400">Заказов</p>
            </div>
            {mix.rating > 0 && (
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-500">⭐ {mix.rating.toFixed(1)}</p>
                <p className="text-xs text-gray-400">Рейтинг</p>
              </div>
            )}
          </div>
        </div>

        {/* Ingredients */}
        <div className="bg-hookah-card rounded-2xl p-6 border border-white/5 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">🌿 Состав</h3>
          <div className="space-y-3">
            {mix.ingredients?.map((ing) => (
              <div
                key={ing.id}
                className="flex justify-between items-center p-3 bg-hookah-dark rounded-xl"
              >
                <div>
                  <p className="font-medium text-white">{ing.flavor?.name}</p>
                  <p className="text-sm text-gray-400">{ing.flavor?.brand?.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-hookah-primary">{ing.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={handleLike}
            className="flex-1 py-3 bg-hookah-card rounded-xl flex items-center justify-center gap-2 
                       text-gray-300 hover:text-red-400 hover:bg-red-400/10 transition-all"
          >
            <Heart size={20} />
            <span>Нравится</span>
          </button>
          <button
            onClick={handleDislike}
            className="flex-1 py-3 bg-hookah-card rounded-xl flex items-center justify-center gap-2 
                       text-gray-300 hover:text-gray-400 transition-all"
          >
            <ThumbsDown size={20} />
            <span>Не нравится</span>
          </button>
        </div>
      </div>

      {/* Order Section */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-hookah-dark/95 backdrop-blur-lg border-t border-white/5">
        {ordering ? (
          <div className="flex gap-3">
            <input
              type="number"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="№ столика"
              className="flex-1 px-4 py-3 bg-hookah-card border border-white/10 rounded-xl 
                         text-white placeholder-gray-500 focus:outline-none focus:border-hookah-primary/50"
            />
            <button
              onClick={handleOrder}
              className="px-6 py-3 bg-hookah-primary rounded-xl text-white font-semibold"
            >
              ОК
            </button>
            <button
              onClick={() => setOrdering(false)}
              className="px-4 py-3 bg-hookah-card rounded-xl text-gray-400"
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            onClick={() => setOrdering(true)}
            className="w-full py-4 bg-gradient-to-r from-hookah-primary to-hookah-secondary 
                       rounded-2xl text-white font-semibold flex items-center justify-center gap-2"
          >
            <ShoppingCart size={20} />
            Заказать на столик
          </button>
        )}
      </div>
    </div>
  );
};

export default MixDetail;
