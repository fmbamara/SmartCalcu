
import React, { useState, useEffect } from 'react';
import { getHistory, saveHistory } from '../services/storage';
import { AnyHistoryItem, CalculationHistoryItem, ConversionHistoryItem } from '../types';
import { TrashIcon } from '../components/Icons';

const History: React.FC = () => {
  const [historyItems, setHistoryItems] = useState<AnyHistoryItem[]>([]);

  useEffect(() => {
    setHistoryItems(getHistory());
  }, []);

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all history?')) {
      saveHistory([]);
      setHistoryItems([]);
    }
  };

  const handleDeleteItem = (id: string) => {
    const newHistory = historyItems.filter(item => item.id !== id);
    saveHistory(newHistory);
    setHistoryItems(newHistory);
  };

  return (
    <div className="p-4 space-y-4">
      {historyItems.length > 0 ? (
        <>
            <div className="flex justify-end">
                <button
                    onClick={handleClearAll}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
                >
                    Clear All
                </button>
            </div>
            <div className="space-y-3">
                {historyItems.map(item => (
                    <HistoryCard key={item.id} item={item} onDelete={handleDeleteItem} />
                ))}
            </div>
        </>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No History Yet</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Your calculations and conversions will appear here.</p>
        </div>
      )}
    </div>
  );
};

const HistoryCard: React.FC<{ item: AnyHistoryItem; onDelete: (id: string) => void }> = ({ item, onDelete }) => {
    const isCalc = item.type === 'calculation';
    const itemAsCalc = item as CalculationHistoryItem;
    const itemAsConv = item as ConversionHistoryItem;

    const getBadgeColor = (category?: string) => {
        switch (category) {
            case 'Currency': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'Length': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
            case 'Temperature': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
        }
    };
    
    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex items-start justify-between">
            <div className="flex-grow">
                <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getBadgeColor(isCalc ? 'Calculation' : itemAsConv.category)}`}>
                        {isCalc ? 'Calculation' : itemAsConv.category}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(item.timestamp).toLocaleString()}</span>
                </div>
                {isCalc ? (
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{itemAsCalc.expression}</p>
                        <p className="text-lg font-bold font-mono">{itemAsCalc.result}</p>
                    </div>
                ) : (
                    <div className="flex items-center space-x-2 text-lg">
                        <span className="font-semibold">{itemAsConv.fromValue} {itemAsConv.fromUnit}</span>
                        <span>→</span>
                        <span className="font-bold text-blue-600 dark:text-blue-400">{itemAsConv.toValue} {itemAsConv.toUnit}</span>
                    </div>
                )}
            </div>
            <button onClick={() => onDelete(item.id)} className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors rounded-full">
                <TrashIcon className="w-5 h-5"/>
            </button>
        </div>
    )
}

export default History;
