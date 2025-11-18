import {
  formatCurrency,
  formatDate,
  getCurrentMonth,
  calculateSummary,
  filterExpenses,
  categoryColors,
  categoryIcons,
} from '@/lib/utils';
import { Expense, ExpenseFilters } from '@/types/expense';

describe('Utility Functions', () => {
  describe('formatCurrency', () => {
    it('should format positive amounts correctly', () => {
      expect(formatCurrency(100)).toBe('$100.00');
      expect(formatCurrency(1000)).toBe('$1,000.00');
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
    });

    it('should format zero correctly', () => {
      expect(formatCurrency(0)).toBe('$0.00');
    });

    it('should format decimal amounts correctly', () => {
      expect(formatCurrency(99.99)).toBe('$99.99');
      expect(formatCurrency(0.01)).toBe('$0.01');
    });

    it('should format large amounts with commas', () => {
      expect(formatCurrency(1000000)).toBe('$1,000,000.00');
      expect(formatCurrency(999999.99)).toBe('$999,999.99');
    });
  });

  describe('formatDate', () => {
    it('should format date strings correctly', () => {
      const result = formatDate('2025-01-15');
      expect(result).toMatch(/Jan|January/);
      expect(result).toMatch(/14|15|16/); // Allow for timezone differences
      expect(result).toMatch(/2025/);
    });

    it('should handle different date formats', () => {
      const result = formatDate('2025-12-31');
      expect(result).toMatch(/Dec|December/);
      expect(result).toMatch(/30|31/); // Allow for timezone differences
      expect(result).toMatch(/2025/);
    });
  });

  describe('getCurrentMonth', () => {
    it('should return start and end dates of current month', () => {
      const result = getCurrentMonth();

      expect(result).toHaveProperty('start');
      expect(result).toHaveProperty('end');

      // Validate format (YYYY-MM-DD)
      expect(result.start).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(result.end).toMatch(/^\d{4}-\d{2}-\d{2}$/);

      // Start should be first day of month
      expect(result.start).toMatch(/-01$/);

      // End should be 28-31
      const endDay = parseInt(result.end.split('-')[2]);
      expect(endDay).toBeGreaterThanOrEqual(28);
      expect(endDay).toBeLessThanOrEqual(31);
    });

    it('should have start date before end date', () => {
      const result = getCurrentMonth();
      expect(new Date(result.start).getTime()).toBeLessThan(new Date(result.end).getTime());
    });
  });

  describe('calculateSummary', () => {
    const mockExpenses: Expense[] = [
      {
        id: '1',
        date: new Date().toISOString().split('T')[0],
        amount: 100,
        category: 'Food',
        description: 'Groceries',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        date: new Date().toISOString().split('T')[0],
        amount: 200,
        category: 'Transportation',
        description: 'Gas',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        date: new Date().toISOString().split('T')[0],
        amount: 150,
        category: 'Food',
        description: 'Restaurant',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    it('should calculate total correctly', () => {
      const summary = calculateSummary(mockExpenses);
      expect(summary.total).toBe(450);
    });

    it('should count expenses correctly', () => {
      const summary = calculateSummary(mockExpenses);
      expect(summary.count).toBe(3);
    });

    it('should calculate average correctly', () => {
      const summary = calculateSummary(mockExpenses);
      expect(summary.average).toBe(150);
    });

    it('should group by category correctly', () => {
      const summary = calculateSummary(mockExpenses);
      expect(summary.byCategory.Food).toBe(250);
      expect(summary.byCategory.Transportation).toBe(200);
      expect(summary.byCategory.Entertainment).toBe(0);
    });

    it('should identify top category', () => {
      const summary = calculateSummary(mockExpenses);
      expect(summary.topCategory).toBe('Food');
    });

    it('should handle empty expenses array', () => {
      const summary = calculateSummary([]);
      expect(summary.total).toBe(0);
      expect(summary.count).toBe(0);
      expect(summary.average).toBe(0);
      expect(summary.topCategory).toBeNull();
    });

    it('should calculate monthly total for current month', () => {
      const summary = calculateSummary(mockExpenses);
      expect(summary.monthlyTotal).toBeGreaterThanOrEqual(0);
    });
  });

  describe('filterExpenses', () => {
    const mockExpenses: Expense[] = [
      {
        id: '1',
        date: '2025-01-15',
        amount: 100,
        category: 'Food',
        description: 'Groceries',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        date: '2025-01-20',
        amount: 200,
        category: 'Transportation',
        description: 'Gas',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        date: '2025-02-01',
        amount: 150,
        category: 'Food',
        description: 'Restaurant',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    it('should filter by date range', () => {
      const filters: ExpenseFilters = {
        dateRange: { startDate: '2025-01-01', endDate: '2025-01-31' },
        category: 'All',
        searchQuery: '',
      };

      const result = filterExpenses(mockExpenses, filters);
      expect(result.length).toBe(2);
      expect(result.every(e => e.date >= '2025-01-01' && e.date <= '2025-01-31')).toBe(true);
    });

    it('should filter by category', () => {
      const filters: ExpenseFilters = {
        dateRange: { startDate: null, endDate: null },
        category: 'Food',
        searchQuery: '',
      };

      const result = filterExpenses(mockExpenses, filters);
      expect(result.length).toBe(2);
      expect(result.every(e => e.category === 'Food')).toBe(true);
    });

    it('should filter by search query in description', () => {
      const filters: ExpenseFilters = {
        dateRange: { startDate: null, endDate: null },
        category: 'All',
        searchQuery: 'groceries',
      };

      const result = filterExpenses(mockExpenses, filters);
      expect(result.length).toBe(1);
      expect(result[0].description).toBe('Groceries');
    });

    it('should filter by search query in category', () => {
      const filters: ExpenseFilters = {
        dateRange: { startDate: null, endDate: null },
        category: 'All',
        searchQuery: 'food',
      };

      const result = filterExpenses(mockExpenses, filters);
      expect(result.length).toBe(2);
    });

    it('should combine multiple filters', () => {
      const filters: ExpenseFilters = {
        dateRange: { startDate: '2025-01-01', endDate: '2025-01-31' },
        category: 'Food',
        searchQuery: 'groceries',
      };

      const result = filterExpenses(mockExpenses, filters);
      expect(result.length).toBe(1);
      expect(result[0].id).toBe('1');
    });

    it('should return all expenses when no filters applied', () => {
      const filters: ExpenseFilters = {
        dateRange: { startDate: null, endDate: null },
        category: 'All',
        searchQuery: '',
      };

      const result = filterExpenses(mockExpenses, filters);
      expect(result.length).toBe(3);
    });
  });

  describe('categoryColors', () => {
    it('should have colors for all categories', () => {
      expect(categoryColors.Food).toBeDefined();
      expect(categoryColors.Transportation).toBeDefined();
      expect(categoryColors.Entertainment).toBeDefined();
      expect(categoryColors.Shopping).toBeDefined();
      expect(categoryColors.Bills).toBeDefined();
      expect(categoryColors.Other).toBeDefined();
    });

    it('should have valid Tailwind color classes', () => {
      Object.values(categoryColors).forEach(color => {
        expect(color).toMatch(/^bg-\w+-\d+$/);
      });
    });
  });

  describe('categoryIcons', () => {
    it('should have icons for all categories', () => {
      expect(categoryIcons.Food).toBeDefined();
      expect(categoryIcons.Transportation).toBeDefined();
      expect(categoryIcons.Entertainment).toBeDefined();
      expect(categoryIcons.Shopping).toBeDefined();
      expect(categoryIcons.Bills).toBeDefined();
      expect(categoryIcons.Other).toBeDefined();
    });

    it('should have non-empty icon strings', () => {
      Object.values(categoryIcons).forEach(icon => {
        expect(icon.length).toBeGreaterThan(0);
      });
    });
  });
});
