import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const BrandCard = ({ brand }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/flavors?brandId=${brand.id}`)}
      className="w-full p-4 bg-hookah-card rounded-2xl border border-white/5 
                 hover:border-hookah-primary/30 transition-all duration-300
                 flex items-center gap-4 group"
    >
      {/* Лого */}
      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-hookah-primary/20 to-hookah-secondary/20 
                      flex items-center justify-center text-2xl flex-shrink-0">
        {brand.logo || brand.name.charAt(0)}
      </div>
      
      {/* Инфо */}
      <div className="flex-1 text-left">
        <h3 className="font-semibold text-white group-hover:text-hookah-primary transition-colors">
          {brand.name}
        </h3>
        <p className="text-sm text-gray-400">
          {brand._count?.flavors || 0} вкусов
        </p>
      </div>
      
      {/* Стрелка */}
      <ChevronRight 
        className="text-gray-500 group-hover:text-hookah-primary group-hover:translate-x-1 transition-all" 
        size={20} 
      />
    </button>
  );
};

export default BrandCard;
