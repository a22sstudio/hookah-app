// Форматирование
export const formatStrength = (strength) => {
  const map = {
    LIGHT: '🌱 Лёгкий',
    MEDIUM: '🌿 Средний',
    STRONG: '🔥 Крепкий',
  };
  return map[strength] || strength;
};

export const formatTag = (tag) => {
  const map = {
    SWEET: '🍬 Сладкий',
    SOUR: '🍋 Кислый',
    FRESH: '🌿 Свежий',
    FRUITY: '🍎 Фруктовый',
    BERRY: '🍓 Ягодный',
    CITRUS: '🍊 Цитрусовый',
    MINT: '🌱 Мятный',
    ICE: '❄️ Ледяной',
    TROPICAL: '🏝️ Тропический',
    CREAMY: '🥛 Сливочный',
    DESSERT: '🍰 Десертный',
    SPICY: '🌶️ Пряный',
  };
  return map[tag] || tag;
};

// Склонение слов
export const pluralize = (count, words) => {
  const cases = [2, 0, 1, 1, 1, 2];
  return words[
    count % 100 > 4 && count % 100 < 20
      ? 2
      : cases[Math.min(count % 10, 5)]
  ];
};

// Дебаунс
export const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
