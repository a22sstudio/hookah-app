import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, User } from 'lucide-react';
import { formatStrength } from '../utils/helpers';

const MixCard = ({ mix }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/mixes/${mix.id}`)}
      className="w-full p-4 bg-hookah-card rounded-2xl border border-white/5 
                 hover:border-hookah-primary/30 transition-all duration-300 text-left"
    >
      {/* Заголовок */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-white text-lg">{mix.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <User size={14} className="text-gray-500" />
            <span className="text-sm text-gray-400">
              {mix.author?.firstName || mix.author?.username || 'Аноним'}
            </span>
          </div>
        </div>
        <span className="px-2 py-1 bg-hookah-primary/20 text-hookah-primary text-xs rounded-lg font-medium">
          {formatStrength(mix.userStrength)}
        </span>
      </div>

      {/* Ингредиенты */}
      <div className="space-y-2 mb-4">
        {mix.ingredients?.slice(0, 3).map((ing) => (
          <div key={ing.id} className="flex justify-between items-center">
            <span className="text-sm text-gray-300">
              {ing.flavor?.name}
              <span className="text-gray-500 ml-1">
                ({ing.flavor?.brand?.name})
              </span>
            </span>
            <span className="text-sm text-hookah-primary font-medium">
              {ing.percentage}%
            </span>
          </div>
        ))}
        {mix.ingredients?.length > 3 && (
          <p className="text-sm text-gray-500">
            +{mix.ingredients.length - 3} ещё
          </p>
        )}
      </div>

      {/* Статистика */}
      <div className="flex items-center gap-4 pt-3 border-t border-white/5">
        <div className="flex items-center gap-1.5 text-gray-400">
          <Heart size={16} />
          <span className="text-sm">{mix.likesCount || 0}</span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-400">
          <ShoppingCart size={16} />
          <span className="text-sm">{mix.ordersCount || 0}</span>
        </div>
        {mix.rating > 0 && (
          <div className="flex items-center gap-1.5 text-yellow-500 ml-auto">
            <span>⭐</span>
            <span className="text-sm">{mix.rating.toFixed(1)}</span>
          </div>
        )}
      </div>
    </button>
  );
};

export default MixCard;
