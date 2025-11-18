export interface ExpenseData {
  id: string;
  date: string;
  category: string;
  amount: number;
  description: string;
  paymentMethod?: string;
}

export interface CategoryTotal {
  category: string;
  total: number;
  count: number;
  percentage: number;
}

export interface MonthlyTrend {
  month: string;
  total: number;
  count: number;
  average: number;
}

export interface PaymentMethodStats {
  method: string;
  total: number;
  count: number;
}

export interface AnalyticsData {
  totalExpenses: number;
  totalAmount: number;
  averageExpense: number;
  categoryBreakdown: CategoryTotal[];
  monthlyTrends: MonthlyTrend[];
  paymentMethodStats: PaymentMethodStats[];
  topExpenses: ExpenseData[];
}

export interface DateRange {
  start: Date;
  end: Date;
}
