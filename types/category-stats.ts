import { ExpenseCategory } from './expense';

export interface CategoryStats {
  category: ExpenseCategory;
  total: number;
  count: number;
  percentage: number;
  averageAmount: number;
}

export interface CategoryStatsWithDetails extends CategoryStats {
  icon: string;
  color: string;
  trend?: 'up' | 'down' | 'stable';
}

export interface TopCategoriesData {
  categories: CategoryStatsWithDetails[];
  totalAmount: number;
  totalTransactions: number;
  dateRange?: {
    start: string;
    end: string;
  };
}
