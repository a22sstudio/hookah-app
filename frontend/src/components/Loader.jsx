const Loader = ({ text = 'Загрузка...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-hookah-primary/20 rounded-full"></div>
        <div className="w-12 h-12 border-4 border-hookah-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
      </div>
      <p className="text-gray-400 text-sm">{text}</p>
    </div>
  );
};

export default Loader;
