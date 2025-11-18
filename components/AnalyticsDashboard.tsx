'use client';

import { useMemo } from 'react';
import { AnalyticsService, ExpenseData, ChartUtils } from '@/lib/analytics';

interface AnalyticsDashboardProps {
  expenses: ExpenseData[];
}

export function AnalyticsDashboard({ expenses }: AnalyticsDashboardProps) {
  const analytics = useMemo(
    () => AnalyticsService.calculateAnalytics(expenses),
    [expenses]
  );

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm font-medium">Total Expenses</h3>
          <p className="text-3xl font-bold text-gray-900">
            {ChartUtils.formatCurrency(analytics.totalAmount)}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {analytics.totalExpenses} transactions
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm font-medium">Average Expense</h3>
          <p className="text-3xl font-bold text-gray-900">
            {ChartUtils.formatCurrency(analytics.averageExpense)}
          </p>
          <p className="text-sm text-gray-500 mt-1">per transaction</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm font-medium">Top Category</h3>
          <p className="text-3xl font-bold text-gray-900">
            {analytics.categoryBreakdown[0]?.category || 'N/A'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {analytics.categoryBreakdown[0]
              ? ChartUtils.formatCurrency(analytics.categoryBreakdown[0].total)
              : '$0.00'}
          </p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
        <div className="space-y-3">
          {analytics.categoryBreakdown.map((cat) => (
            <div key={cat.category} className="flex items-center">
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{cat.category}</span>
                  <span className="text-sm text-gray-600">
                    {ChartUtils.formatCurrency(cat.total)} (
                    {ChartUtils.formatPercentage(cat.percentage)})
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Monthly Trends</h3>
        <div className="space-y-2">
          {analytics.monthlyTrends.map(trend => (
            <div key={trend.month} className="flex justify-between items-center">
              <span className="text-sm font-medium">
                {ChartUtils['formatMonthLabel'](trend.month)}
              </span>
              <div className="text-right">
                <span className="text-sm font-semibold">
                  {ChartUtils.formatCurrency(trend.total)}
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  ({trend.count} expenses)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Expenses */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Top 5 Expenses</h3>
        <div className="space-y-3">
          {analytics.topExpenses.map((expense, index) => (
            <div
              key={expense.id}
              className="flex justify-between items-start border-b pb-2"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-400">
                    #{index + 1}
                  </span>
                  <div>
                    <p className="font-medium">{expense.description}</p>
                    <p className="text-sm text-gray-500">
                      {expense.category} • {expense.date}
                    </p>
                  </div>
                </div>
              </div>
              <span className="font-semibold text-lg">
                {ChartUtils.formatCurrency(expense.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
