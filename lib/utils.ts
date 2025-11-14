import { Expense, ExpenseCategory, ExpenseSummary, ExpenseFilters } from '@/types/expense';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const getCurrentMonth = (): { start: string; end: string } => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  };
};

export const filterExpenses = (
  expenses: Expense[],
  filters: ExpenseFilters
): Expense[] => {
  return expenses.filter(expense => {
    // Filter by date range
    if (filters.dateRange.startDate && expense.date < filters.dateRange.startDate) {
      return false;
    }
    if (filters.dateRange.endDate && expense.date > filters.dateRange.endDate) {
      return false;
    }

    // Filter by category
    if (filters.category !== 'All' && expense.category !== filters.category) {
      return false;
    }

    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      return (
        expense.description.toLowerCase().includes(query) ||
        expense.category.toLowerCase().includes(query)
      );
    }

    return true;
  });
};

export const calculateSummary = (expenses: Expense[]): ExpenseSummary => {
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const count = expenses.length;
  const average = count > 0 ? total / count : 0;

  const byCategory: Record<ExpenseCategory, number> = {
    Food: 0,
    Transportation: 0,
    Entertainment: 0,
    Shopping: 0,
    Bills: 0,
    Other: 0,
  };

  expenses.forEach(exp => {
    byCategory[exp.category] += exp.amount;
  });

  const currentMonth = getCurrentMonth();
  const monthlyExpenses = expenses.filter(
    exp => exp.date >= currentMonth.start && exp.date <= currentMonth.end
  );
  const monthlyTotal = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  let topCategory: ExpenseCategory | null = null;
  let maxAmount = 0;

  Object.entries(byCategory).forEach(([category, amount]) => {
    if (amount > maxAmount) {
      maxAmount = amount;
      topCategory = category as ExpenseCategory;
    }
  });

  return {
    total,
    count,
    average,
    byCategory,
    monthlyTotal,
    topCategory,
  };
};

export const exportToCSV = (expenses: Expense[]): void => {
  const headers = ['Date', 'Category', 'Amount', 'Description'];
  const rows = expenses.map(exp => [
    formatDate(exp.date),
    exp.category,
    exp.amount.toString(),
    exp.description,
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `expenses-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const categoryColors: Record<ExpenseCategory, string> = {
  Food: 'bg-orange-500',
  Transportation: 'bg-blue-500',
  Entertainment: 'bg-purple-500',
  Shopping: 'bg-pink-500',
  Bills: 'bg-red-500',
  Other: 'bg-gray-500',
};

export const categoryIcons: Record<ExpenseCategory, string> = {
  Food: '🍔',
  Transportation: '🚗',
  Entertainment: '🎬',
  Shopping: '🛍️',
  Bills: '📄',
  Other: '📌',
};
