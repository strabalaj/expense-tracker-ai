'use client';

import { useState } from 'react';
import { Expense, ExportTemplate, CloudService, ExportFormat, ExportHistory, ExportSchedule, CloudSyncStatus } from '@/types/expense';
import { formatCurrency, formatDate } from '@/lib/utils';

interface CloudExportCenterProps {
  expenses: Expense[];
  isOpen: boolean;
  onClose: () => void;
}

const exportTemplates = {
  'standard': {
    name: 'Standard Export',
    description: 'All expense data in chronological order',
    icon: '📄',
    fields: ['Date', 'Category', 'Amount', 'Description']
  },
  'tax-report': {
    name: 'Tax Report',
    description: 'Formatted for tax filing with category summaries',
    icon: '📋',
    fields: ['Date', 'Category', 'Amount', 'Description', 'Tax Category']
  },
  'monthly-summary': {
    name: 'Monthly Summary',
    description: 'Aggregated monthly spending breakdown',
    icon: '📊',
    fields: ['Month', 'Total', 'Category Breakdown', 'Average']
  },
  'category-analysis': {
    name: 'Category Analysis',
    description: 'Deep dive into spending by category',
    icon: '📈',
    fields: ['Category', 'Total', 'Count', 'Average', 'Percentage']
  },
  'detailed-transaction': {
    name: 'Detailed Transaction Log',
    description: 'Complete audit trail with timestamps',
    icon: '🔍',
    fields: ['Date', 'Time', 'Category', 'Amount', 'Description', 'Created', 'Modified']
  },
  'budget-review': {
    name: 'Budget Review',
    description: 'Compare spending against budget targets',
    icon: '🎯',
    fields: ['Category', 'Actual', 'Budget', 'Variance', 'Status']
  }
};

const cloudServices = {
  'google-sheets': { name: 'Google Sheets', icon: '📗', color: 'green' },
  'dropbox': { name: 'Dropbox', icon: '📦', color: 'blue' },
  'onedrive': { name: 'OneDrive', icon: '☁️', color: 'blue' },
  'email': { name: 'Email', icon: '📧', color: 'purple' },
  'download': { name: 'Download', icon: '💾', color: 'gray' }
};

