import { useNavigate } from 'react-router-dom';
import { formatTag } from '../utils/helpers';

const FlavorCard = ({ flavor, onSelect, selectable = false, selected = false }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (selectable && onSelect) {
      onSelect(flavor);
    } else {
      navigate(`/flavors/${flavor.id}`);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full p-4 rounded-2xl border transition-all duration-300 text-left
        ${selected 
          ? 'bg-hookah-primary/20 border-hookah-primary shadow-lg shadow-hookah-primary/10' 
          : 'bg-hookah-card border-white/5 hover:border-white/20'
        }`}
    >
      {/* Верх: название и бренд */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-white">{flavor.name}</h3>
          <p className="text-sm text-gray-400">{flavor.brand?.name}</p>
        </div>
        {selected && (
          <div className="w-6 h-6 bg-hookah-primary rounded-full flex items-center justify-center">
            <span className="text-white text-sm">✓</span>
          </div>
        )}
      </div>

      {/* Описание */}
      {flavor.description && (
        <p className="text-sm text-gray-400 mb-3 line-clamp-2">
          {flavor.description}
        </p>
      )}

      {/* Теги */}
      {flavor.flavorProfile && flavor.flavorProfile.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {flavor.flavorProfile.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-white/5 rounded-full text-xs text-gray-300"
            >
              {formatTag(tag)}
            </span>
          ))}
          {flavor.flavorProfile.length > 3 && (
            <span className="px-2 py-0.5 text-xs text-gray-500">
              +{flavor.flavorProfile.length - 3}
            </span>
          )}
        </div>
      )}
    </button>
  );
};

export default FlavorCard;
