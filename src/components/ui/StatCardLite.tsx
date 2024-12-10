import React from 'react';
import classNames from 'classnames';

interface StatCardLiteProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  className?: string;
  valueColor?: string;
}

const StatCardLite: React.FC<StatCardLiteProps> = ({ 
  label, 
  value, 
  icon, 
  className, 
  valueColor = "text-gray-900" 
}) => (
  <div className={classNames(
    "flex items-center gap-3 p-3 rounded-lg border transition-all duration-200",
    className
  )}>
    <div className="p-2 rounded-lg">
      {icon}
    </div>
    <div>
      <p className={classNames("text-xl font-semibold", valueColor)}>
        {value}
      </p>
      <p className="text-xs text-gray-600">{label}</p>
    </div>
  </div>
);

export default StatCardLite; 