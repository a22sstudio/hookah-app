import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Layers, FlaskConical, User } from 'lucide-react';

const navItems = [
  { to: '/', icon: Home, label: 'Главная' },
  { to: '/flavors', icon: Layers, label: 'Вкусы' },
  { to: '/mixes', icon: FlaskConical, label: 'Миксы' },
  { to: '/profile', icon: User, label: 'Профиль' },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
      {/* Blur background */}
      <div className="absolute inset-0 glass-solid" />
      
      {/* Content */}
      <div className="relative px-6 pt-2 pb-2">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to || 
              (item.to !== '/' && location.pathname.startsWith(item.to));
            const Icon = item.icon;
            
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className="flex flex-col items-center gap-1 py-2 px-4 press-effect"
              >
                <div className={`
                  p-2 rounded-ios-lg transition-all duration-200
                  ${isActive 
                    ? 'bg-accent-green/20' 
                    : 'bg-transparent'
                  }
                `}>
                  <Icon 
                    size={22} 
                    className={`transition-colors duration-200 ${
                      isActive 
                        ? 'text-accent-green' 
                        : 'text-text-tertiary'
                    }`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                </div>
                <span className={`
                  text-caption-2 font-medium transition-colors duration-200
                  ${isActive ? 'text-accent-green' : 'text-text-tertiary'}
                `}>
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
