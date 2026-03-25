import { useStore } from '../store';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info } from 'lucide-react';

export default function Toast() {
  const { notifications, darkMode } = useStore();
  
  return (
    <div className="fixed top-4 right-4 z-[10000] space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-xl ${
              notification.type === 'success' 
                ? 'bg-green-500/20 border border-green-500/30' 
                : notification.type === 'error'
                ? 'bg-red-500/20 border border-red-500/30'
                : 'bg-primary-500/20 border border-primary-500/30'
            }`}
          >
            {notification.type === 'success' && <CheckCircle className="w-5 h-5 text-green-400" />}
            {notification.type === 'error' && <XCircle className="w-5 h-5 text-red-400" />}
            {notification.type === 'info' && <Info className="w-5 h-5 text-primary-400" />}
            <span className={`text-sm font-medium text-white`}>
              {notification.message}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
