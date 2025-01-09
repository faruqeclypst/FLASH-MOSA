import React from 'react';
import Card from './Card';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  total: number;
  color: 'blue' | 'yellow' | 'green' | 'red';
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, total, color }) => {
  const percentage = total > 0 ? (value / total * 100) : 0;
  
  const colorClasses = {
    blue: 'bg-blue-50 text-green-800',
    yellow: 'bg-yellow-50 text-yellow-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600'
  };

  const progressBarColors = {
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
    green: 'bg-green-500',
    red: 'bg-red-500'
  };

  return (
    <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
      <div className="p-3 md:p-6">
        {/* Header */}
        <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
          <div className={`p-2 md:p-3 rounded-lg md:rounded-xl ${colorClasses[color]}`}>
            {React.cloneElement(icon as React.ReactElement, {
              className: 'w-4 h-4 md:w-5 md:h-5'
            })}
          </div>
          <p className="text-xs md:text-base lg:text-lg font-bold text-gray-900">{title}</p>
        </div>

        {/* Value & Progress */}
        <div className="space-y-2 md:space-y-3">
          <div className="flex items-baseline gap-1 md:gap-2">
            <p className="text-sm md:text-lg lg:text-xl font-extrabold text-gray-900">
              {value}
            </p>
            <p className="text-xs md:text-xs text-gray-500">
              dari {total}
            </p>
          </div>

          {/* Progress bar */}
          <div className="space-y-1 md:space-y-1.5">
            <div className="w-full h-1.5 md:h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${progressBarColors[color]}`}
                style={{ 
                  width: `${percentage}%`,
                  minWidth: '5%'
                }}
              />
            </div>
            <p className={`text-[10px] md:text-xs font-medium ${colorClasses[color]}`}>
              {percentage.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StatCard; 