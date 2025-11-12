
import React, { useState, useMemo } from 'react';
import { CURRENCIES, LENGTH_UNITS, TEMPERATURE_UNITS } from '../constants';
import { addHistoryItem } from '../services/storage';
import { ConversionHistoryItem } from '../types';
import { useNetwork } from '../hooks/useNetwork';
import { getRates } from '../services/currencyService';
import { SwapIcon } from '../components/Icons';

type Category = 'Currency' | 'Length' | 'Temperature';

const Converter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Category>('Currency');
  
  return (
    <div className="p-4">
      <div className="mb-4 flex justify-center bg-gray-200 dark:bg-gray-800 rounded-lg p-1">
        {(['Currency', 'Length', 'Temperature'] as Category[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`w-full py-2 px-4 text-sm font-semibold rounded-md transition-colors ${
              activeTab === tab 
                ? 'bg-blue-600 text-white shadow' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      
      {activeTab === 'Currency' && <ConverterPanel category="Currency" units={CURRENCIES} />}
      {activeTab === 'Length' && <ConverterPanel category="Length" units={LENGTH_UNITS} />}
      {activeTab === 'Temperature' && <ConverterPanel category="Temperature" units={TEMPERATURE_UNITS} />}
    </div>
  );
};

interface ConverterPanelProps {
  category: Category;
  units: readonly string[];
}

const ConverterPanel: React.FC<ConverterPanelProps> = ({ category, units }) => {
    const [fromUnit, setFromUnit] = useState(category === 'Currency' ? 'USD' : units[0]);
    const [toUnit, setToUnit] = useState(category === 'Currency' ? 'NGN' : units[1]);
    const [fromValue, setFromValue] = useState('1');
    const [toValue, setToValue] = useState('');
    const [rates, setRates] = useState<{ [key: string]: number }>({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [lastUpdated, setLastUpdated] = useState<number | undefined>();
    const [isCached, setIsCached] = useState(false);

    const { isOnline } = useNetwork();

    const convert = useMemo(() => {
        // Length Conversions (to meter)
        const lengthFactors = {
            Meter: 1, Kilometer: 1000, Centimeter: 0.01, Millimeter: 0.001,
            Mile: 1609.34, Yard: 0.9144, Foot: 0.3048, Inch: 0.0254,
        };
        
        return (val: number, from: string, to: string) => {
            if (!val || isNaN(val)) return 0;
            switch (category) {
                case 'Length': {
                    const fromFactor = lengthFactors[from];
                    const toFactor = lengthFactors[to];
                    if(fromFactor && toFactor) {
                        return (val * fromFactor) / toFactor;
                    }
                    return 0;
                }
                case 'Temperature': {
                    if (from === to) return val;
                    let celsius;
                    if (from === 'Celsius') celsius = val;
                    else if (from === 'Fahrenheit') celsius = (val - 32) * 5/9;
                    else if (from === 'Kelvin') celsius = val - 273.15;
                    else return 0;

                    if (to === 'Celsius') return celsius;
                    if (to === 'Fahrenheit') return (celsius * 9/5) + 32;
                    if (to === 'Kelvin') return celsius + 273.15;
                    return 0;
                }
                case 'Currency': {
                    if (rates && rates[to] && rates[from]) {
                        return (val / rates[from]) * rates[to];
                    }
                    return 0;
                }
                default:
                    return 0;
            }
        };
    }, [category, rates]);

    React.useEffect(() => {
        if (category === 'Currency') {
            setIsLoading(true);
            setError('');
            getRates(fromUnit)
                .then(data => {
                    setRates(data.rates);
                    setLastUpdated(data.timestamp);
                    setIsCached(data.isCached);
                })
                .catch(err => setError(err.message))
                .finally(() => setIsLoading(false));
        }
    }, [category, fromUnit, isOnline]);

    React.useEffect(() => {
        const val = parseFloat(fromValue);
        const result = convert(val, fromUnit, toUnit);
        const formattedResult = result % 1 === 0 ? result.toString() : result.toFixed(4);
        setToValue(formattedResult);
    }, [fromValue, fromUnit, toUnit, convert]);

    const handleConvert = () => {
        if (fromValue && toValue) {
            const historyItem: ConversionHistoryItem = {
                id: new Date().toISOString(),
                timestamp: Date.now(),
                type: 'conversion',
                category,
                fromUnit, toUnit, fromValue, toValue
            };
            addHistoryItem(historyItem);
        }
    };
    
    const swapUnits = () => {
        setFromUnit(toUnit);
        setToUnit(fromUnit);
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-6">
            {!isOnline && <div className="text-center text-sm bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 p-2 rounded-md">You are offline. {category === 'Currency' && 'Showing cached rates.'}</div>}
            {error && <div className="text-center text-sm bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-2 rounded-md">{error}</div>}
            
            <div className="flex items-center space-x-4">
                <UnitInput label="From" units={units} selectedUnit={fromUnit} onUnitChange={setFromUnit} value={fromValue} onValueChange={setFromValue} />
                <button onClick={swapUnits} className="mt-8 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                    <SwapIcon className="w-6 h-6 text-gray-600 dark:text-gray-300"/>
                </button>
                <UnitInput label="To" units={units} selectedUnit={toUnit} onUnitChange={setToUnit} value={toValue} readOnly />
            </div>

            <button onClick={handleConvert} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300" disabled={!fromValue}>
                Save to History
            </button>
            
            {category === 'Currency' && (
                <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                    {isLoading ? 'Loading rates...' : (
                        lastUpdated && `Rates from ${new Date(lastUpdated).toLocaleString()}. ${isCached ? '(Cached)' : ''}`
                    )}
                </div>
            )}
        </div>
    );
};

interface UnitInputProps {
    label: string;
    units: readonly string[];
    selectedUnit: string;
    onUnitChange: (unit: string) => void;
    value: string;
    onValueChange?: (value: string) => void;
    readOnly?: boolean;
}

const UnitInput: React.FC<UnitInputProps> = ({ label, units, selectedUnit, onUnitChange, value, onValueChange, readOnly }) => {
    return (
        <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
            <div className="mt-1 relative rounded-md shadow-sm">
                <input 
                    type="number" 
                    value={value}
                    onChange={e => onValueChange?.(e.target.value)}
                    readOnly={readOnly}
                    className={`
                        w-full p-3 pr-24 rounded-lg border
                        bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 
                        focus:ring-blue-500 focus:border-blue-500
                        ${readOnly ? 'text-gray-500 dark:text-gray-400' : ''}
                    `}
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                    <select
                        value={selectedUnit}
                        onChange={e => onUnitChange(e.target.value)}
                        className="h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 dark:text-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-md"
                    >
                        {units.map(unit => <option key={unit}>{unit}</option>)}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default Converter;
