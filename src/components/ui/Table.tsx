import React from 'react';
import classNames from 'classnames';

interface Column {
  header: React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface TableProps {
  columns: Column[];
  data: React.ReactNode[][];
  className?: string;
  hoverable?: boolean;
  compact?: boolean;
  striped?: boolean;
}

const Table: React.FC<TableProps> = ({ 
  columns, 
  data, 
  className,
  hoverable = true,
  compact = false,
  striped = false
}) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className={classNames(
                  'text-xs font-medium text-gray-500 uppercase tracking-wider',
                  compact ? 'p-2' : 'p-4',
                  column.align === 'right' && 'text-right',
                  column.align === 'center' && 'text-center',
                  !column.align && 'text-left'
                )}
                style={{ width: column.width }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr 
              key={rowIndex}
              className={classNames(
                hoverable && 'hover:bg-gray-50',
                striped && rowIndex % 2 === 0 && 'bg-gray-50'
              )}
            >
              {row.map((cell, cellIndex) => (
                <td 
                  key={cellIndex} 
                  className={classNames(
                    compact ? 'p-2' : 'p-4',
                    columns[cellIndex]?.align === 'right' && 'text-right',
                    columns[cellIndex]?.align === 'center' && 'text-center'
                  )}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table; 