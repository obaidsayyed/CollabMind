import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store';
import ProjectCard from './ProjectCard';
import UpdateStatusModal from './UpdateStatusModal';
import { FolderKanban, CheckCircle, Clock, Zap } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  progress: number;
  status: string;
  completed: boolean;
}

export default function CurrentProjects() {
  const { user, ideas, updateIdea, addCertificate, addNotification } = useStore();
  
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showModal, setShowModal] = useState(false);

  if (!user) return null;
const userProjects = ideas.filter(
  idea =>
    idea.userId === user.id ||
    idea.collaborators.includes(user.id)
);

const currentProjects = userProjects.filter(
  idea => idea.status === "in_review"
);

const completedProjects = userProjects.filter(
  idea => idea.status === "completed"
);

const handleUpdateProject = (projectId: string, progress: number, status: string) => {

  updateIdea(projectId, {
    progress: progress,
    projectStatus: status,
    status: progress === 100 ? "completed" : "in_review"
  });

  // create certificate when project is completed
  if (progress === 100 && user) {
  const idea = ideas.find(i => i.id === projectId);

  addCertificate({
    userId: user.id,
    projectId: projectId,
    projectTitle: idea?.title || "Project",
    earnedAt: new Date().toISOString(),
    type: "completion"
  });
}

  addNotification('Project progress updated!', 'success');
  setShowModal(false);
  setSelectedProject(null);
};
  const openUpdateModal = (project: Project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-white">Current Projects</h1>
        <p className="text-gray-400">Track and manage your active collaborations</p>
      </motion.div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-xl p-4 flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold gradient-text">{currentProjects.length}</div>
            <div className="text-sm text-gray-400">Active Projects</div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-xl p-4 flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">{completedProjects.length}</div>
            <div className="text-sm text-gray-400">Completed</div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-xl p-4 flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400">
  0%
</div>
            <div className="text-sm text-gray-400">Avg. Progress</div>
          </div>
        </motion.div>
      </div>

      {/* Current Projects Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <FolderKanban className="w-5 h-5 text-indigo-400" />
          <h2 className="text-xl font-bold text-white">In Progress</h2>
        </div>
        
        {currentProjects.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <FolderKanban className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No active projects</h3>
            <p className="text-gray-400">Browse ideas and collaborate to start a project</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentProjects.map((idea, index) => (
  <ProjectCard
    key={idea.id}
    project={{
  id: idea.id,
  title: idea.title,
  description: idea.description,
  progress: idea.progress ?? 0,
  status: idea.projectStatus ?? "Project started",
  completed: idea.status === "completed",
  collaborators: idea.collaborators
}}
                index={index}
                onUpdateStatus={() =>
  openUpdateModal({
  id: idea.id,
  title: idea.title,
  description: idea.description,
  progress: 0,
  status: idea.status,
  completed: false
})
}
              />
            ))}
          </div>
        )}
      </motion.section>

      {/* Completed Projects Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <h2 className="text-xl font-bold text-white">Completed</h2>
        </div>
        
        {completedProjects.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <CheckCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No completed projects yet</h3>
            <p className="text-gray-400">Complete your first project to see it here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedProjects.map((idea, index) => (
  <ProjectCard
    key={idea.id}
    project={{
      id: idea.id,
      title: idea.title,
      description: idea.description,
      progress: 100,
      status: "Completed",
      completed: true
    }}
    index={index}
    onUpdateStatus={() => {}}
  />
))}
          </div>
        )}
      </motion.section>

      {/* Update Status Modal */}
      {showModal && selectedProject && (
        <UpdateStatusModal
          project={selectedProject}
          onClose={() => {
            setShowModal(false);
            setSelectedProject(null);
          }}
          onSave={handleUpdateProject}
        />
      )}
    </div>
  );
}
