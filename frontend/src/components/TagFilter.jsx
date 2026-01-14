const TagFilter = ({ tags, selected, onChange, multiple = true }) => {
  const handleClick = (tag) => {
    if (multiple) {
      if (selected.includes(tag)) {
        onChange(selected.filter(t => t !== tag));
      } else {
        onChange([...selected, tag]);
      }
    } else {
      onChange(selected === tag ? null : tag);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => {
        const isSelected = multiple 
          ? selected.includes(tag.value) 
          : selected === tag.value;
        
        return (
          <button
            key={tag.value}
            onClick={() => handleClick(tag.value)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200
              ${isSelected 
                ? 'bg-hookah-primary text-white shadow-lg shadow-hookah-primary/25' 
                : 'bg-hookah-card text-gray-300 hover:bg-hookah-card/80 border border-white/10'
              }`}
          >
            {tag.label}
          </button>
        );
      })}
    </div>
  );
};

export default TagFilter;
