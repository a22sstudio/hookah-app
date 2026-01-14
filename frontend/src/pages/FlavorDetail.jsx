import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { getFlavorById } from '../api';
import Loader from '../components/Loader';
import { formatTag } from '../utils/helpers';

const FlavorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [flavor, setFlavor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlavor = async () => {
      try {
        const data = await getFlavorById(id);
        setFlavor(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFlavor();
  }, [id]);

  if (loading) return <Loader />;
  if (!flavor) return <div className="p-4 text-center text-gray-400">Вкус не найден</div>;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-hookah-dark/95 backdrop-blur-lg border-b border-white/5">
        <div className="flex items-center gap-4 px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/5 rounded-xl transition-colors"
          >
            <ArrowLeft size={24} className="text-white" />
          </button>
          <h1 className="text-lg font-semibold text-white truncate">
            {flavor.name}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {/* Main Info */}
        <div className="bg-hookah-card rounded-2xl p-6 border border-white/5 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">{flavor.name}</h2>
              <p className="text-hookah-primary font-medium">{flavor.brand?.name}</p>
            </div>
          </div>

          {flavor.description && (
            <p className="text-gray-300 mb-4">{flavor.description}</p>
          )}

          {/* Tags */}
          {flavor.flavorProfile && flavor.flavorProfile.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {flavor.flavorProfile.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 bg-hookah-primary/10 text-hookah-primary 
                             rounded-full text-sm font-medium"
                >
                  {formatTag(tag)}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <button
          onClick={() => navigate('/create-mix', { state: { selectedFlavor: flavor } })}
          className="w-full py-4 bg-gradient-to-r from-hookah-primary to-hookah-secondary 
                     rounded-2xl text-white font-semibold flex items-center justify-center gap-2
                     hover:opacity-90 transition-opacity"
        >
          <Plus size={20} />
          Добавить в микс
        </button>
      </div>
    </div>
  );
};

export default FlavorDetail;
