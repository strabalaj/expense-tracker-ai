'use client';

import { useMemo } from 'react';
import { AnalyticsService, ExpenseData, ChartUtils } from '@/lib/analytics';

interface InsightsPanelProps {
  expenses: ExpenseData[];
}

export function InsightsPanel({ expenses }: InsightsPanelProps) {
  const insights = useMemo(() => {
    const analytics = AnalyticsService.calculateAnalytics(expenses);
    const insights: string[] = [];

    // Category insights
    if (analytics.categoryBreakdown.length > 0) {
      const topCategory = analytics.categoryBreakdown[0];
      insights.push(
        `Your highest spending category is ${topCategory.category} at ${ChartUtils.formatPercentage(topCategory.percentage)} of total expenses.`
      );
    }

    // Monthly trend insights
    if (analytics.monthlyTrends.length >= 2) {
      const recent = analytics.monthlyTrends[analytics.monthlyTrends.length - 1];
      const previous = analytics.monthlyTrends[analytics.monthlyTrends.length - 2];
      const change = ChartUtils.calculatePercentageChange(recent.total, previous.total);

      if (change > 10) {
        insights.push(
          `Your spending increased by ${ChartUtils.formatPercentage(Math.abs(change))} compared to last month.`
        );
      } else if (change < -10) {
        insights.push(
          `Great job! Your spending decreased by ${ChartUtils.formatPercentage(Math.abs(change))} compared to last month.`
        );
      }
    }

    // Average expense insight
    if (analytics.averageExpense > 0) {
      const aboveAverage = expenses.filter(e => e.amount > analytics.averageExpense).length;
      const percentage = (aboveAverage / analytics.totalExpenses) * 100;
      insights.push(
        `${ChartUtils.formatPercentage(percentage)} of your expenses are above the average of ${ChartUtils.formatCurrency(analytics.averageExpense)}.`
      );
    }

    // Payment method insight
    if (analytics.paymentMethodStats.length > 0) {
      const topMethod = analytics.paymentMethodStats[0];
      insights.push(
        `You primarily use ${topMethod.method} for payments (${topMethod.count} transactions).`
      );
    }

    return insights;
  }, [expenses]);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span className="text-2xl">💡</span>
        Insights & Trends
      </h3>
      <ul className="space-y-3">
        {insights.map((insight, index) => (
          <li
            key={index}
            className="flex items-start gap-3 text-sm text-gray-700"
          >
            <span className="text-blue-600 font-bold mt-0.5">•</span>
            <span>{insight}</span>
          </li>
        ))}
      </ul>
      {insights.length === 0 && (
        <p className="text-sm text-gray-500">
          Add more expenses to generate insights about your spending patterns.
        </p>
      )}
    </div>
  );
}
