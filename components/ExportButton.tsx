'use client';

import { useState } from 'react';
import { ExportService, ExportFormat, ExpenseData } from '@/lib/export';

interface ExportButtonProps {
  data: ExpenseData[];
  format: ExportFormat;
  label?: string;
}

export function ExportButton({ data, format, label }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const result = await ExportService.exportExpenses(data, {
        format,
        includeHeaders: true
      });

      if (result.success) {
        ExportService.downloadFile(result);
      } else {
        alert(`Export failed: ${result.error}`);
      }
    } catch (error) {
      alert('An error occurred during export');
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
    >
      {isExporting ? 'Exporting...' : label || `Export ${format.toUpperCase()}`}
    </button>
  );
}
