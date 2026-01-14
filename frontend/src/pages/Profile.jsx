import { useEffect, useState } from 'react';
import { User, Heart, ShoppingCart, Sparkles, LogOut } from 'lucide-react';
import { getUserActions } from '../api';
import MixCard from '../components/MixCard';
import Loader from '../components/Loader';
import { useTelegram } from '../hooks/useTelegram';

const Profile = () => {
  const { user, close } = useTelegram();
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('likes');

  useEffect(() => {
    const fetchActions = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      
      try {
        const data = await getUserActions(user.id);
        setActions(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchActions();
  }, [user]);

  const likedMixes = actions
    .filter(a => a.type === 'LIKE' && a.mix)
    .map(a => a.mix);
  
  const orderedMixes = actions
    .filter(a => a.type === 'ORDER' && a.mix)
    .map(a => a.mix);

  const tabs = [
    { id: 'likes', label: 'Понравилось', icon: Heart, count: likedMixes.length },
    { id: 'orders', label: 'Заказы', icon: ShoppingCart, count: orderedMixes.length },
  ];

  if (!user) {
    return (
      <div className="px-4 py-6">
        <div className="text-center py-12">
          <User size={48} className="text-gray-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Вы не авторизованы</h2>
          <p className="text-gray-400">
            Откройте приложение через Telegram бота
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      {/* Profile Card */}
      <div className="bg-hookah-card rounded-2xl p-6 border border-white/5 mb-6">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-hookah-primary to-hookah-secondary 
                          flex items-center justify-center text-2xl font-bold text-white">
            {user.first_name?.charAt(0) || '?'}
          </div>
          
          {/* Info */}
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">
              {user.first_name} {user.last_name || ''}
            </h2>
            {user.username && (
              <p className="text-gray-400">@{user.username}</p>
            )}
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex gap-6 mt-6 pt-6 border-t border-white/5">
          <div className="text-center flex-1">
            <p className="text-2xl font-bold text-white">{likedMixes.length}</p>
            <p className="text-xs text-gray-400">Лайков</p>
          </div>
          <div className="text-center flex-1">
            <p className="text-2xl font-bold text-white">{orderedMixes.length}</p>
            <p className="text-xs text-gray-400">Заказов</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl 
                        font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-hookah-primary text-white'
                : 'bg-hookah-card text-gray-400'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
            {tab.count > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === tab.id ? 'bg-white/20' : 'bg-hookah-dark'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <Loader />
      ) : (
        <div className="space-y-4">
          {activeTab === 'likes' && (
            likedMixes.length === 0 ? (
              <div className="text-center py-12">
                <Heart size={48} className="text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">Пока нет лайков</p>
                <p className="text-sm text-gray-500 mt-1">
                  Лайкните миксы, которые вам понравились
                </p>
              </div>
            ) : (
              likedMixes.map(mix => <MixCard key={mix.id} mix={mix} />)
            )
          )}
          
          {activeTab === 'orders' && (
            orderedMixes.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart size={48} className="text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">Пока нет заказов</p>
                <p className="text-sm text-gray-500 mt-1">
                  Закажите микс на столик
                </p>
              </div>
            ) : (
              orderedMixes.map(mix => <MixCard key={mix.id} mix={mix} />)
            )
          )}
        </div>
      )}

      {/* Close Button */}
      <button
        onClick={close}
        className="w-full mt-8 py-4 bg-hookah-card rounded-2xl text-gray-400 
                   flex items-center justify-center gap-2 hover:text-white transition-colors"
      >
        <LogOut size={20} />
        Закрыть приложение
      </button>
    </div>
  );
};

export default Profile;
