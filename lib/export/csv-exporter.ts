import { ExpenseData, ExportResult } from './types';

export class CSVExporter {
  static export(data: ExpenseData[], includeHeaders = true): ExportResult {
    try {
      let csv = '';

      if (includeHeaders) {
        csv += 'ID,Date,Category,Amount,Description,Payment Method\n';
      }

      data.forEach(expense => {
        const row = [
          expense.id,
          expense.date,
          expense.category,
          expense.amount,
          `"${expense.description.replace(/"/g, '""')}"`,
          expense.paymentMethod || ''
        ].join(',');
        csv += row + '\n';
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const filename = `expenses_${new Date().toISOString().split('T')[0]}.csv`;

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
