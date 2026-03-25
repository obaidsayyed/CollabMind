import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';
import { 
  X, Shield, Calendar, MessageSquare
} from 'lucide-react';

export default function ProfileModal() {
  const { profileToView, setShowProfileModal,  user: currentUser } = useStore();

  if (!profileToView) return null;

  const isOwnProfile = currentUser?.id === profileToView.id;

  const stats = [
    { label: 'Problems Posted', value: profileToView.problemsPosted },
    { label: 'Active Projects', value: profileToView.activeProjects },
    { label: 'Completed', value: profileToView.completedProjects },
    { label: 'Trust Score', value: profileToView.trustScore },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={() => setShowProfileModal(false)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg glass rounded-3xl"
        >
          {/* Cover */}
          <div className="h-32 bg-gradient-to-r from-copper-500 to-copper-600 relative">
            <button
              onClick={() => setShowProfileModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/20 text-white hover:bg-black/30 cursor-hover"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 pb-6">
            {/* Avatar */}
            <div className="flex justify-end -mt-12 mb-4">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-copper-400 to-copper-600 flex items-center justify-center text-white text-3xl font-bold ring-4 ring-gray-800">
                {profileToView.displayName.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* Info */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-titanium-900 dark:text-white">
                  {profileToView.displayName}
                </h2>
                {profileToView.isVerified && (
                  <Shield className="w-5 h-5 text-green-500" />
                )}
              </div>
              
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <span className={`px-2 py-1 rounded-full ${
                  profileToView.role === 'owner' 
                    ? 'bg-copper-500/20 text-copper-500' 
                    : 'bg-blue-500/20 text-blue-500'
                }`}>
                  {profileToView.role === 'owner' ? 'Problem Owner' : 'Builder'}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Joined {new Date(profileToView.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
              </div>

              {profileToView.bio && (
                <p className="text-gray-600 dark:text-gray-300">
                  {profileToView.bio}
                </p>
              )}
            </div>

            {/* Skills */}
            {profileToView.skills && profileToView.skills.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profileToView.skills.map((skill) => (
                    <span 
                      key={skill}
                      className="px-3 py-1 rounded-full bg-copper-500/20 text-copper-500 text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Actions */}
            {!isOwnProfile && (
              <div className="flex gap-3">
                <motion.button
                  className="flex-1 py-3 bg-gradient-to-r from-copper-500 to-copper-600 text-white font-semibold rounded-xl cursor-hover"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MessageSquare className="w-5 h-5 inline mr-2" />
                  Message
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
