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

// Cloud Export Types
export type ExportTemplate =
  | 'standard'
  | 'tax-report'
  | 'monthly-summary'
  | 'category-analysis'
  | 'detailed-transaction'
  | 'budget-review';

export type CloudService =
  | 'google-sheets'
  | 'dropbox'
  | 'onedrive'
  | 'email'
  | 'download';

export type ExportFormat = 'csv' | 'excel' | 'pdf' | 'json';

export type ExportFrequency = 'daily' | 'weekly' | 'monthly' | 'custom';

export interface ExportHistory {
  id: string;
  timestamp: string;
  template: ExportTemplate;
  service: CloudService;
  format: ExportFormat;
  recordCount: number;
  status: 'completed' | 'pending' | 'failed';
  shareLink?: string;
}

export interface ExportSchedule {
  id: string;
  enabled: boolean;
  frequency: ExportFrequency;
  template: ExportTemplate;
  service: CloudService;
  format: ExportFormat;
  nextRun: string;
  email?: string;
}

export interface CloudSyncStatus {
  service: CloudService;
  connected: boolean;
  lastSync?: string;
  status: 'synced' | 'syncing' | 'error' | 'disconnected';
}
