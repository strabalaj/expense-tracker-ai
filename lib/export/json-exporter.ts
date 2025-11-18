import { ExpenseData, ExportResult } from './types';

export class JSONExporter {
  static export(data: ExpenseData[]): ExportResult {
    try {
      const jsonData = {
        exportDate: new Date().toISOString(),
        totalExpenses: data.length,
        totalAmount: data.reduce((sum, expense) => sum + expense.amount, 0),
        expenses: data
      };

      const jsonString = JSON.stringify(jsonData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const filename = `expenses_${new Date().toISOString().split('T')[0]}.json`;

      return {
        success: true,
        data: blob,
        filename
      };
    } catch (error) {
      return {
        success: false,
        filename: '',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}
