import { SignUp as ClerkSignUp } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const SignUp = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center items-center p-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-600 mb-2">Gym Progress Tracker</h1>
          <p className="text-gray-600 dark:text-gray-400">Create an account to start tracking your fitness journey</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <ClerkSignUp 
            routing="path" 
            path="/sign-up" 
            signInUrl="/sign-in"
            appearance={{
              elements: {
                formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-700 text-sm normal-case',
                footerActionLink: 'text-indigo-600 hover:text-indigo-500',
                card: 'bg-white dark:bg-gray-800 shadow-none',
                headerTitle: 'text-gray-900 dark:text-white',
                headerSubtitle: 'text-gray-500 dark:text-gray-400',
                formFieldLabel: 'text-gray-700 dark:text-gray-300',
                formFieldInput: 'rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-indigo-500 focus:border-indigo-500',
              },
              layout: {
                showOptionalFields: true,
                socialButtonsVariant: 'iconButton',
                socialButtonsPlacement: 'bottom',
                termsPageUrl: 'terms',
                privacyPageUrl: 'privacy',
                helpPageUrl: 'help',
              },
            }}
          />
        </div>
        
        <div className="text-center mt-8">
          <p className="text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/sign-in" className="text-indigo-600 hover:text-indigo-500 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;