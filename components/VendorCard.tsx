import { VendorSummary } from '@/types/expense';
import { formatCurrency, formatDate, categoryColors, categoryIcons } from '@/lib/utils';

interface VendorCardProps {
  vendor: VendorSummary;
  rank: number;
}

export default function VendorCard({ vendor, rank }: VendorCardProps) {
  const getRankBadgeColor = (rank: number): string => {
    if (rank === 1) return 'bg-yellow-500 text-white';
    if (rank === 2) return 'bg-gray-400 text-white';
    if (rank === 3) return 'bg-orange-600 text-white';
    return 'bg-blue-500 text-white';
  };

  const getRankEmoji = (rank: number): string => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '🏪';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full ${getRankBadgeColor(rank)} flex items-center justify-center font-bold text-sm`}>
            #{rank}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              {getRankEmoji(rank)} {vendor.vendor}
            </h3>
            <p className="text-sm text-gray-500">
              {vendor.transactionCount} transaction{vendor.transactionCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Total Spent</span>
          <span className="text-xl font-bold text-gray-900">
            {formatCurrency(vendor.totalAmount)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Average per Transaction</span>
          <span className="text-md font-semibold text-gray-700">
            {formatCurrency(vendor.averageAmount)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Last Transaction</span>
          <span className="text-sm text-gray-700">
            {formatDate(vendor.lastTransaction)}
          </span>
        </div>

        <div className="pt-3 border-t border-gray-100">
          <span className="text-sm text-gray-600 block mb-2">Categories</span>
          <div className="flex flex-wrap gap-2">
            {vendor.categories.map(category => (
              <span
                key={category}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium text-white ${categoryColors[category]}`}
              >
                <span>{categoryIcons[category]}</span>
                <span>{category}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
