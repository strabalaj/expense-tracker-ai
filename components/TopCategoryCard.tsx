import { CategoryStatsWithDetails } from '@/types/category-stats';
import { formatCurrency } from '@/lib/utils';

interface TopCategoryCardProps {
  categoryStats: CategoryStatsWithDetails;
  rank: number;
  showDetails?: boolean;
}

/**
 * Card component displaying statistics for a single expense category
 * Shows category icon, name, total amount, transaction count, and percentage
 */
export default function TopCategoryCard({
  categoryStats,
  rank,
  showDetails = true
}: TopCategoryCardProps) {
  const { category, total, count, percentage, averageAmount, icon, color } = categoryStats;

  // Get rank badge styling
  const getRankBadgeColor = () => {
    switch (rank) {
      case 1:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 2:
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 3:
        return 'bg-orange-100 text-orange-800 border-orange-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  // Get rank emoji
  const getRankEmoji = () => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${rank}`;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        {/* Header with rank and category */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`${color} text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-sm`}>
              {icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{category}</h3>
              <p className="text-sm text-gray-500">{count} transactions</p>
            </div>
          </div>
          <div className={`${getRankBadgeColor()} px-3 py-1 rounded-full text-sm font-semibold border`}>
            {getRankEmoji()}
          </div>
        </div>

        {/* Amount and percentage */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-bold text-gray-900">
              {formatCurrency(total)}
            </span>
            <span className="text-lg text-gray-500">
              ({percentage.toFixed(1)}%)
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className={`${color} h-full rounded-full transition-all duration-500`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Additional details */}
        {showDetails && (
          <div className="pt-4 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 mb-1">Average</p>
                <p className="font-semibold text-gray-900">
                  {formatCurrency(averageAmount)}
                </p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Per Transaction</p>
                <p className="font-semibold text-gray-900">
                  {formatCurrency(total / count)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
