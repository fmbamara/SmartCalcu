
export interface HistoryItem {
  id: string;
  timestamp: number;
  type: 'calculation' | 'conversion';
}

export interface CalculationHistoryItem extends HistoryItem {
  type: 'calculation';
  expression: string;
  result: string;
}

export interface ConversionHistoryItem extends HistoryItem {
  type: 'conversion';
  fromUnit: string;
  toUnit: string;
  fromValue: string;
  toValue: string;
  category: 'Currency' | 'Length' | 'Temperature';
}

export type AnyHistoryItem = CalculationHistoryItem | ConversionHistoryItem;

export interface CurrencyCache {
  timestamp: number;
  base: string;
  rates: { [key: string]: number };
}
