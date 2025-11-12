
import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { MoonIcon, SunIcon } from '../components/Icons';
import { APP_VERSION, SUPPORT_EMAIL } from '../constants';

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="p-4">
      <div className="max-w-md mx-auto space-y-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <ul>
            <li className="border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between p-4">
                <span className="font-medium">Dark Mode</span>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                >
                  {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                </button>
              </div>
            </li>
            <li className="border-b border-gray-200 dark:border-gray-700">
              <Link to="/privacy" className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
               <a href={`mailto:${SUPPORT_EMAIL}`} className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Contact Support
              </a>
            </li>
          </ul>
        </div>

        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Smartcalcu Version {APP_VERSION}</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
