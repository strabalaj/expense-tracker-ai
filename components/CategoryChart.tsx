'use client';

import { ExpenseCategory } from '@/types/expense';
import { formatCurrency, categoryColors, categoryIcons } from '@/lib/utils';

interface CategoryChartProps {
  data: Record<ExpenseCategory, number>;
  total: number;
}

export default function CategoryChart({ data, total }: CategoryChartProps) {
  const sortedCategories = (Object.entries(data) as [ExpenseCategory, number][])
    .filter(([, amount]) => amount > 0)
    .sort(([, a], [, b]) => b - a);

  if (sortedCategories.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending by Category</h3>
        <div className="text-center py-8 text-gray-500">
          No data available
        </div>
      </div>
    );
  }

  const maxAmount = Math.max(...sortedCategories.map(([, amount]) => amount));

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Spending by Category</h3>

      <div className="space-y-4">
        {sortedCategories.map(([category, amount]) => {
          const percentage = total > 0 ? (amount / total) * 100 : 0;
          const barWidth = maxAmount > 0 ? (amount / maxAmount) * 100 : 0;

          return (
            <div key={category} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{categoryIcons[category]}</span>
                  <span className="font-medium text-gray-700">{category}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{formatCurrency(amount)}</div>
                  <div className="text-xs text-gray-500">{percentage.toFixed(1)}%</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`${categoryColors[category]} h-full rounded-full transition-all duration-500`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
