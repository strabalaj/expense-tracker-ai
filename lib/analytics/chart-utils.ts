import { CategoryTotal, MonthlyTrend } from './types';

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export class ChartUtils {
  private static readonly COLORS = [
    '#3b82f6', // blue
    '#ef4444', // red
    '#10b981', // green
    '#f59e0b', // amber
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#14b8a6', // teal
    '#f97316'  // orange
  ];

  static categoryToChartData(categories: CategoryTotal[]): ChartDataPoint[] {
    return categories.map((cat, index) => ({
      label: cat.category,
      value: cat.total,
      color: this.COLORS[index % this.COLORS.length]
    }));
  }

  static monthlyTrendToChartData(trends: MonthlyTrend[]): ChartDataPoint[] {
    return trends.map(trend => ({
      label: this.formatMonthLabel(trend.month),
      value: trend.total
    }));
  }

  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  static formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`;
  }

  private static formatMonthLabel(monthKey: string): string {
    const [year, month] = monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }

  static calculatePercentageChange(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  }
}
