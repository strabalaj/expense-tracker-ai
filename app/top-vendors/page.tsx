'use client';

import { useState, useEffect } from 'react';
import { Expense } from '@/types/expense';
import { storage } from '@/lib/storage';
import { formatCurrency, aggregateVendorData } from '@/lib/utils';
import VendorCard from '@/components/VendorCard';
import Link from 'next/link';

export default function TopVendorsPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showLimit, setShowLimit] = useState(10);
  const [sortBy, setSortBy] = useState<'amount' | 'transactions' | 'average'>('amount');

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🏪</div>
          <p className="text-gray-600">Loading vendor data...</p>
        </div>
      </div>
    );
  }

  const allVendorData = aggregateVendorData(expenses);

  const sortedVendorData = [...allVendorData].sort((a, b) => {
    switch (sortBy) {
      case 'amount':
        return b.totalAmount - a.totalAmount;
      case 'transactions':
        return b.transactionCount - a.transactionCount;
      case 'average':
        return b.averageAmount - a.averageAmount;
      default:
        return 0;
    }
  });

  const displayedVendors = sortedVendorData.slice(0, showLimit);

  const totalSpent = allVendorData.reduce((sum, v) => sum + v.totalAmount, 0);
  const totalTransactions = allVendorData.reduce((sum, v) => sum + v.transactionCount, 0);
  const uniqueVendors = allVendorData.length;

  const expensesWithVendors = expenses.filter(e => e.vendor && e.vendor.trim() !== '');
  const coveragePercentage = expenses.length > 0
    ? ((expensesWithVendors.length / expenses.length) * 100).toFixed(1)
    : '0';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-4">
                <Link
                  href="/"
                  className="text-blue-600 hover:text-blue-700 transition-colors"
                >
                  ← Back to Dashboard
                </Link>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mt-2">Top Vendors</h1>
              <p className="text-gray-600 mt-1">Analyze your spending by vendor and merchant</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Vendors</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{uniqueVendors}</p>
              </div>
              <div className="text-3xl">🏪</div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(totalSpent)}</p>
              </div>
              <div className="text-3xl">💰</div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Transactions</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{totalTransactions}</p>
              </div>
              <div className="text-3xl">📊</div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Data Coverage</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{coveragePercentage}%</p>
              </div>
              <div className="text-3xl">📈</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'amount' | 'transactions' | 'average')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="amount">Total Amount</option>
                <option value="transactions">Transaction Count</option>
                <option value="average">Average Amount</option>
              </select>
            </div>

            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Show:</label>
              <select
                value={showLimit}
                onChange={(e) => setShowLimit(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>Top 5</option>
                <option value={10}>Top 10</option>
                <option value={20}>Top 20</option>
                <option value={50}>Top 50</option>
                <option value={allVendorData.length}>All ({allVendorData.length})</option>
              </select>
            </div>
          </div>
        </div>

        {/* Vendor List */}
        {displayedVendors.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">🏪</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Vendor Data Available</h3>
            <p className="text-gray-600 mb-4">
              Start adding vendors to your expenses to see insights here.
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedVendors.map((vendor, index) => (
              <VendorCard
                key={vendor.vendor}
                vendor={vendor}
                rank={index + 1}
              />
            ))}
          </div>
        )}

        {/* Load More Info */}
        {displayedVendors.length < allVendorData.length && (
          <div className="mt-6 text-center text-sm text-gray-600">
            Showing {displayedVendors.length} of {allVendorData.length} vendors
          </div>
        )}
      </main>
    </div>
  );
}
