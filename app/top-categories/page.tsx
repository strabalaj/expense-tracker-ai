'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Expense } from '@/types/expense';
import { storage } from '@/lib/storage';
import { generateTopCategoriesData, filterActiveCategories } from '@/lib/category-utils';
import { formatCurrency } from '@/lib/utils';
import TopCategoryCard from '@/components/TopCategoryCard';

/**
 * Top Expense Categories Page
 * Displays expense data grouped by categories with detailed statistics
 */
export default function TopCategoriesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [displayLimit, setDisplayLimit] = useState(5);
  const [dateFilter, setDateFilter] = useState<'all' | 'month' | 'quarter' | 'year'>('all');

  // Load expenses from localStorage on mount
  useEffect(() => {
    try {
      const loadedExpenses = storage.getExpenses();
      setExpenses(loadedExpenses);
    } catch (error) {
      console.error('Error loading expenses:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Calculate date range based on filter
  const dateRange = useMemo(() => {
    const now = new Date();
    let startDate: string | undefined;
    let endDate: string | undefined;

    switch (dateFilter) {
      case 'month': {
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        startDate = start.toISOString().split('T')[0];
        endDate = end.toISOString().split('T')[0];
        break;
      }
      case 'quarter': {
        const currentQuarter = Math.floor(now.getMonth() / 3);
        const start = new Date(now.getFullYear(), currentQuarter * 3, 1);
        const end = new Date(now.getFullYear(), (currentQuarter + 1) * 3, 0);
        startDate = start.toISOString().split('T')[0];
        endDate = end.toISOString().split('T')[0];
        break;
      }
      case 'year': {
        const start = new Date(now.getFullYear(), 0, 1);
        const end = new Date(now.getFullYear(), 11, 31);
        startDate = start.toISOString().split('T')[0];
        endDate = end.toISOString().split('T')[0];
        break;
      }
      default:
        // 'all' - no date filter
        break;
    }

    return { startDate, endDate };
  }, [dateFilter]);

  // Generate top categories data
  const topCategoriesData = useMemo(() => {
    return generateTopCategoriesData(expenses, {
      limit: displayLimit,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    });
  }, [expenses, displayLimit, dateRange]);

  // Filter out categories with zero spending
  const activeCategories = useMemo(() => {
    return filterActiveCategories(topCategoriesData.categories);
  }, [topCategoriesData.categories]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-gray-600">Loading category data...</p>
        </div>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Top Expense Categories</h1>
            <p className="text-gray-600 mt-1">Analyze your spending by category</p>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Expenses Found</h2>
            <p className="text-gray-600 mb-6">
              Start tracking your expenses to see category breakdowns here.
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Go to Home
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Top Expense Categories</h1>
              <p className="text-gray-600 mt-1">Analyze your spending by category</p>
            </div>
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-100 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center text-xl">
                💰
              </div>
              <h3 className="text-sm font-medium text-gray-600">Total Spending</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(topCategoriesData.totalAmount)}
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-green-100 text-green-600 w-10 h-10 rounded-full flex items-center justify-center text-xl">
                🔢
              </div>
              <h3 className="text-sm font-medium text-gray-600">Transactions</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {topCategoriesData.totalTransactions}
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-purple-100 text-purple-600 w-10 h-10 rounded-full flex items-center justify-center text-xl">
                📊
              </div>
              <h3 className="text-sm font-medium text-gray-600">Active Categories</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {activeCategories.length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Filters</h2>
              <p className="text-sm text-gray-600">Customize your view</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              {/* Date Filter */}
              <div>
                <label htmlFor="dateFilter" className="block text-sm font-medium text-gray-700 mb-1">
                  Time Period
                </label>
                <select
                  id="dateFilter"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value as typeof dateFilter)}
                  className="block w-full sm:w-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="all">All Time</option>
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                  <option value="year">This Year</option>
                </select>
              </div>

              {/* Display Limit */}
              <div>
                <label htmlFor="displayLimit" className="block text-sm font-medium text-gray-700 mb-1">
                  Show Top
                </label>
                <select
                  id="displayLimit"
                  value={displayLimit}
                  onChange={(e) => setDisplayLimit(parseInt(e.target.value))}
                  className="block w-full sm:w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value={3}>3 Categories</option>
                  <option value={5}>5 Categories</option>
                  <option value={6}>All Categories</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Category Cards */}
        {activeCategories.length > 0 ? (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Category Rankings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeCategories.map((categoryStats, index) => (
                <TopCategoryCard
                  key={categoryStats.category}
                  categoryStats={categoryStats}
                  rank={index + 1}
                  showDetails={true}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              No Data for Selected Period
            </h2>
            <p className="text-gray-600">
              Try selecting a different time period or add more expenses.
            </p>
          </div>
        )}

        {/* Additional Info */}
        {activeCategories.length > 0 && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <div className="text-2xl">💡</div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Insights</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>
                    Your top spending category is <strong>{activeCategories[0].category}</strong> with{' '}
                    <strong>{formatCurrency(activeCategories[0].total)}</strong> ({activeCategories[0].percentage.toFixed(1)}% of total)
                  </li>
                  {activeCategories.length > 1 && (
                    <li>
                      Average transaction amount: <strong>{formatCurrency(topCategoriesData.totalAmount / topCategoriesData.totalTransactions)}</strong>
                    </li>
                  )}
                  {activeCategories.length > 2 && (
                    <li>
                      You have expenses spread across <strong>{activeCategories.length}</strong> different categories
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
