import React from 'react';
import { 
    Home, 
    Users, 
    FileText, 
    BarChart3, 
    Settings,
    PlayCircle,
    Upload,
    UserCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Link, useLocation } from 'react-router-dom'; // ✅ Use real React Router

const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Batch Management', path: '/batches' },
    { icon: FileText, label: 'Test Bank', path: '/tests' },
    { icon: PlayCircle, label: 'Generate Tests', path: '/execution' },
    { icon: Upload, label: 'Import Tests', path: '/import' },
    { icon: BarChart3, label: 'Reports', path: '/reports' },
  
];

export const Sidebar: React.FC = () => {
    const location = useLocation();
    const { user } = useAuth();

    return (
        <aside className="w-64 bg-gray-100  dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-screen">
            
            {/* Top Section: Logo and Navigation */}
            <div className="p-6 flex-grow overflow-y-auto">
          <div className="flex items-center space-x-2 mb-8">
                <span className="text-xl font-bold">
                  <span className="text-teal-500">Assessment</span>
                 <span className="text-black dark:text-white">System</span>
            </span>
            </div>

                
                <nav className="space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`
                                    flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200
                                    ${isActive 
                                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }
                                `}
                            >
                                <Icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

           {/* Profile Section */}
<div className="p-4 border-t border-gray-200 dark:border-gray-700">
  <div className="flex items-center justify-between">
    <div className="flex items-center space-x-3">
      {user?.avatar ? (
        <img
          src={user.avatar}
          alt={user.name || "User Avatar"}
          className="w-10 h-10 rounded-full object-cover shrink-0"
        />
      ) : (
        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
          <UserCircle className="w-6 h-6" />
        </div>
      )}
      <div className="text-left">
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {user?.name}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {user?.email}
        </p>
      </div>
    </div>
  </div>
</div>


        </aside>
    );
};

export default Sidebar;
