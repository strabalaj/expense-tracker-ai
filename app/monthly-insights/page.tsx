'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Expense } from '@/types/expense';
import { storage } from '@/lib/storage';
import { formatCurrency, categoryColors, categoryIcons, getCurrentMonth } from '@/lib/utils';

/**
 * Monthly Insights Page
 * Displays a donut chart of spending categories, top 3 categories, and budget streak
 */
export default function MonthlyInsightsPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [budgetLimit, setBudgetLimit] = useState<number>(1000); // Default budget limit

  // Load expenses from localStorage on mount
  useEffect(() => {
    try {
      const loadedExpenses = storage.getExpenses();
      setExpenses(loadedExpenses);

      // Load budget limit from localStorage if it exists
      const savedBudget = localStorage.getItem('monthlyBudgetLimit');
      if (savedBudget) {
        setBudgetLimit(parseFloat(savedBudget));
      }
    } catch (error) {
      console.error('Error loading expenses:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get current month's expenses
  const monthlyExpenses = useMemo(() => {
    const currentMonth = getCurrentMonth();
    return expenses.filter(
      exp => exp.date >= currentMonth.start && exp.date <= currentMonth.end
    );
  }, [expenses]);

  // Calculate category totals for the current month
  const categoryData = useMemo(() => {
    const totals: Record<string, number> = {};
    let total = 0;

    monthlyExpenses.forEach(exp => {
      totals[exp.category] = (totals[exp.category] || 0) + exp.amount;
      total += exp.amount;
    });

    // Convert to array and sort by amount
    const categories = Object.entries(totals)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: total > 0 ? (amount / total) * 100 : 0,
        color: categoryColors[category as keyof typeof categoryColors] || 'bg-gray-500',
        icon: categoryIcons[category as keyof typeof categoryIcons] || '📌',
      }))
      .sort((a, b) => b.amount - a.amount);

    return { categories, total };
  }, [monthlyExpenses]);

  // Get top 3 categories
  const top3Categories = useMemo(() => {
    return categoryData.categories.slice(0, 3);
  }, [categoryData]);

  // Calculate budget streak (days under budget in current month)
  const budgetStreak = useMemo(() => {
    const currentMonth = getCurrentMonth();
    const monthStart = new Date(currentMonth.start);
    const today = new Date();

    // Group expenses by day
    const dailyTotals: Record<string, number> = {};
    monthlyExpenses.forEach(exp => {
      dailyTotals[exp.date] = (dailyTotals[exp.date] || 0) + exp.amount;
    });

    const dailyBudget = budgetLimit / 30; // Simple daily budget calculation
    let streak = 0;

    // Check each day from start of month to today
    const currentDate = new Date(monthStart);
    while (currentDate <= today) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const dayTotal = dailyTotals[dateStr] || 0;

      if (dayTotal <= dailyBudget) {
        streak++;
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return streak;
  }, [monthlyExpenses, budgetLimit]);

  // Generate donut chart segments
  const donutSegments = useMemo(() => {
    let currentAngle = 0;
    const segments = categoryData.categories.map(cat => {
      const angle = (cat.percentage / 100) * 360;
      const segment = {
        ...cat,
        startAngle: currentAngle,
        endAngle: currentAngle + angle,
      };
      currentAngle += angle;
      return segment;
    });
    return segments;
  }, [categoryData]);

  // Convert Tailwind color class to actual color
  const getColorFromClass = (colorClass: string): string => {
    const colorMap: Record<string, string> = {
      'bg-orange-500': '#f97316',
      'bg-blue-500': '#3b82f6',
      'bg-purple-500': '#a855f7',
      'bg-pink-500': '#ec4899',
      'bg-red-500': '#ef4444',
      'bg-gray-500': '#6b7280',
      'bg-green-500': '#22c55e',
    };
    return colorMap[colorClass] || '#6b7280';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-gray-600">Loading monthly insights...</p>
        </div>
      </div>
    );
  }

  if (monthlyExpenses.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Monthly Insights</h1>
            <p className="text-gray-600 mt-1">Track your monthly spending patterns</p>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Expenses This Month</h2>
            <p className="text-gray-600 mb-6">
              Start tracking your expenses to see insights here.
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
              <h1 className="text-3xl font-bold text-gray-900">Monthly Insights</h1>
              <p className="text-gray-600 mt-1">Track your monthly spending patterns</p>
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
              <h3 className="text-sm font-medium text-gray-600">Total This Month</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(categoryData.total)}
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
              {monthlyExpenses.length}
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-purple-100 text-purple-600 w-10 h-10 rounded-full flex items-center justify-center text-xl">
                📊
              </div>
              <h3 className="text-sm font-medium text-gray-600">Budget Remaining</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(Math.max(0, budgetLimit - categoryData.total))}
            </p>
          </div>
        </div>

        {/* Main Content - Donut Chart and Top Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Donut Chart */}
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center border-b-2 border-dotted border-gray-300 pb-4">
              Monthly Insights
            </h2>

            <div className="flex justify-center mb-8">
              <svg width="280" height="280" viewBox="0 0 280 280" className="transform -rotate-90">
                {/* Donut segments */}
                {donutSegments.map((segment, index) => {
                  const radius = 100;
                  const innerRadius = 60;
                  const centerX = 140;
                  const centerY = 140;

                  // Special case: if this is a complete circle (100% of spending)
                  if (segment.percentage >= 99.9) {
                    return (
                      <g key={index}>
                        {/* Outer circle */}
                        <circle
                          cx={centerX}
                          cy={centerY}
                          r={radius}
                          fill={getColorFromClass(segment.color)}
                          stroke="white"
                          strokeWidth="2"
                        />
                        {/* Inner circle (creates the donut hole) */}
                        <circle
                          cx={centerX}
                          cy={centerY}
                          r={innerRadius}
                          fill="white"
                        />
                      </g>
                    );
                  }

                  const startAngle = (segment.startAngle * Math.PI) / 180;
                  const endAngle = (segment.endAngle * Math.PI) / 180;

                  const x1 = centerX + radius * Math.cos(startAngle);
                  const y1 = centerY + radius * Math.sin(startAngle);
                  const x2 = centerX + radius * Math.cos(endAngle);
                  const y2 = centerY + radius * Math.sin(endAngle);

                  const x3 = centerX + innerRadius * Math.cos(endAngle);
                  const y3 = centerY + innerRadius * Math.sin(endAngle);
                  const x4 = centerX + innerRadius * Math.cos(startAngle);
                  const y4 = centerY + innerRadius * Math.sin(startAngle);

                  const largeArc = segment.endAngle - segment.startAngle > 180 ? 1 : 0;

                  const pathData = [
                    `M ${x1} ${y1}`,
                    `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
                    `L ${x3} ${y3}`,
                    `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}`,
                    'Z'
                  ].join(' ');

                  return (
                    <path
                      key={index}
                      d={pathData}
                      fill={getColorFromClass(segment.color)}
                      stroke="white"
                      strokeWidth="2"
                    />
                  );
                })}

                {/* Center circle with text */}
                <g transform="rotate(90 140 140)">
                  <circle cx="140" cy="140" r="60" fill="white" />
                  <text
                    x="140"
                    y="135"
                    textAnchor="middle"
                    className="text-sm font-medium fill-gray-600"
                    style={{ fontSize: '14px' }}
                  >
                    Spending
                  </text>
                </g>
              </svg>
            </div>

            <div className="text-right text-sm italic text-gray-500">
              Donut chart!
            </div>
          </div>

          {/* Top 3 Categories */}
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <div className="mb-8">
              <div className="flex justify-end mb-2">
                <div className="text-sm text-gray-500 italic">Top 3!</div>
              </div>
            </div>

            <div className="space-y-6">
              {top3Categories.map((category, index) => {
                // Color mapping for the left border
                const borderColors = ['border-red-400', 'border-teal-400', 'border-blue-400'];

                return (
                  <div
                    key={category.category}
                    className={`flex items-center gap-4 border-l-4 ${borderColors[index]} pl-4 py-3`}
                  >
                    <div className="text-3xl">{category.icon}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 text-lg">
                        {category.category}: {formatCurrency(category.amount)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Budget Streak */}
        <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Budget Streak</h2>
                <div className="flex items-baseline gap-2">
                  <div className="text-6xl font-bold text-green-600">{budgetStreak}</div>
                  <div className="text-xl text-gray-600">days!</div>
                </div>
              </div>

              <div className="w-32 h-16 bg-gray-200 rounded-full border-2 border-gray-300"
                   style={{
                     background: 'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(156, 163, 175, 0.3) 8px, rgba(156, 163, 175, 0.3) 16px)'
                   }}>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium">Daily Budget:</span>
                <span>{formatCurrency(budgetLimit / 30)}</span>
                <span className="mx-2">•</span>
                <span className="font-medium">Monthly Budget:</span>
                <span>{formatCurrency(budgetLimit)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Insights Section */}
        {top3Categories.length > 0 && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <div className="text-2xl">💡</div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Insights</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>
                    Your highest spending category this month is <strong>{top3Categories[0].category}</strong> with{' '}
                    <strong>{formatCurrency(top3Categories[0].amount)}</strong> ({top3Categories[0].percentage.toFixed(1)}% of total)
                  </li>
                  <li>
                    You are {categoryData.total > budgetLimit ? 'over' : 'under'} budget by{' '}
                    <strong>{formatCurrency(Math.abs(budgetLimit - categoryData.total))}</strong>
                  </li>
                  <li>
                    You have stayed under your daily budget for <strong>{budgetStreak}</strong> days this month
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
