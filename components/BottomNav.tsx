
import React from 'react';
import { NavLink } from 'react-router-dom';
import { CalculatorIcon, ConverterIcon, SettingsIcon, SupportIcon } from './Icons';

const NavItem: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => {
    const baseClasses = "flex flex-col items-center justify-center w-full h-full text-gray-500 dark:text-gray-400 transition-colors";
    const activeClasses = "!text-blue-600 dark:!text-blue-400";
    return (
        <NavLink to={to} className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : ''}`}>
            {children}
        </NavLink>
    );
};

const BottomNav: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg grid grid-cols-4">
      <NavItem to="/">
        <CalculatorIcon className="w-6 h-6 mb-1" />
        <span className="text-xs">Calculator</span>
      </NavItem>
      <NavItem to="/converter">
        <ConverterIcon className="w-6 h-6 mb-1" />
        <span className="text-xs">Converter</span>
      </NavItem>
      <NavItem to="/support">
        <SupportIcon className="w-6 h-6 mb-1" />
        <span className="text-xs">Support</span>
      </NavItem>
      <NavItem to="/settings">
        <SettingsIcon className="w-6 h-6 mb-1" />
        <span className="text-xs">Settings</span>
      </NavItem>
    </nav>
  );
};

export default BottomNav;
