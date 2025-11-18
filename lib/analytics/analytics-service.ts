import {
  ExpenseData,
  AnalyticsData,
  CategoryTotal,
  MonthlyTrend,
  PaymentMethodStats,
  DateRange
} from './types';

export class AnalyticsService {
  static calculateAnalytics(
    expenses: ExpenseData[],
    dateRange?: DateRange
  ): AnalyticsData {
    let filteredExpenses = [...expenses];

    // Filter by date range if provided
    if (dateRange) {
      filteredExpenses = filteredExpenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= dateRange.start && expenseDate <= dateRange.end;
      });
    }

    const totalAmount = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalExpenses = filteredExpenses.length;

    return {
      totalExpenses,
      totalAmount,
      averageExpense: totalExpenses > 0 ? totalAmount / totalExpenses : 0,
      categoryBreakdown: this.calculateCategoryBreakdown(filteredExpenses, totalAmount),
      monthlyTrends: this.calculateMonthlyTrends(filteredExpenses),
      paymentMethodStats: this.calculatePaymentMethodStats(filteredExpenses),
      topExpenses: this.getTopExpenses(filteredExpenses, 5)
    };
  }

  private static calculateCategoryBreakdown(
    expenses: ExpenseData[],
    totalAmount: number
  ): CategoryTotal[] {
    const categoryMap = new Map<string, { total: number; count: number }>();

    expenses.forEach(expense => {
      const existing = categoryMap.get(expense.category) || { total: 0, count: 0 };
      categoryMap.set(expense.category, {
        total: existing.total + expense.amount,
        count: existing.count + 1
      });
    });

    return Array.from(categoryMap.entries())
      .map(([category, data]) => ({
        category,
        total: data.total,
        count: data.count,
        percentage: totalAmount > 0 ? (data.total / totalAmount) * 100 : 0
      }))
      .sort((a, b) => b.total - a.total);
  }

  private static calculateMonthlyTrends(expenses: ExpenseData[]): MonthlyTrend[] {
    const monthMap = new Map<string, { total: number; count: number }>();

    expenses.forEach(expense => {
      const date = new Date(expense.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      const existing = monthMap.get(monthKey) || { total: 0, count: 0 };
      monthMap.set(monthKey, {
        total: existing.total + expense.amount,
        count: existing.count + 1
      });
    });

    return Array.from(monthMap.entries())
      .map(([month, data]) => ({
        month,
        total: data.total,
        count: data.count,
        average: data.count > 0 ? data.total / data.count : 0
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  private static calculatePaymentMethodStats(
    expenses: ExpenseData[]
  ): PaymentMethodStats[] {
    const methodMap = new Map<string, { total: number; count: number }>();

    expenses.forEach(expense => {
      const method = expense.paymentMethod || 'Unknown';
      const existing = methodMap.get(method) || { total: 0, count: 0 };
      methodMap.set(method, {
        total: existing.total + expense.amount,
        count: existing.count + 1
      });
    });

    return Array.from(methodMap.entries())
      .map(([method, data]) => ({
        method,
        total: data.total,
        count: data.count
      }))
      .sort((a, b) => b.total - a.total);
  }

  private static getTopExpenses(
    expenses: ExpenseData[],
    limit: number
  ): ExpenseData[] {
    return [...expenses]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, limit);
  }
}
