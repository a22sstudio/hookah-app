import { Search, X } from 'lucide-react';

const SearchBar = ({ value, onChange, placeholder = 'Поиск...' }) => {
  return (
    <div className="relative">
      <Search 
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
        size={20} 
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-3 bg-hookah-card border border-white/10 rounded-xl 
                   text-white placeholder-gray-500 focus:outline-none focus:border-hookah-primary/50
                   transition-colors"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 
                     hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
