import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import LogForm from '../components/LogForm';
import LogTable from '../components/LogTable';
import ProgressChart from '../components/ProgressChart';
import { fetchLogs, saveLog } from '../services/api';

// Mock data for initial state
const initialLogs = [
  {
    id: 1,
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    weight: 78.5,
    calories: 2200,
    protein: 130
  },
  {
    id: 2,
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    weight: 78.2,
    calories: 2150,
    protein: 135
  },
  {
    id: 3,
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    weight: 77.8,
    calories: 2100,
    protein: 140
  },
  {
    id: 4,
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    weight: 77.5,
    calories: 2050,
    protein: 145
  },
  {
    id: 5,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    weight: 77.2,
    calories: 2000,
    protein: 150
  },
  {
    id: 6,
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    weight: 76.9,
    calories: 1950,
    protein: 155
  }
];

const Dashboard = () => {
  const { user } = useUser();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load logs from API on component mount
  useEffect(() => {
    fetchLogsData();
  }, []);

  // Function to fetch logs data
  const fetchLogsData = async () => {
    try {
      setLoading(true);
      const data = await fetchLogs();
      setLogs(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch logs:', err);
      setError('Failed to load your progress data. Please try again later.');
      toast.error('Failed to load progress data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddLog = async (newLog) => {
    try {
      // Save log to backend
      const savedLog = await saveLog(newLog);
      
      // Update local state
      const existingLogIndex = logs.findIndex(log => log.id === savedLog.id);
      
      if (existingLogIndex !== -1) {
        // Update existing log
        const updatedLogs = [...logs];
        updatedLogs[existingLogIndex] = savedLog;
        setLogs(updatedLogs);
      } else {
        // Add new log
        setLogs([...logs, savedLog]);
      }
      
      toast.success('Progress logged successfully!');
    } catch (err) {
      console.error('Failed to save log:', err);
      toast.error('Failed to save progress data');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          className="flex items-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome, {user ? user.firstName || user.username : 'Fitness Enthusiast'}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Track your fitness journey and see your progress over time.
            </p>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <LogForm onAddLog={handleAddLog} />
              <ProgressChart logs={logs} />
            </div>

            <LogTable logs={logs} onRefresh={fetchLogsData} />
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;