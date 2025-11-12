import React, { useState } from 'react';
import Display from '../components/Display';
import CalculatorPad from '../components/CalculatorPad';
import { evaluateExpression } from '../services/calculatorEngine';
import { addHistoryItem } from '../services/storage';
import { CalculationHistoryItem } from '../types';

const Calculator: React.FC = () => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [isScientific, setIsScientific] = useState(false);
  const [justCalculated, setJustCalculated] = useState(false);

  const handleButtonClick = (value: string) => {
    if (result.startsWith('Error')) {
        setResult('');
        setExpression('');
    }

    // If a calculation was just made, the next action is handled specially.
    if (justCalculated) {
        setJustCalculated(false); // Reset for the next action.

        if (['+', '-', '×', '÷', '^'].includes(value)) {
            setExpression(prev => prev + value); // Continue calculation with the result.
            return;
        }
        
        if (['sin', 'cos', 'tan', 'log', 'sqrt'].includes(value)) {
            setExpression(prev => `${value}(${prev})`); // Apply function to the result.
            return;
        }
        
        // Otherwise, a new calculation is started.
        setResult('');
        if (value === '.') {
            setExpression('0.');
        } else {
            setExpression(value);
        }
        return;
    }

    // Default behavior when not immediately after a calculation.
    switch (value) {
      case '=':
        if (!expression) return;
        const calcResult = evaluateExpression(expression);
        setResult(calcResult);
        if (!calcResult.startsWith('Error')) {
          const historyItem: CalculationHistoryItem = {
            id: new Date().toISOString(),
            timestamp: Date.now(),
            type: 'calculation',
            expression,
            result: calcResult,
          };
          addHistoryItem(historyItem);
          setExpression(calcResult);
          setJustCalculated(true);
        }
        break;
      case 'C':
        setExpression('');
        setResult('');
        break;
      case '⌫':
        setExpression(prev => prev.slice(0, -1));
        break;
      case '+/-':
        // A simple implementation for toggling the sign of the last number
        setExpression(prev => {
            const parts = prev.split(/([+\-×÷^])/);
            const lastPart = parts.pop() || '';
            if (lastPart.startsWith('-')) {
                return parts.join('') + lastPart.substring(1);
            } else {
                return parts.join('') + `-${lastPart}`;
            }
        });
        break;
      case 'sin':
      case 'cos':
      case 'tan':
      case 'log':
      case 'sqrt':
        setExpression(prev => prev + `${value}(`);
        break;
      case '.':
        // Prevent multiple dots in a number
        const currentNumber = expression.split(/([+\-×÷^])/).pop() || '';
        if (currentNumber.includes('.')) return;
        setExpression(prev => prev + value);
        break;
      default:
        setExpression(prev => prev + value);
        break;
    }
  };

  return (
    <div className="flex flex-col h-full">
        <div className="flex-grow">
            <Display expression={expression} result={result} />
        </div>
        <div className="p-4 bg-gray-100 dark:bg-gray-900">
            <label className="flex items-center justify-end space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <span>Scientific Mode</span>
                <div className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={isScientific} onChange={() => setIsScientific(!isScientific)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </div>
            </label>
        </div>
        <div className="bg-gray-200 dark:bg-gray-800 rounded-b-lg">
            <CalculatorPad onButtonClick={handleButtonClick} isScientific={isScientific} />
        </div>
    </div>
  );
};

export default Calculator;
