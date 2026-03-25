import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store';
import { 
  User, Lock, Bell, Shield, Trash2, Save, Camera,
  Mail, AlertTriangle, CheckCircle, XCircle
} from 'lucide-react';

export default function Settings() {
  const { user, updateUser, deleteAccount, logout, addNotification } = useStore();
  const [activeSection, setActiveSection] = useState<'profile' | 'account' | 'notifications' | 'danger'>('profile');
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || '',
    bio: user?.bio || '',
    skills: user?.skills?.join(', ') || '',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    requestAlerts: true,
    projectUpdates: true,
    weeklyDigest: false,
  });

  if (!user) return null;

  const handleProfileSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    updateUser({
      displayName: profileData.displayName,
      bio: profileData.bio,
      skills: profileData.skills.split(',').map(s => s.trim()).filter(Boolean),
    });
    
    addNotification('Profile updated successfully!', 'success');
    setSaving(false);
  };

  const handleNotificationSave = () => {
    addNotification('Notification preferences saved!', 'success');
  };

  const handleDeleteAccount = () => {
    deleteAccount();
    logout();
    addNotification('Account deleted', 'info');
  };

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'danger', label: 'Danger Zone', icon: AlertTriangle },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-titanium-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage your account and preferences</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id as typeof activeSection)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-hover ${
                activeSection === section.id
                  ? 'bg-copper-500 text-white'
                  : 'glass hover:bg-copper-500/20'
              }`}
            >
              <section.icon className="w-5 h-5" />
              <span className="font-medium">{section.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeSection === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-6 space-y-6"
            >
              <h2 className="text-xl font-bold text-titanium-900 dark:text-white">Profile Settings</h2>
              
              {/* Avatar */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-copper-400 to-copper-600 flex items-center justify-center text-white text-3xl font-bold ring-4 ring-white/20 shadow-lg">
                    {user.displayName.charAt(0).toUpperCase()}
                  </div>
                  <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-copper-500 text-white flex items-center justify-center cursor-hover">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <h3 className="font-bold text-titanium-900 dark:text-white">{user.displayName}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>

              {/* Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={profileData.displayName}
                    onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl glass bg-transparent border border-titanium-200 dark:border-titanium-700 focus:border-copper-500 focus:ring-2 focus:ring-copper-500/20 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    rows={4}
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl glass bg-transparent border border-titanium-200 dark:border-titanium-700 focus:border-copper-500 focus:ring-2 focus:ring-copper-500/20 outline-none transition-all resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                    Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    value={profileData.skills}
                    onChange={(e) => setProfileData({ ...profileData, skills: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl glass bg-transparent border border-titanium-200 dark:border-titanium-700 focus:border-copper-500 focus:ring-2 focus:ring-copper-500/20 outline-none transition-all"
                    placeholder="React, Node.js, Python..."
                  />
                </div>
              </div>

              <motion.button
                onClick={handleProfileSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-copper-500 to-copper-600 text-white font-semibold rounded-xl btn-shine cursor-hover disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {saving ? 'Saving...' : <><Save className="w-5 h-5" /> Save Changes</>}
              </motion.button>
            </motion.div>
          )}

          {activeSection === 'account' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-6 space-y-6"
            >
              <h2 className="text-xl font-bold text-titanium-900 dark:text-white">Account Settings</h2>

              {/* Email (read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl glass bg-titanium-100 dark:bg-titanium-900">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-500">{user.email}</span>
                  <span className="ml-auto text-xs text-gray-400">Cannot be changed</span>
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                  Account Role
                </label>
                <div className="px-4 py-3 rounded-xl glass bg-titanium-100 dark:bg-titanium-900">
                  <span className="text-titanium-900 dark:text-white font-medium">
                    {user.role === 'owner' ? 'Problem Owner' : 'Builder'}
                  </span>
                </div>
              </div>

              {/* Membership */}
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                  Membership
                </label>
                <div className="flex items-center justify-between px-4 py-3 rounded-xl glass">
                  <div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user.membership === 'premium' 
                        ? 'bg-copper-500/20 text-copper-500' 
                        : 'bg-gray-500/20 text-gray-500'
                    }`}>
                      {user.membership === 'premium' ? 'Premium' : 'Free'}
                    </span>
                  </div>
                  {user.membership === 'free' && (
                    <button className="text-copper-500 hover:text-copper-400 font-medium cursor-hover">
                      Upgrade to Premium
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-6 space-y-6"
            >
              <h2 className="text-xl font-bold text-titanium-900 dark:text-white">Notification Preferences</h2>

              <div className="space-y-4">
                {[
                  { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
                  { key: 'requestAlerts', label: 'Request Alerts', desc: 'Get notified when you receive collaboration requests' },
                  { key: 'projectUpdates', label: 'Project Updates', desc: 'Updates about your active projects' },
                  { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Weekly summary of platform activity' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 rounded-xl glass">
                    <div>
                      <div className="font-medium text-titanium-900 dark:text-white">{item.label}</div>
                      <div className="text-sm text-gray-500">{item.desc}</div>
                    </div>
                    <button
                      onClick={() => setNotificationSettings({
                        ...notificationSettings,
                        [item.key]: !notificationSettings[item.key as keyof typeof notificationSettings]
                      })}
                      className={`w-12 h-6 rounded-full transition-colors cursor-hover border ${
  notificationSettings[item.key as keyof typeof notificationSettings]
    ? 'bg-green-500 border-green-500'
    : 'bg-gray-600 border-gray-600'
}`}
                    >
                      <motion.div
                        className="w-5 h-5 rounded-full bg-white"
                        animate={{ x: notificationSettings[item.key as keyof typeof notificationSettings] ? 24 : 2 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    </button>
                  </div>
                ))}
              </div>

              <motion.button
                onClick={handleNotificationSave}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-copper-500 to-copper-600 text-white font-semibold rounded-xl btn-shine cursor-hover"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Save className="w-5 h-5" /> Save Preferences
              </motion.button>
            </motion.div>
          )}

          {activeSection === 'danger' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-6 space-y-6"
            >
              <h2 className="text-xl font-bold text-red-500">Danger Zone</h2>
              
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                <h3 className="font-bold text-titanium-900 dark:text-white mb-2">Delete Account</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Once you delete your account, there is no going back. All your data, including ideas, 
                  collaborations, and certificates will be permanently deleted.
                </p>
                
                {!showDeleteConfirm ? (
                  <motion.button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white font-medium rounded-xl cursor-hover"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Trash2 className="w-4 h-4" /> Delete Account
                  </motion.button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-red-500 font-medium">
                      Are you sure? Type <span className="font-bold">DELETE</span> to confirm.
                    </p>
                    <input
                      type="text"
                      placeholder="Type DELETE"
                      className="w-full px-4 py-2 rounded-xl glass bg-transparent border border-red-500/30 focus:border-red-500 outline-none"
                      onChange={(e) => {
                        if (e.target.value === 'DELETE') {
                          handleDeleteAccount();
                        }
                      }}
                    />
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="text-gray-500 hover:text-gray-400 text-sm cursor-hover"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
