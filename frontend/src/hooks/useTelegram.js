import { useCallback, useEffect, useState } from 'react';

const tg = window.Telegram?.WebApp;

export const useTelegram = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (tg) {
      tg.ready();
      tg.expand();
      setIsReady(true);
      
      // Устанавливаем цвета только если поддерживается
      try {
        if (tg.setHeaderColor) tg.setHeaderColor('#111827');
        if (tg.setBackgroundColor) tg.setBackgroundColor('#111827');
      } catch (e) {
        // Игнорируем ошибки в браузере
      }
    }
  }, []);

  const user = tg?.initDataUnsafe?.user;

  const hapticFeedback = useCallback((type = 'impact', style = 'medium') => {
    try {
      if (tg?.HapticFeedback) {
        if (type === 'impact') {
          tg.HapticFeedback.impactOccurred(style);
        } else if (type === 'notification') {
          tg.HapticFeedback.notificationOccurred(style);
        }
      }
    } catch (e) {
      // Игнорируем
    }
  }, []);

  const showAlert = useCallback((message) => {
    if (tg?.showAlert) {
      tg.showAlert(message);
    } else {
      alert(message);
    }
  }, []);

  const close = useCallback(() => {
    tg?.close?.();
  }, []);

  return {
    tg,
    user,
    isReady,
    hapticFeedback,
    showAlert,
    close,
    colorScheme: tg?.colorScheme || 'dark',
  };
};

export default useTelegram;
