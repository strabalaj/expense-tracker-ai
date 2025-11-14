'use client';

import { Expense } from '@/types/expense';
import { formatCurrency, formatDate, categoryColors, categoryIcons } from '@/lib/utils';

interface ExpenseItemProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export default function ExpenseItem({ expense, onEdit, onDelete }: ExpenseItemProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div className={`w-10 h-10 rounded-full ${categoryColors[expense.category]} flex items-center justify-center text-xl flex-shrink-0`}>
            {categoryIcons[expense.category]}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 truncate">{expense.description}</h3>
              <span className="font-bold text-lg text-gray-900 whitespace-nowrap">
                {formatCurrency(expense.amount)}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100">
                {expense.category}
              </span>
              <span>{formatDate(expense.date)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
        <button
          onClick={() => onEdit(expense)}
          className="flex-1 text-sm px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors font-medium"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(expense.id)}
          className="flex-1 text-sm px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors font-medium"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
