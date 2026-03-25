import { motion } from 'framer-motion';
import { Edit2 } from 'lucide-react';
import { useStore } from '../../store';

interface Project {
  id: string;
  title: string;
  description: string;
  progress: number;
  status: string;
  completed: boolean;
  collaborators?: string[];
}

interface ProjectCardProps {
  project: Project;
  index: number;
  onUpdateStatus: () => void;
}

export default function ProjectCard({ project, index, onUpdateStatus }: ProjectCardProps) {
  const { user } = useStore();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="glass rounded-2xl p-6 space-y-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{project.title}</h3>
        {project.completed && (
          <span className="text-green-600 bg-green-100 px-3 py-1 rounded-full text-xs">
            Completed
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-gray-500 text-sm line-clamp-2">{project.description}</p>

      {/* Status */}
      <div className="text-sm">
        <span className="text-gray-500">Status: </span>
        <span className="text-orange-500">{project.status}</span>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Progress</span>
          <span className={`font-medium ${project.completed ? 'text-green-600' : 'text-orange-500'}`}>
            {project.progress}% Completed
          </span>
        </div>
        <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${project.progress}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Update Button - Only Builders Can Update */}
{user && project.collaborators?.includes(user.id) && (
<motion.button
  onClick={onUpdateStatus}
  className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 cursor-hover ${
    project.completed
      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
      : 'bg-gradient-to-r from-orange-500 to-orange-400 text-white'
  }`}
  whileHover={project.completed ? {} : { scale: 1.02 }}
  whileTap={project.completed ? {} : { scale: 0.98 }}
  disabled={project.completed}
>
  <Edit2 className="w-4 h-4" />
  {project.completed ? 'Project Completed' : 'Update Status'}
</motion.button>
)}
    </motion.div>
  );
}
