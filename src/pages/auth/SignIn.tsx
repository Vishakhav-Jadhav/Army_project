import React from 'react';
import { Card } from '../../components/ui/Card';
import { SignInForm } from '../../components/forms/SignInForm';

export const SignIn: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="flex items-center space-x-2">
              
              <span className="text-3xl font-bold text-gray-900 dark:text-white">Assessment System</span>
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in to your Assessment System account
          </p>
        </div>

        <Card>
          <SignInForm />
        </Card>
      </div>
    </div>
  );
};