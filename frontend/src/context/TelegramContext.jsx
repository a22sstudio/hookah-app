import { createContext, useContext } from 'react';
import { useTelegram } from '../hooks/useTelegram';

const TelegramContext = createContext(null);

export const TelegramProvider = ({ children }) => {
  const telegram = useTelegram();
  
  return (
    <TelegramContext.Provider value={telegram}>
      {children}
    </TelegramContext.Provider>
  );
};

export const useTelegramContext = () => {
  const context = useContext(TelegramContext);
  if (!context) {
    throw new Error('useTelegramContext must be used within TelegramProvider');
  }
  return context;
};
