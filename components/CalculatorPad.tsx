import React from 'react';

interface CalculatorPadProps {
  onButtonClick: (value: string) => void;
  isScientific: boolean;
}

const Button: React.FC<{
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  span?: number;
}> = ({ onClick, children, className = '', span = 1 }) => {
  const spanClasses = {
    1: 'col-span-1',
    2: 'col-span-2',
    3: 'col-span-3',
    4: 'col-span-4',
  };
  
  return (
    <button
      onClick={onClick}
      className={`
        ${spanClasses[span] || 'col-span-1'}
        h-16 rounded-lg text-2xl font-semibold 
        flex items-center justify-center
        focus:outline-none focus:ring-2 focus:ring-blue-400
        active:scale-95 transition-transform
        ${className}
      `}
    >
      {children}
    </button>
  );
};

const CalculatorPad: React.FC<CalculatorPadProps> = ({ onButtonClick, isScientific }) => {
  const baseButtons = 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600';
  const operatorButtons = 'bg-blue-200 dark:bg-gray-600 text-blue-800 dark:text-blue-200 hover:bg-blue-300 dark:hover:bg-gray-500';
  const specialButtons = 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500';
  const equalsButton = 'bg-blue-600 text-white hover:bg-blue-700';

  const scientificButtons = [
    { value: 'sin', style: specialButtons },
    { value: 'cos', style: specialButtons },
    { value: 'tan', style: specialButtons },
    { value: 'log', style: specialButtons },
    { value: 'sqrt', style: specialButtons },
    { value: '^', style: specialButtons },
    { value: '(', style: specialButtons },
    { value: ')', style: specialButtons },
  ];

  const standardButtons = [
    { value: 'C', style: specialButtons },
    { value: '⌫', style: specialButtons },
    { value: '+/-', style: specialButtons },
    { value: '÷', style: operatorButtons },

    { value: '7', style: baseButtons },
    { value: '8', style: baseButtons },
    { value: '9', style: baseButtons },
    { value: '×', style: operatorButtons },

    { value: '4', style: baseButtons },
    { value: '5', style: baseButtons },
    { value: '6', style: baseButtons },
    { value: '-', style: operatorButtons },

    { value: '1', style: baseButtons },
    { value: '2', style: baseButtons },
    { value: '3', style: baseButtons },
    { value: '+', style: operatorButtons },

    { value: '0', style: baseButtons, span: 2 },
    { value: '.', style: baseButtons },
    { value: '=', style: equalsButton },
  ];

  return (
    <div className="p-4 grid grid-cols-4 gap-3">
       {isScientific && scientificButtons.map(btn => (
        <Button key={btn.value} onClick={() => onButtonClick(btn.value)} className={btn.style}>
          {btn.value}
        </Button>
      ))}
      {standardButtons.map(btn => (
        <Button key={btn.value} onClick={() => onButtonClick(btn.value)} className={btn.style} span={btn.span}>
          {btn.value}
        </Button>
      ))}
    </div>
  );
};

export default CalculatorPad;
