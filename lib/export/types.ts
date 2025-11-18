export interface ExpenseData {
  id: string;
  date: string;
  category: string;
  amount: number;
  description: string;
  paymentMethod?: string;
}

export type ExportFormat = 'csv' | 'json' | 'pdf';

export interface ExportOptions {
  format: ExportFormat;
  dateRange?: {
    start: Date;
    end: Date;
  };
  categories?: string[];
  includeHeaders?: boolean;
}

export interface ExportResult {
  success: boolean;
  data?: Blob | string;
  filename: string;
  error?: string;
}
