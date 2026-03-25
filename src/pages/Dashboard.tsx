import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';
import Overview from '../components/dashboard/Overview';
import MyIdeas from '../components/dashboard/MyIdeas';
import BrowseIdeas from '../components/dashboard/BrowseIdeas';
import Requests from '../components/dashboard/Requests';
import Chat from '../components/dashboard/Chat';
import Submissions from '../components/dashboard/Submissions';
import Certificates from '../components/dashboard/Certificates';
import Settings from '../components/dashboard/Settings';
import ProfileModal from '../components/ProfileModal';
import CurrentProjects from '../components/dashboard/CurrentProjects';
import { 
  LayoutDashboard, Lightbulb, Users, MessageSquare, FileText, 
  Award, Settings as SettingsIcon, Menu, X, LogOut, ChevronDown,
  Bell, Sparkles, Zap
} from 'lucide-react';

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'my-ideas', label: 'My Ideas', icon: Lightbulb, path: '/dashboard/my-ideas' },
  { id: 'browse-ideas', label: 'Browse Ideas', icon: Users, path: '/dashboard/browse-ideas' },
  { id: 'requests', label: 'Requests', icon: MessageSquare, path: '/dashboard/requests' },
  { id: 'chat', label: 'Chat', icon: MessageSquare, path: '/dashboard/chat' },
  { id: 'current-projects', label: 'Current Projects', icon: Zap, path: '/dashboard/current-projects' },
  { id: 'submissions', label: 'Submissions', icon: FileText, path: '/dashboard/submissions' },
  { id: 'certificates', label: 'Certificates', icon: Award, path: '/dashboard/certificates' },
  { id: 'settings', label: 'Settings', icon: SettingsIcon, path: '/dashboard/settings' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, showProfileModal, setShowProfileModal, setProfileToView } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const currentPath = location.pathname;
  const currentNavItem = navItems.find(item => item.path === currentPath) || navItems[0];

  const filteredNavItems = navItems.filter(item => {

  if (item.id === "browse-ideas" && user.role === "owner") {
    return false;
  }

  if (item.id === "my-ideas" && user.role === "builder") {
    return false;
  }

  if (item.id === "certificates" && user.role === "owner") {
    return false;
  }

  return true;
});

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-72 fixed inset-y-0 z-40">
        <div className="flex-1 flex flex-col bg-white border-r border-gray-200">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-6">
            <Link to="/" className="flex items-center gap-3 cursor-hover">
              <div className="h-10 flex items-center">
  <img
    src="collabmindbg.jpeg"
    className="h-full object-contain"
  />
</div>
              <span className="text-xl font-bold gradient-text">Collab Mind</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {filteredNavItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-hover ${
                  currentPath === item.path
                    ? 'bg-gradient-to-r from-copper-500/20 to-copper-600/20 text-copper-500'
                    : 'text-gray-500 hover:bg-orange-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-hover"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-copper-400 to-copper-600 flex items-center justify-center text-white font-bold">
                {user.displayName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-gray-900">{user.displayName}</div>
                <div className="text-sm text-gray-500">{user.role === 'owner' ? 'Problem Owner' : 'Builder'}</div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {profileMenuOpen && (
              <motion.div
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  className="mt-2 p-2 rounded-xl glass"
>
  <button
    onClick={handleLogout}
    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-red-500 hover:bg-red-500/10 cursor-hover"
  >
    <LogOut className="w-4 h-4" />
    <span className="text-sm">Logout</span>
  </button>
</motion.div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Navigation */}
      <div className={`lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 ${sidebarOpen ? 'hidden' : ''}`}>
        <div className="flex items-center justify-between px-4 h-16">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 cursor-hover"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 flex items-center">
  <img
    src="collabmindbg.jpeg"
    className="h-full object-contain"
  />
</div>
            <span className="font-bold gradient-text">Collab Mind</span>
          </Link>

          <button
            onClick={() => {
              setProfileToView(user);
              setProfileMenuOpen(false);
            }}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-copper-400 to-copper-600 flex items-center justify-center text-white text-sm font-bold"
          >
            {user.displayName.charAt(0).toUpperCase()}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  className="lg:hidden fixed inset-0 bg-black/20 z-40"
  onClick={() => setSidebarOpen(false)}
/>
<motion.div
  initial={{ x: -280 }}
  animate={{ x: 0 }}
  exit={{ x: -280 }}
  className="lg:hidden fixed top-0 left-0 w-full max-w-xs h-[92vh] z-50 bg-white border-r border-gray-200 flex flex-col overflow-y-auto"
>
              <div className="flex items-center justify-between px-4 py-6 border-b border-gray-200">
                <Link to="/" className="flex items-center gap-3">
                  <div className="h-10 flex items-center">
  <img
    src="collabmindbg.jpeg"
    className="h-full object-contain"
  />
</div>
                  <span className="text-xl font-bold gradient-text">Collab Mind</span>
                </Link>
              </div>
              
              <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
                {filteredNavItems.map((item) => (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-hover ${
                      currentPath === item.path
                        ? 'bg-gradient-to-r from-copper-500/20 to-copper-600/20 text-copper-500'
                        : 'text-gray-500 hover:bg-orange-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </nav>

              <div className="mt-auto p-4 border-t border-gray-200 pb-10">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 cursor-hover"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 pt-16 lg:pt-0">
        <div className="p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPath}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Routes>
                <Route index element={<Overview />} />
                <Route path="my-ideas" element={<MyIdeas />} />
                <Route path="browse-ideas" element={<BrowseIdeas />} />
                <Route path="current-projects" element={<CurrentProjects />} />
                <Route path="requests" element={<Requests />} />
                <Route path="chat" element={<Chat />} />
                <Route path="submissions" element={<Submissions />} />
                <Route path="certificates" element={<Certificates />} />
                <Route path="settings" element={<Settings />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Profile Modal */}
      {showProfileModal && <ProfileModal />}
    </div>
  );
}
