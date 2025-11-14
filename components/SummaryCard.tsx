interface SummaryCardProps {
  title: string;
  value: string;
  icon: string;
  trend?: string;
  color?: string;
}

export default function SummaryCard({
  title,
  value,
  icon,
  trend,
  color = 'blue',
}: SummaryCardProps) {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && <p className="text-sm text-gray-500 mt-2">{trend}</p>}
        </div>
        <div className={`w-12 h-12 rounded-full ${colorClasses[color as keyof typeof colorClasses] || colorClasses.blue} flex items-center justify-center text-2xl flex-shrink-0`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
