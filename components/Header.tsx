
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HistoryIcon } from './Icons';

const Header: React.FC = () => {
    const location = useLocation();
    const getTitle = () => {
        switch (location.pathname) {
            case '/': return 'Calculator';
            case '/converter': return 'Converter';
            case '/history': return 'History';
            case '/support': return 'Support';
            case '/settings': return 'Settings';
            case '/privacy': return 'Privacy Policy';
            default: return 'Smartcalcu';
        }
    };
    
  return (
    <header className="bg-blue-600 dark:bg-gray-800 text-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <h1 className="text-xl font-bold">
            {getTitle()}
        </h1>
        <Link to="/history" className="p-2 rounded-full hover:bg-blue-700 dark:hover:bg-gray-700 transition-colors">
            <HistoryIcon className="w-6 h-6" />
        </Link>
      </div>
    </header>
  );
};

export default Header;
