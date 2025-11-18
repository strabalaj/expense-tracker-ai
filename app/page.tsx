'use client';

import { useState, useEffect } from 'react';
import { Expense, ExpenseFormData, ExpenseFilters as ExpenseFiltersType } from '@/types/expense';
import { storage } from '@/lib/storage';
import {
  generateId,
  filterExpenses,
  calculateSummary,
  formatCurrency,
  exportToCSV,
} from '@/lib/utils';

import ExpenseForm from '@/components/ExpenseForm';
import ExpenseList from '@/components/ExpenseList';
import ExpenseFilters from '@/components/ExpenseFilters';
import SummaryCard from '@/components/SummaryCard';
import CategoryChart from '@/components/CategoryChart';
import Modal from '@/components/Modal';
import Link from 'next/link';

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filters, setFilters] = useState<ExpenseFiltersType>({
    dateRange: { startDate: null, endDate: null },
    category: 'All',
    searchQuery: '',
  });
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load expenses from localStorage on mount
  useEffect(() => {
    const loadedExpenses = storage.getExpenses();
    setExpenses(loadedExpenses);
    setIsLoading(false);
  }, []);

  const handleAddExpense = (formData: ExpenseFormData) => {
    const newExpense: Expense = {
      id: generateId(),
      date: formData.date,
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
      vendor: formData.vendor,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedExpenses = [...expenses, newExpense];
    setExpenses(updatedExpenses);
    storage.saveExpenses(updatedExpenses);
  };

  const handleEditExpense = (formData: ExpenseFormData) => {
    if (!editingExpense) return;

    const updatedExpense: Expense = {
      ...editingExpense,
      date: formData.date,
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
      vendor: formData.vendor,
      updatedAt: new Date().toISOString(),
    };

    const updatedExpenses = expenses.map(exp =>
      exp.id === editingExpense.id ? updatedExpense : exp
    );

    setExpenses(updatedExpenses);
    storage.saveExpenses(updatedExpenses);
    setIsEditModalOpen(false);
    setEditingExpense(null);
  };

  const handleDeleteExpense = (id: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      const updatedExpenses = expenses.filter(exp => exp.id !== id);
      setExpenses(updatedExpenses);
      storage.saveExpenses(updatedExpenses);
    }
  };

  const openEditModal = (expense: Expense) => {
    setEditingExpense(expense);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingExpense(null);
  };

  const handleExport = () => {
    exportToCSV(filteredExpenses);
  };

  // Filter expenses
  const filteredExpenses = filterExpenses(expenses, filters);
  const summary = calculateSummary(filteredExpenses);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">💰</div>
          <p className="text-gray-600">Loading your expenses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Expense Tracker</h1>
              <p className="text-gray-600 mt-1">Manage your personal finances with ease</p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/top-categories"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Top Categories
              </Link>
              <Link
                href="/top-vendors"
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Top Vendors
              </Link>
              <button
                onClick={handleExport}
                disabled={filteredExpenses.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export CSV
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <SummaryCard
            title="Total Spending"
            value={formatCurrency(summary.total)}
            icon="💰"
            trend={`${summary.count} transactions`}
            color="blue"
          />
          <SummaryCard
            title="This Month"
            value={formatCurrency(summary.monthlyTotal)}
            icon="📅"
            color="green"
          />
          <SummaryCard
            title="Average Expense"
            value={formatCurrency(summary.average)}
            icon="📊"
            color="purple"
          />
          <SummaryCard
            title="Top Category"
            value={summary.topCategory || 'N/A'}
            icon="🏆"
            trend={summary.topCategory ? formatCurrency(summary.byCategory[summary.topCategory]) : ''}
            color="orange"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form and Chart */}
          <div className="lg:col-span-1 space-y-6">
            {/* Add Expense Form */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Expense</h2>
              <ExpenseForm onSubmit={handleAddExpense} />
            </div>

            {/* Category Chart */}
            <CategoryChart data={summary.byCategory} total={summary.total} />
          </div>

          {/* Right Column - Filters and List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filters */}
            <ExpenseFilters filters={filters} onFiltersChange={setFilters} />

            {/* Expense List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Expenses
                  {filteredExpenses.length !== expenses.length && (
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      ({filteredExpenses.length} of {expenses.length})
                    </span>
                  )}
                </h2>
              </div>
              <ExpenseList
                expenses={filteredExpenses}
                onEdit={openEditModal}
                onDelete={handleDeleteExpense}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={closeEditModal} title="Edit Expense">
        {editingExpense && (
          <ExpenseForm
            onSubmit={handleEditExpense}
            initialData={{
              date: editingExpense.date,
              amount: editingExpense.amount.toString(),
              category: editingExpense.category,
              description: editingExpense.description,
              vendor: editingExpense.vendor,
            }}
            submitLabel="Update Expense"
            onCancel={closeEditModal}
          />
        )}
      </Modal>
    </div>
  );
}
