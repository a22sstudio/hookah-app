import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getFlavors, getBrands, getTags } from '../api';
import FlavorCard from '../components/FlavorCard';
import SearchBar from '../components/SearchBar';
import TagFilter from '../components/TagFilter';
import Loader from '../components/Loader';
import { ChevronDown } from 'lucide-react';

const Flavors = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [flavors, setFlavors] = useState([]);
  const [brands, setBrands] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brandId') || '');
  const [selectedTags, setSelectedTags] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [brandsData, tagsData] = await Promise.all([
          getBrands(),
          getTags(),
        ]);
        setBrands(brandsData);
        setTags(tagsData);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchFlavors = async () => {
      setLoading(true);
      try {
        const params = {};
        if (selectedBrand) params.brandId = selectedBrand;
        if (selectedTags.length === 1) params.tag = selectedTags[0];
        if (search) params.search = search;
        
        const data = await getFlavors(params);
        
        // Фильтрация по нескольким тегам на клиенте
        let filtered = data;
        if (selectedTags.length > 1) {
          filtered = data.filter(flavor =>
            selectedTags.every(tag => flavor.flavorProfile?.includes(tag))
          );
        }
        
        setFlavors(filtered);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    const debounce = setTimeout(fetchFlavors, 300);
    return () => clearTimeout(debounce);
  }, [selectedBrand, selectedTags, search]);

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-white mb-6">🌿 Вкусы</h1>

      {/* Search */}
      <div className="mb-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Поиск вкуса..."
        />
      </div>

      {/* Filter Toggle */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center gap-2 text-gray-400 mb-4"
      >
        <span>Фильтры</span>
        <ChevronDown
          size={20}
          className={`transition-transform ${showFilters ? 'rotate-180' : ''}`}
        />
        {(selectedBrand || selectedTags.length > 0) && (
          <span className="w-5 h-5 bg-hookah-primary rounded-full text-xs text-white flex items-center justify-center">
            {(selectedBrand ? 1 : 0) + selectedTags.length}
          </span>
        )}
      </button>

      {/* Filters */}
      {showFilters && (
        <div className="space-y-4 mb-6 p-4 bg-hookah-card rounded-2xl border border-white/5">
          {/* Brand Select */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Бренд</label>
            <select
              value={selectedBrand}
              onChange={(e) => {
                setSelectedBrand(e.target.value);
                setSearchParams(e.target.value ? { brandId: e.target.value } : {});
              }}
              className="w-full p-3 bg-hookah-dark border border-white/10 rounded-xl 
                         text-white focus:outline-none focus:border-hookah-primary/50"
            >
              <option value="">Все бренды</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Вкусовой профиль</label>
            <TagFilter
              tags={tags}
              selected={selectedTags}
              onChange={setSelectedTags}
              multiple={true}
            />
          </div>

          {/* Clear */}
          {(selectedBrand || selectedTags.length > 0) && (
            <button
              onClick={() => {
                setSelectedBrand('');
                setSelectedTags([]);
                setSearchParams({});
              }}
              className="text-sm text-red-400 hover:text-red-300"
            >
              Сбросить фильтры
            </button>
          )}
        </div>
      )}

      {/* Results */}
      {loading ? (
        <Loader />
      ) : flavors.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">Ничего не найдено</p>
          <p className="text-sm text-gray-500 mt-2">
            Попробуйте изменить фильтры
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-400 mb-4">
            Найдено: {flavors.length}
          </p>
          <div className="grid gap-3">
            {flavors.map((flavor) => (
              <FlavorCard key={flavor.id} flavor={flavor} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Flavors;
