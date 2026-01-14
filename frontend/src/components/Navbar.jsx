import { NavLink } from 'react-router-dom';
import { Home, Search, Sparkles, User } from 'lucide-react';

const Navbar = () => {
  const navItems = [
    { to: '/', icon: Home, label: 'Главная' },
    { to: '/flavors', icon: Search, label: 'Вкусы' },
    { to: '/mixes', icon: Sparkles, label: 'Миксы' },
    { to: '/profile', icon: User, label: 'Профиль' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="bg-hookah-dark/95 backdrop-blur-lg border-t border-white/10">
        <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-hookah-primary bg-hookah-primary/10'
                    : 'text-gray-400 hover:text-white'
                }`
              }
            >
              <Icon size={22} />
              <span className="text-[10px] font-medium">{label}</span>
            </NavLink>
          ))}
        </div>
      </div>
      {/* Safe area для iPhone */}
      <div className="h-safe-area-inset-bottom bg-hookah-dark"></div>
    </nav>
  );
};

export default Navbar;
