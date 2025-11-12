
import React from 'react';

interface DisplayProps {
  expression: string;
  result: string;
}

const Display: React.FC<DisplayProps> = ({ expression, result }) => {
  return (
    <div className="bg-gray-200 dark:bg-gray-800 p-6 text-right rounded-t-lg flex flex-col justify-end h-36">
      <div className="text-gray-500 dark:text-gray-400 text-xl h-8 overflow-x-auto overflow-y-hidden whitespace-nowrap">
        {expression || ' '}
      </div>
      <div className="text-gray-900 dark:text-gray-100 text-5xl font-mono font-bold h-14 overflow-x-auto overflow-y-hidden whitespace-nowrap">
        {result || '0'}
      </div>
    </div>
  );
};

export default Display;
