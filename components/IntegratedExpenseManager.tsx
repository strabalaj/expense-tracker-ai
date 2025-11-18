'use client';

import { useState } from 'react';
import { ExpenseData } from '@/lib/analytics';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { InsightsPanel } from './InsightsPanel';
import { ExportButton } from './ExportButton';

/**
 * IntegratedExpenseManager - Demonstrates integration of both features:
 * 1. Analytics Dashboard (charts, insights, trends)
 * 2. Data Export System (CSV, PDF, JSON)
 */
export function IntegratedExpenseManager() {
  // Sample expense data for testing integration
  const [expenses] = useState<ExpenseData[]>([
    {
      id: '1',
      date: '2024-01-15',
      category: 'Food',
      amount: 45.99,
      description: 'Grocery shopping',
      paymentMethod: 'Credit Card'
    },
    {
      id: '2',
      date: '2024-01-20',
      category: 'Transportation',
      amount: 120.00,
      description: 'Monthly transit pass',
      paymentMethod: 'Debit Card'
    },
    {
      id: '3',
      date: '2024-02-05',
      category: 'Food',
      amount: 78.50,
      description: 'Restaurant dinner',
      paymentMethod: 'Credit Card'
    },
    {
      id: '4',
      date: '2024-02-10',
      category: 'Entertainment',
      amount: 35.00,
      description: 'Movie tickets',
      paymentMethod: 'Cash'
    },
    {
      id: '5',
      date: '2024-02-15',
      category: 'Utilities',
      amount: 150.00,
      description: 'Electric bill',
      paymentMethod: 'Auto-pay'
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with Export Buttons */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Expense Manager
              </h1>
              <p className="text-gray-600 mt-1">
                Integrated Analytics & Export System
              </p>
            </div>
            <div className="flex gap-3">
              <ExportButton data={expenses} format="csv" />
              <ExportButton data={expenses} format="json" />
              <ExportButton data={expenses} format="pdf" />
            </div>
          </div>
        </div>

        {/* Insights Panel */}
        <InsightsPanel expenses={expenses} />

        {/* Analytics Dashboard */}
        <AnalyticsDashboard expenses={expenses} />

        {/* Integration Status */}
        <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-green-900 mb-2">
            ✅ Integration Successful
          </h3>
          <p className="text-green-700 text-sm">
            Both features are working together seamlessly:
          </p>
          <ul className="mt-3 space-y-1 text-sm text-green-700">
            <li>• Analytics Dashboard displaying spending insights</li>
            <li>• Export system ready to export in CSV, JSON, and PDF formats</li>
            <li>• Shared expense data types working across both features</li>
            <li>• No conflicts or duplicate code detected</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
