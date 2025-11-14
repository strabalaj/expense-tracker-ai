export type ExpenseCategory =
  | 'Food'
  | 'Transportation'
  | 'Entertainment'
  | 'Shopping'
  | 'Bills'
  | 'Other';

export interface Expense {
  id: string;
  date: string; // ISO date string
  amount: number;
  category: ExpenseCategory;
  description: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface ExpenseFormData {
  date: string;
  amount: string;
  category: ExpenseCategory;
  description: string;
}

export interface DateRange {
  startDate: string | null;
  endDate: string | null;
}

export interface ExpenseFilters {
  dateRange: DateRange;
  category: ExpenseCategory | 'All';
  searchQuery: string;
}

export interface ExpenseSummary {
  total: number;
  count: number;
  average: number;
  byCategory: Record<ExpenseCategory, number>;
  monthlyTotal: number;
  topCategory: ExpenseCategory | null;
}
