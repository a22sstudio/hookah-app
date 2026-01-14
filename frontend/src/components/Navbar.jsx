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
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-2">
      <div className="mx-auto max-w-md">
        <div className="flex items-center justify-around rounded-2xl bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 p-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to || 
              (item.to !== '/' && location.pathname.startsWith(item.to));
            const Icon = item.icon;
            
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`
                  flex flex-col items-center gap-1 px-4 py-2 rounded-xl
                  transition-all duration-200
                  ${isActive 
                    ? 'bg-emerald-500/20 text-emerald-400' 
                    : 'text-zinc-500 hover:text-zinc-300'
                  }
                `}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-xs font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
