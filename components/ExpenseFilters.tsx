'use client';

import { ExpenseCategory, ExpenseFilters as ExpenseFiltersType } from '@/types/expense';

interface ExpenseFiltersProps {
  filters: ExpenseFiltersType;
  onFiltersChange: (filters: ExpenseFiltersType) => void;
}

const categories: (ExpenseCategory | 'All')[] = [
  'All',
  'Food',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Bills',
  'Other',
];

export default function ExpenseFilters({ filters, onFiltersChange }: ExpenseFiltersProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            value={filters.dateRange.startDate || ''}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                dateRange: { ...filters.dateRange, startDate: e.target.value || null },
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            value={filters.dateRange.endDate || ''}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                dateRange: { ...filters.dateRange, endDate: e.target.value || null },
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            value={filters.category}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                category: e.target.value as ExpenseCategory | 'All',
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
          Search
        </label>
        <input
          type="text"
          id="search"
          value={filters.searchQuery}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              searchQuery: e.target.value,
            })
          }
          placeholder="Search by description or category..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="flex gap-2 pt-2">
        <button
          onClick={() =>
            onFiltersChange({
              dateRange: { startDate: null, endDate: null },
              category: 'All',
              searchQuery: '',
            })
          }
          className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}
