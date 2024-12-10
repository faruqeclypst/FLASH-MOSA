import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  UserGroupIcon, 
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import classNames from 'classnames';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/admin', 
      icon: HomeIcon,
      exact: true
    },
    { 
      name: 'Kelola Pendaftaran', 
      href: '/admin/manage-registrations', 
      icon: UserGroupIcon 
    },
    { 
      name: 'Kelola Konten', 
      href: '/admin/manage-content', 
      icon: DocumentTextIcon 
    },
  ];

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex flex-col flex-grow pt-5 bg-white overflow-y-auto border-r">
        <div className="flex items-center flex-shrink-0 px-4">
          <span className="text-xl font-bold text-blue-600">FLASH 2024</span>
        </div>
        <div className="mt-5 flex-grow flex flex-col">
          <nav className="flex-1 px-2 pb-4 space-y-1">
            {navigation.map((item) => {
              const isActive = item.exact 
                ? location.pathname === item.href
                : location.pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={classNames(
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors'
                  )}
                >
                  <item.icon
                    className={classNames(
                      isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500',
                      'mr-3 flex-shrink-0 h-6 w-6 transition-colors'
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 