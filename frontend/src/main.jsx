import React from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import './index.css'
import App from './App.jsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY} 
      afterSignOutUrl="/"
      appearance={{
        layout: {
          showOptionalFields: true,
          socialButtonsVariant: 'iconButton',
          socialButtonsPlacement: 'bottom',
          termsPageUrl: 'terms',
          privacyPageUrl: 'privacy',
          helpPageUrl: 'help',
        },
        elements: {
          formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-700 text-sm normal-case',
          footerActionLink: 'text-indigo-600 hover:text-indigo-500',
          card: 'bg-white dark:bg-gray-800 shadow-none',
          headerTitle: 'text-gray-900 dark:text-white',
          headerSubtitle: 'text-gray-500 dark:text-gray-400',
          formFieldLabel: 'text-gray-700 dark:text-gray-300',
          formFieldInput: 'rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-indigo-500 focus:border-indigo-500',
        },
      }}
    >
      <App />
    </ClerkProvider>
  </React.StrictMode>,
)