export default function CloudExportCenter({ expenses, isOpen, onClose }: CloudExportCenterProps) {
  const [activeTab, setActiveTab] = useState<'export' | 'schedule' | 'history' | 'integrations'>('export');
  const [selectedTemplate, setSelectedTemplate] = useState<ExportTemplate>('standard');
  const [selectedService, setSelectedService] = useState<CloudService>('download');
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('csv');
  const [emailAddress, setEmailAddress] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [generatedShareLink, setGeneratedShareLink] = useState('');
  const [generatedQRCode, setGeneratedQRCode] = useState(false);

  // Mock data - in a real app, this would come from state/API
  const [exportHistory] = useState<ExportHistory[]>([
    {
      id: '1',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      template: 'monthly-summary',
      service: 'google-sheets',
      format: 'excel',
      recordCount: 145,
      status: 'completed',
      shareLink: 'https://sheets.google.com/d/abc123'
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      template: 'tax-report',
      service: 'email',
      format: 'pdf',
      recordCount: 245,
      status: 'completed'
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      template: 'category-analysis',
      service: 'dropbox',
      format: 'csv',
      recordCount: 198,
      status: 'completed'
    }
  ]);

  const [schedules, setSchedules] = useState<ExportSchedule[]>([
    {
      id: '1',
      enabled: true,
      frequency: 'monthly',
      template: 'monthly-summary',
      service: 'email',
      format: 'pdf',
      nextRun: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      email: 'you@example.com'
    },
    {
      id: '2',
      enabled: false,
      frequency: 'weekly',
      template: 'standard',
      service: 'google-sheets',
      format: 'excel',
      nextRun: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]);

  const [cloudStatus] = useState<CloudSyncStatus[]>([
    { service: 'google-sheets', connected: true, lastSync: new Date(Date.now() - 10 * 60 * 1000).toISOString(), status: 'synced' },
    { service: 'dropbox', connected: true, lastSync: new Date(Date.now() - 30 * 60 * 1000).toISOString(), status: 'synced' },
    { service: 'onedrive', connected: false, status: 'disconnected' },
    { service: 'email', connected: true, status: 'synced' }
  ]);

  const handleExport = () => {
    // Simulate export
    console.log('Exporting:', { selectedTemplate, selectedService, selectedFormat, emailAddress });
    alert(`Export started!\n\nTemplate: ${exportTemplates[selectedTemplate].name}\nService: ${cloudServices[selectedService].name}\nFormat: ${selectedFormat.toUpperCase()}\n\nThis would process ${expenses.length} expenses.`);
  };

  const handleGenerateShareLink = () => {
    const mockLink = `https://expense-share.app/${Math.random().toString(36).substr(2, 9)}`;
    setGeneratedShareLink(mockLink);
    setGeneratedQRCode(true);
    setShowShareModal(true);
  };

  const toggleSchedule = (id: string) => {
    setSchedules(schedules.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>

        <div className="relative bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  ☁️ Cloud Export Center
                </h2>
                <p className="text-blue-100 text-sm mt-1">Export, share, and sync your expense data anywhere</p>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="flex px-6">
              {[
                { id: 'export', label: 'Quick Export', icon: '🚀' },
                { id: 'schedule', label: 'Auto Backup', icon: '⏰' },
                { id: 'history', label: 'Export History', icon: '📜' },
                { id: 'integrations', label: 'Integrations', icon: '🔗' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
            {activeTab === 'export' && (
              <div className="space-y-6">
                {/* Template Selection */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    📑 Choose Export Template
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Object.entries(exportTemplates).map(([key, template]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedTemplate(key as ExportTemplate)}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          selectedTemplate === key
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="text-2xl mb-2">{template.icon}</div>
                        <div className="font-semibold text-sm mb-1">{template.name}</div>
                        <div className="text-xs text-gray-600">{template.description}</div>
                        <div className="text-xs text-gray-400 mt-2">
                          Fields: {template.fields.length}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Service & Format Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      🌐 Export Destination
                    </h3>
                    <div className="space-y-2">
                      {Object.entries(cloudServices).map(([key, service]) => (
                        <button
                          key={key}
                          onClick={() => setSelectedService(key as CloudService)}
                          className={`w-full p-3 rounded-lg border-2 text-left flex items-center gap-3 transition-all ${
                            selectedService === key
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <span className="text-2xl">{service.icon}</span>
                          <span className="font-medium">{service.name}</span>
                          {cloudStatus.find(s => s.service === key)?.connected && (
                            <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                              Connected
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      📁 File Format
                    </h3>
                    <div className="space-y-2">
                      {(['csv', 'excel', 'pdf', 'json'] as ExportFormat[]).map(format => (
                        <button
                          key={format}
                          onClick={() => setSelectedFormat(format)}
                          className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                            selectedFormat === format
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="font-medium">{format.toUpperCase()}</div>
                          <div className="text-xs text-gray-600">
                            {format === 'csv' && 'Comma-separated values'}
                            {format === 'excel' && 'Microsoft Excel spreadsheet'}
                            {format === 'pdf' && 'Portable document format'}
                            {format === 'json' && 'JavaScript object notation'}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Email Input (if email service selected) */}
                {selectedService === 'email' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📧 Email Address
                    </label>
                    <input
                      type="email"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={handleExport}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
                  >
                    🚀 Export {expenses.length} Expenses
                  </button>
                  <button
                    onClick={handleGenerateShareLink}
                    className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all"
                  >
                    🔗 Generate Share Link
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'schedule' && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-1">⏰ Automatic Backup Scheduling</h3>
                  <p className="text-sm text-blue-700">Set up recurring exports to keep your data automatically backed up to the cloud.</p>
                </div>

                {/* Existing Schedules */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Active Schedules</h3>
                  <div className="space-y-3">
                    {schedules.map(schedule => (
                      <div key={schedule.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{exportTemplates[schedule.template].icon}</span>
                              <div>
                                <div className="font-semibold">{exportTemplates[schedule.template].name}</div>
                                <div className="text-sm text-gray-600">
                                  {cloudServices[schedule.service].icon} {cloudServices[schedule.service].name} •
                                  {schedule.format.toUpperCase()} •
                                  Every {schedule.frequency}
                                </div>
                                {schedule.email && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    📧 {schedule.email}
                                  </div>
                                )}
                                <div className="text-xs text-gray-500 mt-1">
                                  Next run: {new Date(schedule.nextRun).toLocaleString()}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleSchedule(schedule.id)}
                              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                                schedule.enabled
                                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              {schedule.enabled ? '✓ Enabled' : '○ Disabled'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add New Schedule Button */}
                <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors">
                  + Add New Automatic Backup Schedule
                </button>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Recent Exports</h3>
                  <span className="text-sm text-gray-500">{exportHistory.length} total exports</span>
                </div>

                <div className="space-y-3">
                  {exportHistory.map(item => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                          <span className="text-2xl">{exportTemplates[item.template].icon}</span>
                          <div>
                            <div className="font-semibold">{exportTemplates[item.template].name}</div>
                            <div className="text-sm text-gray-600">
                              {cloudServices[item.service].icon} {cloudServices[item.service].name} •
                              {item.format.toUpperCase()} •
                              {item.recordCount} records
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(item.timestamp).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            item.status === 'completed' ? 'bg-green-100 text-green-700' :
                            item.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {item.status === 'completed' ? '✓ Completed' :
                             item.status === 'pending' ? '⏳ Pending' :
                             '✗ Failed'}
                          </span>
                          {item.shareLink && (
                            <a
                              href={item.shareLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:underline"
                            >
                              🔗 Open Link
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'integrations' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-1">🔗 Cloud Service Integrations</h3>
                  <p className="text-sm text-blue-700">Connect your expense tracker with popular cloud services for seamless data sync and backup.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cloudStatus.map(service => (
                    <div key={service.service} className="border-2 border-gray-200 rounded-lg p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{cloudServices[service.service].icon}</span>
                          <div>
                            <div className="font-semibold">{cloudServices[service.service].name}</div>
                            <div className={`text-xs mt-1 ${
                              service.status === 'synced' ? 'text-green-600' :
                              service.status === 'syncing' ? 'text-blue-600' :
                              service.status === 'error' ? 'text-red-600' :
                              'text-gray-500'
                            }`}>
                              {service.status === 'synced' && '✓ Synced'}
                              {service.status === 'syncing' && '⟳ Syncing...'}
                              {service.status === 'error' && '⚠ Error'}
                              {service.status === 'disconnected' && '○ Not Connected'}
                            </div>
                          </div>
                        </div>
                        <button
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            service.connected
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {service.connected ? 'Disconnect' : 'Connect'}
                        </button>
                      </div>
                      {service.lastSync && (
                        <div className="text-xs text-gray-500 border-t border-gray-200 pt-3">
                          Last sync: {new Date(service.lastSync).toLocaleString()}
                        </div>
                      )}
                      {service.connected && (
                        <div className="mt-3 space-y-2">
                          <button className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded text-sm transition-colors">
                            ⚙️ Configure Settings
                          </button>
                          <button className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded text-sm transition-colors">
                            🔄 Sync Now
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Additional Integration Options */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-3">➕</div>
                  <h4 className="font-semibold mb-2">More Integrations Coming Soon</h4>
                  <p className="text-sm text-gray-600 mb-4">Slack, Notion, Zapier, and more...</p>
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Request Integration
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Share Link Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowShareModal(false)}></div>
          <div className="relative bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">🔗 Share Your Export</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Shareable Link</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={generatedShareLink}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedShareLink);
                      alert('Link copied to clipboard!');
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Copy
                  </button>
                </div>
              </div>

              {generatedQRCode && (
                <div className="text-center py-4 border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-6xl mb-2">📱</div>
                  <div className="text-sm text-gray-600">QR Code would appear here</div>
                  <div className="text-xs text-gray-500 mt-1">Scan to access export</div>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => alert('Opening share options...')}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  📧 Email Link
                </button>
                <button
                  onClick={() => alert('Opening share options...')}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  💬 Share via SMS
                </button>
              </div>

              <button
                onClick={() => setShowShareModal(false)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
