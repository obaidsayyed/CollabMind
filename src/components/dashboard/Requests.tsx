import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store';
import { 
  Users, CheckCircle, XCircle, Clock, MessageSquare, User,
  Eye, X
} from 'lucide-react';

export default function Requests() {
  const { user, ideas, requests, updateRequest, updateIdea, addNotification, setProfileToView } = useStore();
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedRequest, setSelectedRequest] = useState<typeof requests[0] | null>(null);

  if (!user) return null;

  // For owners: show requests on their ideas
  // For builders: show their own requests
  const userIdeaIds = ideas.filter(i => i.userId === user.id).map(i => i.id);
  const myRequests = user.role === 'owner' 
    ? requests.filter(r => userIdeaIds.includes(r.ideaId))
    : requests.filter(r => r.requesterId === user.id);

  const filteredRequests = filter === 'all' ? myRequests : myRequests.filter(r => r.status === filter);

  const handleApprove = (request: typeof requests[0]) => {
    updateRequest(request.id, { status: 'approved' });
    // Add collaborator to the idea
    const idea = ideas.find(i => i.id === request.ideaId);
    if (idea) {
      updateIdea(request.ideaId, { 
        collaborators: [...idea.collaborators, request.requesterId],
        status: 'in_review'
      });
    }
    addNotification(`Approved ${request.requesterName}'s request!`, 'success');
    setSelectedRequest(null);
  };

  const handleReject = (request: typeof requests[0]) => {
    updateRequest(request.id, { status: 'rejected' });
    addNotification('Request rejected', 'info');
    setSelectedRequest(null);
  };

  const statusColors = {
    pending: 'bg-yellow-500/20 text-yellow-500',
    approved: 'bg-green-500/20 text-green-500',
    rejected: 'bg-red-500/20 text-red-500',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-titanium-900 dark:text-white">Collaboration Requests</h1>
        <p className="text-gray-500 dark:text-gray-400">
          {user.role === 'owner' 
            ? 'Review and manage requests from builders wanting to collaborate'
            : 'Track your collaboration requests'}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-hover ${
              filter === status
                ? 'bg-copper-500 text-white'
                : 'glass hover:bg-copper-500/20'
            }`}
          >
            {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold gradient-text">{myRequests.filter(r => r.status === 'pending').length}</div>
          <div className="text-sm text-gray-500">Pending</div>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-500">{myRequests.filter(r => r.status === 'approved').length}</div>
          <div className="text-sm text-gray-500">Approved</div>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-red-500">{myRequests.filter(r => r.status === 'rejected').length}</div>
          <div className="text-sm text-gray-500">Rejected</div>
        </div>
      </div>

      {/* Requests List */}
      <div className="grid gap-4">
        {filteredRequests.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-titanium-900 dark:text-white mb-2">No requests found</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {user.role === 'owner' 
                ? 'You haven\'t received any collaboration requests yet'
                : 'You haven\'t sent any collaboration requests yet'}
            </p>
          </div>
        ) : (
          filteredRequests.map((request, index) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-2xl p-6 card-3d"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[request.status]}`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                    <span className="text-sm text-gray-500">
                      <Clock className="w-4 h-4 inline mr-1" />
                      {new Date(request.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-titanium-900 dark:text-white mb-2">
                    {request.ideaTitle}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-copper-400 to-copper-600 flex items-center justify-center text-white text-sm font-bold">
                      {request.requesterName.charAt(0)}
                    </div>
                    <span className="font-medium text-titanium-900 dark:text-white">
                      {request.requesterName}
                    </span>
                    <button
                      onClick={() => setProfileToView({ 
                        id: request.requesterId, 
                        displayName: request.requesterName, 
                        bio: '', 
                        skills: [], 
                        role: 'builder', 
                        isVerified: false, 
                        membership: 'free', 
                        joinDate: request.createdAt, 
                        problemsPosted: 0, 
                        activeProjects: 0, 
                        completedProjects: 0, 
                        trustScore: 50,
                        email: ''
                      })}
                      className="text-copper-500 hover:text-copper-400 text-sm cursor-hover"
                    >
                      View Profile
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-titanium-100 dark:bg-titanium-900">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="w-4 h-4 text-copper-500" />
                      <span className="text-sm font-medium text-copper-500">Applicant's Answer</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">{request.answer}</p>
                  </div>
                </div>

                {user.role === 'owner' && request.status === 'pending' && (
                  <div className="flex items-center gap-2">
                    <motion.button
                      onClick={() => handleApprove(request)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white font-medium rounded-xl cursor-hover"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <CheckCircle className="w-4 h-4" /> Approve
                    </motion.button>
                    <motion.button
                      onClick={() => handleReject(request)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white font-medium rounded-xl cursor-hover"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
