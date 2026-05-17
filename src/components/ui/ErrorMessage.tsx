import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export default function ErrorMessage({ message, onRetry, className = '' }: ErrorMessageProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/50 rounded-xl ${className}`}>
      <AlertCircle className="w-12 h-12 text-red-500 dark:text-red-400 mb-4" />
      <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
        Oops! Something went wrong.
      </h3>
      <p className="text-sm text-red-600 dark:text-red-400 mb-6 max-w-md">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </button>
      )}
    </div>
  );
}
