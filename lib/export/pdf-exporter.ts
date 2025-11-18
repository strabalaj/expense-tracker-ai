import { ExpenseData, ExportResult } from './types';

export class PDFExporter {
  static export(data: ExpenseData[]): ExportResult {
    try {
      // Simple PDF generation (in production, use a library like jsPDF)
      const totalAmount = data.reduce((sum, expense) => sum + expense.amount, 0);

      let pdfContent = `
EXPENSE REPORT
Generated: ${new Date().toLocaleDateString()}
----------------------------------------

Total Expenses: ${data.length}
Total Amount: $${totalAmount.toFixed(2)}

EXPENSE DETAILS
----------------------------------------
`;

      data.forEach((expense, index) => {
        pdfContent += `
${index + 1}. ${expense.date} - ${expense.category}
   Amount: $${expense.amount.toFixed(2)}
   Description: ${expense.description}
   Payment: ${expense.paymentMethod || 'N/A'}
`;
      });

      const blob = new Blob([pdfContent], { type: 'application/pdf' });
      const filename = `expenses_${new Date().toISOString().split('T')[0]}.pdf`;

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
