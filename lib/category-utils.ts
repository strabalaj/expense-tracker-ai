import { Expense, ExpenseCategory } from '@/types/expense';
import { CategoryStats, CategoryStatsWithDetails, TopCategoriesData } from '@/types/category-stats';
import { categoryColors, categoryIcons } from './utils';

/**
 * Calculates statistics for all expense categories
 * @param expenses - Array of expense records
 * @returns Array of category statistics sorted by total amount (descending)
 */
export const calculateCategoryStats = (expenses: Expense[]): CategoryStats[] => {
  const categoryMap: Record<ExpenseCategory, { total: number; count: number }> = {
    Food: { total: 0, count: 0 },
    Transportation: { total: 0, count: 0 },
    Entertainment: { total: 0, count: 0 },
    Shopping: { total: 0, count: 0 },
    Bills: { total: 0, count: 0 },
    Other: { total: 0, count: 0 },
  };

  // Aggregate expenses by category
  expenses.forEach(expense => {
    const categoryData = categoryMap[expense.category];
    categoryData.total += expense.amount;
    categoryData.count += 1;
  });

  // Calculate total for percentage calculation
  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Convert to array and calculate additional stats
  const stats: CategoryStats[] = (Object.entries(categoryMap) as [ExpenseCategory, typeof categoryMap[ExpenseCategory]][])
    .map(([category, data]) => ({
      category,
      total: data.total,
      count: data.count,
      percentage: totalAmount > 0 ? (data.total / totalAmount) * 100 : 0,
      averageAmount: data.count > 0 ? data.total / data.count : 0,
    }))
    .sort((a, b) => b.total - a.total);

  return stats;
};

/**
 * Enhances category stats with visual details (icons, colors)
 * @param stats - Array of category statistics
 * @returns Enhanced category statistics with display properties
 */
export const enrichCategoryStats = (stats: CategoryStats[]): CategoryStatsWithDetails[] => {
  return stats.map(stat => ({
    ...stat,
    icon: categoryIcons[stat.category],
    color: categoryColors[stat.category],
  }));
};

/**
 * Gets top N expense categories by total amount
 * @param expenses - Array of expense records
 * @param limit - Number of top categories to return (default: 5)
 * @returns Top categories with full details
 */
export const getTopCategories = (
  expenses: Expense[],
  limit: number = 5
): CategoryStatsWithDetails[] => {
  const stats = calculateCategoryStats(expenses);
  const enrichedStats = enrichCategoryStats(stats);
  return enrichedStats.slice(0, limit);
};

/**
 * Filters expenses by date range
 * @param expenses - Array of expense records
 * @param startDate - Start date (ISO string)
 * @param endDate - End date (ISO string)
 * @returns Filtered expenses within date range
 */
export const filterByDateRange = (
  expenses: Expense[],
  startDate?: string,
  endDate?: string
): Expense[] => {
  if (!startDate && !endDate) {
    return expenses;
  }

  return expenses.filter(expense => {
    if (startDate && expense.date < startDate) {
      return false;
    }
    if (endDate && expense.date > endDate) {
      return false;
    }
    return true;
  });
};

/**
 * Generates complete top categories data for display
 * @param expenses - Array of expense records
 * @param options - Configuration options
 * @returns Complete top categories data structure
 */
export const generateTopCategoriesData = (
  expenses: Expense[],
  options?: {
    limit?: number;
    startDate?: string;
    endDate?: string;
  }
): TopCategoriesData => {
  const { limit = 5, startDate, endDate } = options || {};

  // Filter expenses by date range if specified
  const filteredExpenses = filterByDateRange(expenses, startDate, endDate);

  // Calculate statistics
  const stats = calculateCategoryStats(filteredExpenses);
  const enrichedStats = enrichCategoryStats(stats);
  const topCategories = enrichedStats.slice(0, limit);

  // Calculate totals
  const totalAmount = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalTransactions = filteredExpenses.length;

  return {
    categories: topCategories,
    totalAmount,
    totalTransactions,
    dateRange: startDate && endDate ? { start: startDate, end: endDate } : undefined,
  };
};

/**
 * Filters out categories with zero spending
 * @param stats - Array of category statistics
 * @returns Categories with non-zero totals
 */
export const filterActiveCategories = (stats: CategoryStatsWithDetails[]): CategoryStatsWithDetails[] => {
  return stats.filter(stat => stat.total > 0);
};

/**
 * Gets category ranking (1st, 2nd, 3rd, etc.)
 * @param category - Category to find ranking for
 * @param stats - Array of category statistics (should be sorted)
 * @returns Ranking number (1-indexed) or null if not found
 */
export const getCategoryRank = (
  category: ExpenseCategory,
  stats: CategoryStats[]
): number | null => {
  const index = stats.findIndex(stat => stat.category === category);
  return index >= 0 ? index + 1 : null;
};
