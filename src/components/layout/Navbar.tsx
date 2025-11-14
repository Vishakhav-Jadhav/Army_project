import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Assessment System
          </h1> */}
        </div>

        <div className="flex items-center space-x-1 max-w-md mx-auto">
          
        </div>      
  <div className="flex items-center">
  <Button
    onClick={logout}
    className="px-4 py-2 text-sm font-medium rounded-lg 
               bg-gradient-to-r from-blue-500 to-indigo-600 text-white 
               hover:from-blue-600 hover:to-indigo-700 
               active:from-blue-700 active:to-indigo-800 
               shadow-md hover:shadow-lg 
               transition-all duration-300"
  >
    
    Logout
  </Button>
</div>


          </div>
        
    
    </nav>
  );
};