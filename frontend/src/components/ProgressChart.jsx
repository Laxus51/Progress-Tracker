import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const ProgressChart = ({ logs }) => {
  const [chartType, setChartType] = useState('weight'); // 'weight' or 'nutrition'

  // Get the last 7 days of data, sorted by date
  const recentLogs = [...logs]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-7);

  // Format date for display on chart
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Progress Charts</h2>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setChartType('weight')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm ${
              chartType === 'weight'
                ? 'bg-indigo-700 text-black shadow-md'
                : 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500'
            }`}
          >
            Weight
          </button>
          <button
            onClick={() => setChartType('nutrition')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm ${
              chartType === 'nutrition'
                ? 'bg-indigo-700 text-black shadow-md'
                : 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500'
            }`}
          >
            Nutrition
          </button>
        </div>
      </div>

      {recentLogs.length < 2 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mb-4 text-gray-400 dark:text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <p className="text-center">Need at least 2 entries to display a chart.<br />Keep logging your progress!</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={350}>
          {chartType === 'weight' ? (
            <LineChart data={recentLogs} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate} 
                stroke="#6B7280"
              />
              <YAxis 
                stroke="#6B7280"
                domain={['dataMin - 1', 'dataMax + 1']}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  borderColor: '#374151',
                  color: '#F9FAFB' 
                }} 
                labelFormatter={formatDate} 
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="weight"
                name="Weight (kg)"
                stroke="#4F46E5"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                animationDuration={1500}
              />
            </LineChart>
          ) : (
            <LineChart data={recentLogs} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate} 
                stroke="#6B7280"
              />
              <YAxis 
                stroke="#6B7280"
                yAxisId="left"
                orientation="left"
              />
              <YAxis 
                stroke="#6B7280"
                yAxisId="right"
                orientation="right"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  borderColor: '#374151',
                  color: '#F9FAFB' 
                }} 
                labelFormatter={formatDate} 
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="calories"
                name="Calories"
                stroke="#F59E0B"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                yAxisId="left"
                animationDuration={1500}
              />
              <Line
                type="monotone"
                dataKey="protein"
                name="Protein (g)"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                yAxisId="right"
                animationDuration={1500}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      )}
    </motion.div>
  );
};

export default ProgressChart;