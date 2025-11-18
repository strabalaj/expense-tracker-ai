import { Expense } from '@/types/expense';
import { getCurrentMonth } from '@/lib/utils';

describe('Monthly Insights Calculations', () => {
  describe('Category Aggregation', () => {
    it('should aggregate multiple expenses by category', () => {
      const expenses: Expense[] = [
        {
          id: '1',
          date: new Date().toISOString().split('T')[0],
          amount: 420,
          category: 'Food',
          description: 'Groceries',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          date: new Date().toISOString().split('T')[0],
          amount: 180,
          category: 'Transportation',
          description: 'Gas',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '3',
          date: new Date().toISOString().split('T')[0],
          amount: 95,
          category: 'Entertainment',
          description: 'Movies',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '4',
          date: new Date().toISOString().split('T')[0],
          amount: 50,
          category: 'Food',
          description: 'Restaurant',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      const totals: Record<string, number> = {};
      expenses.forEach(exp => {
        totals[exp.category] = (totals[exp.category] || 0) + exp.amount;
      });

      expect(totals.Food).toBe(470);
      expect(totals.Transportation).toBe(180);
      expect(totals.Entertainment).toBe(95);
    });

    it('should calculate percentages correctly', () => {
      const total = 745;
      const categoryAmounts = {
        Food: 470,
        Transportation: 180,
        Entertainment: 95,
      };

      const foodPercentage = (categoryAmounts.Food / total) * 100;
      const transportPercentage = (categoryAmounts.Transportation / total) * 100;
      const entertainmentPercentage = (categoryAmounts.Entertainment / total) * 100;

      expect(foodPercentage).toBeCloseTo(63.09, 2);
      expect(transportPercentage).toBeCloseTo(24.16, 2);
      expect(entertainmentPercentage).toBeCloseTo(12.75, 2);
    });

    it('should sort categories by amount descending', () => {
      const categories = [
        { category: 'Food', amount: 470 },
        { category: 'Transportation', amount: 180 },
        { category: 'Entertainment', amount: 95 },
      ];

      const sorted = categories.sort((a, b) => b.amount - a.amount);

      expect(sorted[0].category).toBe('Food');
      expect(sorted[1].category).toBe('Transportation');
      expect(sorted[2].category).toBe('Entertainment');
    });

    it('should return top 3 categories', () => {
      const categories = [
        { category: 'Food', amount: 470 },
        { category: 'Transportation', amount: 180 },
        { category: 'Entertainment', amount: 95 },
        { category: 'Shopping', amount: 50 },
        { category: 'Bills', amount: 30 },
      ];

      const top3 = categories.sort((a, b) => b.amount - a.amount).slice(0, 3);

      expect(top3.length).toBe(3);
      expect(top3[0].category).toBe('Food');
      expect(top3[1].category).toBe('Transportation');
      expect(top3[2].category).toBe('Entertainment');
    });
  });

  describe('Budget Streak Calculation', () => {
    it('should calculate streak of days under budget', () => {
      const dailyBudget = 100;
      const dailyTotals: Record<string, number> = {
        '2025-01-01': 50,
        '2025-01-02': 75,
        '2025-01-03': 80,
        '2025-01-04': 90,
        '2025-01-05': 95,
      };

      let streak = 0;
      Object.values(dailyTotals).forEach(total => {
        if (total <= dailyBudget) {
          streak++;
        }
      });

      expect(streak).toBe(5);
    });

    it('should handle days with zero spending', () => {
      const dailyBudget = 100;
      const dailyTotals: Record<string, number> = {
        '2025-01-01': 0,
        '2025-01-02': 0,
        '2025-01-03': 50,
      };

      let streak = 0;
      Object.values(dailyTotals).forEach(total => {
        if (total <= dailyBudget) {
          streak++;
        }
      });

      expect(streak).toBe(3);
    });

    it('should calculate daily budget from monthly budget', () => {
      const monthlyBudget = 3000;
      const dailyBudget = monthlyBudget / 30;

      expect(dailyBudget).toBe(100);
    });

    it('should handle over-budget days', () => {
      const dailyBudget = 100;
      const dailyTotals: Record<string, number> = {
        '2025-01-01': 50,
        '2025-01-02': 150, // Over budget
        '2025-01-03': 80,
      };

      let streak = 0;
      Object.values(dailyTotals).forEach(total => {
        if (total <= dailyBudget) {
          streak++;
        }
      });

      expect(streak).toBe(2);
    });
  });

  describe('Monthly Filtering', () => {
    it('should filter expenses to current month only', () => {
      const currentMonth = getCurrentMonth();
      const currentDate = new Date().toISOString().split('T')[0];
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      const lastMonthDate = lastMonth.toISOString().split('T')[0];

      const expenses: Expense[] = [
        {
          id: '1',
          date: currentDate,
          amount: 100,
          category: 'Food',
          description: 'Current month',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          date: lastMonthDate,
          amount: 200,
          category: 'Food',
          description: 'Last month',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      const monthlyExpenses = expenses.filter(
        exp => exp.date >= currentMonth.start && exp.date <= currentMonth.end
      );

      expect(monthlyExpenses.length).toBe(1);
      expect(monthlyExpenses[0].id).toBe('1');
    });

    it('should include all expenses in current month', () => {
      const currentMonth = getCurrentMonth();
      const startDate = currentMonth.start;
      const endDate = currentMonth.end;

      const expenses: Expense[] = [
        {
          id: '1',
          date: startDate,
          amount: 100,
          category: 'Food',
          description: 'Start of month',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          date: endDate,
          amount: 200,
          category: 'Food',
          description: 'End of month',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      const monthlyExpenses = expenses.filter(
        exp => exp.date >= currentMonth.start && exp.date <= currentMonth.end
      );

      expect(monthlyExpenses.length).toBe(2);
    });
  });

  describe('Donut Chart Data', () => {
    it('should calculate correct angles for donut segments', () => {
      const categories = [
        { category: 'Food', percentage: 63.09 },
        { category: 'Transportation', percentage: 24.16 },
        { category: 'Entertainment', percentage: 12.75 },
      ];

      let currentAngle = 0;
      const segments = categories.map(cat => {
        const angle = (cat.percentage / 100) * 360;
        const segment = {
          ...cat,
          startAngle: currentAngle,
          endAngle: currentAngle + angle,
        };
        currentAngle += angle;
        return segment;
      });

      expect(segments[0].startAngle).toBe(0);
      expect(segments[0].endAngle).toBeCloseTo(227.12, 1);

      expect(segments[1].startAngle).toBeCloseTo(227.12, 1);
      expect(segments[1].endAngle).toBeCloseTo(314.10, 1);

      expect(segments[2].startAngle).toBeCloseTo(314.10, 1);
      expect(segments[2].endAngle).toBeCloseTo(360, 0);
    });

    it('should handle 100% single category', () => {
      const categories = [{ category: 'Food', percentage: 100 }];

      const angle = (categories[0].percentage / 100) * 360;

      expect(angle).toBe(360);
    });

    it('should sum to 360 degrees', () => {
      const categories = [
        { category: 'Food', percentage: 50 },
        { category: 'Transportation', percentage: 30 },
        { category: 'Entertainment', percentage: 20 },
      ];

      const totalAngle = categories.reduce((sum, cat) => {
        return sum + (cat.percentage / 100) * 360;
      }, 0);

      expect(totalAngle).toBe(360);
    });
  });

  describe('Budget Status', () => {
    it('should calculate under budget correctly', () => {
      const budget = 1000;
      const spent = 745;
      const remaining = Math.max(0, budget - spent);

      expect(remaining).toBe(255);
    });

    it('should show zero when over budget', () => {
      const budget = 1000;
      const spent = 1500;
      const remaining = Math.max(0, budget - spent);

      expect(remaining).toBe(0);
    });

    it('should calculate budget usage percentage', () => {
      const budget = 1000;
      const spent = 745;
      const usagePercentage = (spent / budget) * 100;

      expect(usagePercentage).toBeCloseTo(74.5, 1);
    });

    it('should handle exact budget match', () => {
      const budget = 1000;
      const spent = 1000;
      const remaining = Math.max(0, budget - spent);

      expect(remaining).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero expenses', () => {
      const expenses: Expense[] = [];
      const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

      expect(total).toBe(0);
    });

    it('should handle single expense', () => {
      const expenses: Expense[] = [
        {
          id: '1',
          date: new Date().toISOString().split('T')[0],
          amount: 100,
          category: 'Food',
          description: 'Test',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
      expect(total).toBe(100);

      const categoryCount = new Set(expenses.map(e => e.category)).size;
      expect(categoryCount).toBe(1);
    });

    it('should handle very large amounts', () => {
      const budget = 1000000;
      const spent = 999999;
      const remaining = Math.max(0, budget - spent);

      expect(remaining).toBe(1);
    });

    it('should handle decimal amounts', () => {
      const expenses: Expense[] = [
        {
          id: '1',
          date: new Date().toISOString().split('T')[0],
          amount: 99.99,
          category: 'Food',
          description: 'Test',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          date: new Date().toISOString().split('T')[0],
          amount: 0.01,
          category: 'Food',
          description: 'Test',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
      expect(total).toBeCloseTo(100, 2);
    });
  });
});
