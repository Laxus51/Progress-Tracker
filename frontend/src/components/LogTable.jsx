import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { deleteLog } from '../services/api';

const LogTable = ({ logs, onRefresh }) => {
  // Format date to be more readable
  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Check if a date is today
  const isToday = (dateString) => {
    const today = new Date().toISOString().split('T')[0];
    return dateString === today;
  };

  // Handle log deletion
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this log?')) {
      try {
        await deleteLog(id);
        toast.success('Log deleted successfully');
        // Refresh the logs list
        if (onRefresh) onRefresh();
      } catch (error) {
        console.error('Error deleting log:', error);
        toast.error('Failed to delete log');
      }
    }
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-x-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Progress History</h2>
      
      {logs.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-4">No entries yet. Start logging your progress!</p>
      ) : (
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-100 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-100 uppercase tracking-wider">Weight (kg)</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-100 uppercase tracking-wider">Calories</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-100 uppercase tracking-wider">Protein (g)</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-100 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {logs.map((log) => (
              <motion.tr 
                key={log.id}
                className={`${isToday(log.date) ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {formatDate(log.date)}
                  {isToday(log.date) && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                      Today
                    </span>
                  )}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{log.weight}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{log.calories}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{log.protein}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-right">
                  <button
                    onClick={() => handleDelete(log.id)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      )}
    </motion.div>
  );
};

export default LogTable;