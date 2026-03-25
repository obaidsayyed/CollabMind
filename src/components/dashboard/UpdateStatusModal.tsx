import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  progress: number;
  status: string;
  completed: boolean;
}

interface UpdateStatusModalProps {
  project: Project;
  onClose: () => void;
  onSave: (projectId: string, progress: number, status: string) => void;
}

export default function UpdateStatusModal({ project, onClose, onSave }: UpdateStatusModalProps) {
  const [progress, setProgress] = useState(project.progress);
  const [status, setStatus] = useState(project.status);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (progress < 0 || progress > 100) return;
    onSave(project.id, progress, status);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md glass rounded-3xl p-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Update Progress</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white cursor-hover transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Project Info */}
          <div className="mb-6 p-4 rounded-xl bg-gray-800/50">
            <h3 className="font-bold text-white mb-1">{project.title}</h3>
            <p className="text-sm text-gray-400 line-clamp-2">{project.description}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Progress Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Progress Percentage (0-100)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => setProgress(parseInt(e.target.value))}
                  className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => setProgress(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                  className="w-20 px-3 py-2 rounded-xl glass bg-transparent border border-gray-600 text-white text-center focus:border-purple-500 outline-none"
                />
              </div>
              <div className="mt-2 text-sm text-gray-400">
                Current: <span className="text-purple-400 font-medium">{progress}%</span>
              </div>
            </div>

            {/* Status Textarea */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status Update
              </label>
              <textarea
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                rows={3}
                placeholder="Describe the current progress of the project..."
                className="w-full px-4 py-3 rounded-xl glass bg-transparent border border-gray-600 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all resize-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <motion.button
                type="submit"
                className="flex-1 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 cursor-hover"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Save className="w-5 h-5" /> Save Changes
              </motion.button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-4 glass rounded-xl font-medium text-gray-300 cursor-hover hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
