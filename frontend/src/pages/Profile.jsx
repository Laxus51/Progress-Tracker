import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useUser } from '@clerk/clerk-react';
import Navbar from '../components/Navbar';

const Profile = () => {
  const { user } = useUser();
  
  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
    goal: 'Lose weight',
    startingWeight: 80,
    targetWeight: 70,
    notifications: true
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(userProfile);

  // Update profile with Clerk user data when available
  useEffect(() => {
    if (user) {
      // Get basic user info from Clerk
      const profileData = {
        name: user.fullName || user.username || '',
        email: user.primaryEmailAddress?.emailAddress || '',
        // Get custom profile data from unsafeMetadata if available
        goal: user.unsafeMetadata?.goal || 'Lose weight',
        startingWeight: user.unsafeMetadata?.startingWeight || 80,
        targetWeight: user.unsafeMetadata?.targetWeight || 70,
        notifications: user.unsafeMetadata?.notifications !== undefined ? user.unsafeMetadata.notifications : true
      };
      
      setUserProfile(profileData);
    }
  }, [user]);

  // Update form data when userProfile changes
  useEffect(() => {
    setFormData(userProfile);
  }, [userProfile]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Save custom profile data to Clerk's unsafeMetadata
      if (user) {
        // Extract only the custom fields that should be saved to metadata
        const metadataToUpdate = {
          goal: formData.goal,
          startingWeight: formData.startingWeight,
          targetWeight: formData.targetWeight,
          notifications: formData.notifications
        };
        
        // Update Clerk's unsafeMetadata
        await user.update({
          unsafeMetadata: {
            ...user.unsafeMetadata, // Preserve existing metadata
            ...metadataToUpdate // Update with new values
          }
        });
      }
      
      // Update local state
      setUserProfile(formData);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Profile</h1>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-indigo-700 hover:bg-indigo-800 text-black dark:text-white font-medium px-4 py-2 rounded-md transition-colors shadow-md"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                      disabled={user ? true : false} // Disable name editing if using Clerk
                    />
                    {user && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Name is managed by your account settings
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                      disabled={user ? true : false} // Disable email editing if using Clerk
                    />
                    {user && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Email is managed by your account settings
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="goal" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Fitness Goal
                    </label>
                    <select
                      id="goal"
                      name="goal"
                      value={formData.goal}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Lose weight">Lose weight</option>
                      <option value="Gain muscle">Gain muscle</option>
                      <option value="Maintain weight">Maintain weight</option>
                      <option value="Improve fitness">Improve fitness</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="startingWeight" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Starting Weight (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      id="startingWeight"
                      name="startingWeight"
                      value={formData.startingWeight}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="targetWeight" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Target Weight (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      id="targetWeight"
                      name="targetWeight"
                      value={formData.targetWeight}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="notifications"
                      name="notifications"
                      checked={formData.notifications}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="notifications" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Enable notifications
                    </label>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <motion.button
                    type="submit"
                    className="bg-indigo-700 hover:bg-indigo-800 text-black dark:text-white font-medium px-4 py-2 rounded-md transition-colors shadow-md"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Save Changes
                  </motion.button>
                  
                  <motion.button
                    type="button"
                    onClick={() => {
                      setFormData(userProfile);
                      setIsEditing(false);
                    }}
                    className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-900 dark:text-white font-medium px-4 py-2 rounded-md transition-colors shadow-md"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</h3>
                    <p className="mt-1 text-lg font-medium text-gray-900 dark:text-white">{userProfile.name}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</h3>
                    <p className="mt-1 text-lg font-medium text-gray-900 dark:text-white">{userProfile.email}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Fitness Goal</h3>
                    <p className="mt-1 text-lg font-medium text-gray-900 dark:text-white">{userProfile.goal}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Starting Weight</h3>
                    <p className="mt-1 text-lg font-medium text-gray-900 dark:text-white">{userProfile.startingWeight} kg</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Target Weight</h3>
                    <p className="mt-1 text-lg font-medium text-gray-900 dark:text-white">{userProfile.targetWeight} kg</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Notifications</h3>
                    <p className="mt-1 text-lg font-medium text-gray-900 dark:text-white">
                      {userProfile.notifications ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Profile;