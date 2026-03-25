import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store';
import { 
  Search, Filter, Users, Calendar, Clock, Send, X,
  Lightbulb, CheckCircle
} from 'lucide-react';


export default function BrowseIdeas() {
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [pendingIdea, setPendingIdea] = useState<typeof ideas[0] | null>(null);
  const { user, ideas, requests, addRequest, addNotification, setProfileToView } = useStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open'>('all');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<typeof ideas[0] | null>(null);
  const [requestAnswer, setRequestAnswer] = useState('');

  if (!user) return null;

  if (user.role === 'owner') {
  return (
    <div className="glass rounded-2xl p-12 text-center">
      <Lightbulb className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h2 className="text-xl font-bold text-titanium-900 dark:text-white mb-2">
        Problem Owners cannot browse ideas
      </h2>
      <p className="text-gray-500 dark:text-gray-400">
        Builders can browse and join projects. Owners can manage their ideas in "My Ideas".
      </p>
    </div>
  );
}

  const availableIdeas = ideas.filter((idea) => {
  return (
    idea.isPublished &&
    idea.status === 'open' &&
    idea.userId !== user.id
  );
});
  const filteredIdeas = availableIdeas.filter(idea => {
    const matchesSearch = idea.title.toLowerCase().includes(search.toLowerCase()) ||
      idea.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || idea.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const hasRequested = (ideaId: string) => requests.some(r => r.ideaId === ideaId && r.requesterId === user.id);

  const handleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIdea || !requestAnswer.trim()) return;

    addRequest({
      ideaId: selectedIdea.id,
      ideaTitle: selectedIdea.title,
      requesterId: user.id,
      requesterName: user.displayName,
      ownerId: selectedIdea.userId,
      answer: requestAnswer,
    });

    addNotification('Collaboration request sent!', 'success');
    setShowRequestModal(false);
    setSelectedIdea(null);
    setRequestAnswer('');
  };

  const openRequestModal = (idea: typeof ideas[0]) => {
  setPendingIdea(idea);
  setShowTermsModal(true);
};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-titanium-900 dark:text-white">Browse Ideas</h1>
        <p className="text-gray-500 dark:text-gray-400">Find projects that match your skills and interests</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search ideas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl glass bg-transparent border border-titanium-200 dark:border-titanium-700 focus:border-copper-500 focus:ring-2 focus:ring-copper-500/20 outline-none transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="px-4 py-3 rounded-xl glass bg-transparent border border-titanium-200 dark:border-titanium-700 focus:border-copper-500 outline-none transition-all"
        >
          <option value="all">All Status</option>
          <option value="open">Open</option>
        </select>
      </div>

      {/* Ideas Count */}
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Lightbulb className="w-4 h-4" />
        {filteredIdeas.length} ideas available
      </div>

      {showTermsModal && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
    <div className="glass rounded-2xl p-8 max-w-lg">
      <h2 className="text-xl font-bold mb-4 text-white">
        Collaboration Terms
      </h2>

      <p className="text-gray-300 text-sm mb-6 leading-relaxed">
        By joining this project you agree that the idea and final ownership
        belong to the problem owner. Your role is as a collaborator or builder.
        After completion of the project you cannot claim the project as your
        own independent idea or product.
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => setShowTermsModal(false)}
          className="flex-1 py-3 bg-gray-700 rounded-xl"
        >
          Cancel
        </button>

        <button
          onClick={() => {
            setShowTermsModal(false);
            setSelectedIdea(pendingIdea);
            setShowRequestModal(true);
          }}
          className="flex-1 py-3 bg-copper-500 text-white rounded-xl"
        >
          I Agree
        </button>
      </div>
    </div>
  </div>
)}

      {/* Request Modal */}
      <AnimatePresence>
        {showRequestModal && selectedIdea && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => { setShowRequestModal(false); setSelectedIdea(null); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg glass rounded-3xl p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-titanium-900 dark:text-white">Request Collaboration</h2>
                <button onClick={() => { setShowRequestModal(false); setSelectedIdea(null); }} className="p-2 hover:bg-titanium-100 dark:hover:bg-titanium-900 rounded-lg cursor-hover">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6 p-4 rounded-xl bg-titanium-100 dark:bg-titanium-900">
                <h3 className="font-bold text-titanium-900 dark:text-white mb-2">{selectedIdea.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Expected from collaborators: {selectedIdea.expectations}</p>
              </div>

              <form onSubmit={handleRequest}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                    Why should they choose you? *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={requestAnswer}
                    onChange={(e) => setRequestAnswer(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl glass bg-transparent border border-titanium-200 dark:border-titanium-700 focus:border-copper-500 focus:ring-2 focus:ring-copper-500/20 outline-none transition-all resize-none"
                    placeholder="Describe your skills, experience, and why you're a good fit for this project..."
                  />
                </div>

                <div className="flex gap-4">
                  <motion.button
                    type="submit"
                    className="flex-1 py-4 bg-gradient-to-r from-copper-500 to-copper-600 text-white font-bold rounded-xl btn-shine cursor-hover flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Send className="w-5 h-5" /> Send Request
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ideas List */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredIdeas.length === 0 ? (
          <div className="col-span-2 glass rounded-2xl p-12 text-center">
            <Lightbulb className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-titanium-900 dark:text-white mb-2">No ideas found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredIdeas.map((idea, index) => (
            <motion.div
              key={idea.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-2xl p-6 card-3d"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-500">
                  Open
                </span>
                {hasRequested(idea.id) && (
                  <span className="flex items-center gap-1 text-xs text-copper-500">
                    <CheckCircle className="w-3 h-3" /> Requested
                  </span>
                )}
              </div>

              <h3 className="text-xl font-bold text-titanium-900 dark:text-white mb-3">{idea.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4 line-clamp-3">{idea.description}</p>

              <div className="mb-4 p-3 rounded-xl bg-titanium-100 dark:bg-titanium-900">
                <p className="text-sm text-copper-500 font-medium mb-1">Looking for:</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{idea.expectations}</p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" /> {idea.userName}
                </span>
                {idea.dueDate && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> Due: {new Date(idea.dueDate).toLocaleDateString()}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {new Date(idea.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex gap-3">
  {hasRequested(idea.id) ? (
    <button
      disabled
      className="flex-1 py-3 glass rounded-xl font-medium text-copper-500 cursor-not-allowed"
    >
      Request Sent
    </button>
  ) : (
    user.role === "builder" && (
      <motion.button
        onClick={() => openRequestModal(idea)}
        className="flex-1 py-3 bg-gradient-to-r from-copper-500 to-copper-600 text-white font-semibold rounded-xl cursor-hover"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Request to Join
      </motion.button>
    )
  )}

  <button
    onClick={() =>
      setProfileToView({
        ...user,
        id: idea.userId,
        displayName: idea.userName,
        bio: "",
        skills: [],
        role: "owner",
        isVerified: true,
        membership: "free",
        joinDate: idea.createdAt,
        problemsPosted: 0,
        activeProjects: 0,
        completedProjects: 0,
        trustScore: 75,
      })
    }
    className="px-4 py-3 glass rounded-xl font-medium cursor-hover"
  >
    View Owner
  </button>
</div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
