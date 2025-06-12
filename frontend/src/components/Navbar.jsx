import { UserButton } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <motion.nav 
      className="sticky top-0 bg-white dark:bg-gray-900 shadow-md p-4 flex justify-between items-center z-10"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Link to="/dashboard" className="flex items-center space-x-2">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-8 w-8 text-indigo-600" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
          />
        </svg>
        <span className="text-xl font-bold text-gray-800 dark:text-white">Gym Progress Tracker</span>
      </Link>
      <div className="flex items-center space-x-4">
        {/* Profile link */}
        <Link 
          to="/profile" 
          className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium px-3 py-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" 
              clipRule="evenodd" 
            />
          </svg>
          <span>Profile</span>
        </Link>
        {/* Clerk UserButton */}
        <UserButton 
          appearance={{
            elements: {
              userButtonAvatarBox: "w-10 h-10 border-2 border-indigo-100 dark:border-gray-700 rounded-full overflow-hidden",
              userButtonTrigger: "hover:opacity-80 transition-opacity"
            }
          }}
        />
      </div>
    </motion.nav>
  );
};

export default Navbar;