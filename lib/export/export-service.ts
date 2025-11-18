import { ExpenseData, ExportOptions, ExportResult } from './types';
import { CSVExporter } from './csv-exporter';
import { JSONExporter } from './json-exporter';
import { PDFExporter } from './pdf-exporter';

export class ExportService {
  static async exportExpenses(
    data: ExpenseData[],
    options: ExportOptions
  ): Promise<ExportResult> {
    // Filter data based on options
    let filteredData = [...data];

    if (options.dateRange) {
      filteredData = filteredData.filter(expense => {
        const expenseDate = new Date(expense.date);
        return (
          expenseDate >= options.dateRange!.start &&
          expenseDate <= options.dateRange!.end
        );
      });
    }

    if (options.categories && options.categories.length > 0) {
      filteredData = filteredData.filter(expense =>
        options.categories!.includes(expense.category)
      );
    }

    // Export based on format
    switch (options.format) {
      case 'csv':
        return CSVExporter.export(filteredData, options.includeHeaders);
      case 'json':
        return JSONExporter.export(filteredData);
      case 'pdf':
        return PDFExporter.export(filteredData);
      default:
        return {
          success: false,
          filename: '',
          error: `Unsupported export format: ${options.format}`
        };
    }
  }

  static downloadFile(result: ExportResult): void {
    if (!result.success || !result.data) {
      console.error('Export failed:', result.error);
      return;
    }

    if (typeof window !== 'undefined' && result.data instanceof Blob) {
      const url = window.URL.createObjectURL(result.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = result.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  }
}
