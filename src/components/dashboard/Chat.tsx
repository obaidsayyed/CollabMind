import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store';
import { 
  MessageSquare, Send, Paperclip, X, File, Image, FileText,
  Download, User, Search, Plus
} from 'lucide-react';

interface Message {
  id: string;
  projectId: string;
  senderId: string;
  senderName: string;
  content: string;
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
  timestamp: string;
}

export default function Chat() {
  const { user, ideas, chats, addMessage } = useStore();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  // Get projects the user is involved in
  const userProjects = ideas.filter(i => 
    i.userId === user.id || i.collaborators.includes(user.id)
  );

  const selectedIdea = ideas.find(i => i.id === selectedProject);
  const projectChats = chats.filter(c => c.projectId === selectedProject);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [projectChats]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedProject) return;

    addMessage({
      projectId: selectedProject,
      senderId: user.id,
      senderName: user.displayName,
      content: messageInput,
    });

    setMessageInput('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedProject) return;

    // Simulate file upload
    const mockFileUrl = URL.createObjectURL(file);
    
    addMessage({
      projectId: selectedProject,
      senderId: user.id,
      senderName: user.displayName,
      content: `Shared a file: ${file.name}`,
      fileUrl: mockFileUrl,
      fileName: file.name,
      fileType: file.type,
    });
  };

  const getFileIcon = (type?: string) => {
    if (!type) return <File className="w-5 h-5" />;
    if (type.startsWith('image/')) return <Image className="w-5 h-5" />;
    if (type.includes('pdf')) return <FileText className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  const filteredProjects = userProjects.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header - Desktop Only */}
<div className="hidden lg:block mb-6">
  <h1 className="text-2xl font-bold text-titanium-900 dark:text-white">
    Messages
  </h1>
  <p className="text-gray-500 dark:text-gray-400">
    Chat with collaborators on your projects
  </p>
</div>

      <div className="relative flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-160px)]">
        {/* Projects List */}
        <div
  className={`
    ${selectedProject ? 'hidden lg:flex' : 'flex'}
    lg:w-1/3 w-full
    glass rounded-2xl p-4 flex-col lg:rounded-2xl rounded-none p-4 flex-col
  `}
>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl glass bg-transparent border border-titanium-200 dark:border-titanium-700 focus:border-copper-500 outline-none text-sm"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2">
            {filteredProjects.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No projects yet</p>
              </div>
            ) : (
              filteredProjects.map((project) => {
                const isActive = selectedProject === project.id;
                const lastMessage = chats.filter(c => c.projectId === project.id).slice(-1)[0];
                const unreadCount = chats.filter(
  c => c.projectId === project.id && c.senderId !== user.id
).length;
                
                return (
                  <button
                    key={project.id}
                    onClick={() => setSelectedProject(project.id)}
                    className={`w-full p-3 rounded-xl text-left transition-all cursor-hover ${
                      isActive 
                        ? 'bg-copper-500/20 border border-copper-500/30' 
                        : 'hover:bg-titanium-100 dark:hover:bg-titanium-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-copper-400 to-copper-600 flex items-center justify-center text-white font-bold text-sm">
                        {project.title.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-titanium-900 dark:text-white truncate">
                          {project.title}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {lastMessage ? lastMessage.content.slice(0, 30) + '...' : 'No messages yet'}
                        </div>
                      </div>
                      {unreadCount > 0 && (
                        <span className="w-5 h-5 rounded-full bg-copper-500 text-white text-xs flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div
  className={`
    ${selectedProject ? 'flex' : 'hidden lg:flex'}
    lg:w-2/3 w-full
    relative glass rounded-2xl flex flex-col overflow-hidden
  `}
>
          {/* Watermark */}
<div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
  <span className="text-7xl font-bold text-purple-500/5 tracking-widest">
    COLLAB MIND
  </span>
</div>
          {selectedProject ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-titanium-200 dark:border-titanium-700">
                <div className="flex items-center justify-between">
  <div className="flex items-center gap-3">
    <button
      onClick={() => setSelectedProject(null)}
      className="lg:hidden mr-2 p-1 rounded-lg hover:bg-titanium-800"
    >
      ←
    </button>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-copper-400 to-copper-600 flex items-center justify-center text-white font-bold">
                      {selectedIdea?.title.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-titanium-900 dark:text-white">
                        {selectedIdea?.title}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {selectedIdea?.status === 'in_review' ? 'In Progress' : 'Active'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {projectChats.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No messages yet</p>
                    <p className="text-sm text-gray-400">Start the conversation!</p>
                  </div>
                ) : (
                  projectChats.map((message) => {
                    const isOwn = message.senderId === user.id;
                    return (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[85%] sm:max-w-[70%] ${isOwn ? 'order-2' : ''}`}>
                          {!isOwn && (
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-copper-400 to-copper-600 flex items-center justify-center text-white text-xs font-bold border border-copper-400/40">
                                {message.senderName.charAt(0)}
                              </div>
                              <span className="text-sm font-medium text-titanium-900 dark:text-white">
                                {message.senderName}
                              </span>
                            </div>
                          )}
                          <div className={`p-3 lg:rounded-2xl rounded-none border ${
  isOwn 
    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-400/40 rounded-br-md'
    : 'bg-purple-500/10 text-white border-purple-500/20 rounded-bl-md'
}`}>
                            <p>{message.content}</p>
                            {message.fileUrl && (
                              <div className="mt-2 p-2 rounded-lg bg-white/10 flex items-center gap-2">
                                {getFileIcon(message.fileType)}
                                <span className="text-sm truncate">{message.fileName}</span>
                                <a 
                                  href={message.fileUrl} 
                                  download={message.fileName}
                                  className="ml-auto hover:bg-white/20 p-1 rounded"
                                >
                                  <Download className="w-4 h-4" />
                                </a>
                              </div>
                            )}
                          </div>
                          <p className={`text-xs text-gray-400 mt-1 ${isOwn ? 'text-right' : ''}`}>
                            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-titanium-200 dark:border-titanium-700">
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx,.zip,.rar"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 rounded-xl glass hover:bg-copper-500/20 cursor-hover"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 rounded-xl glass bg-transparent border border-titanium-200 dark:border-titanium-700 focus:border-copper-500 outline-none"
                  />
                  <motion.button
                    type="submit"
                    disabled={!messageInput.trim()}
                    className="p-3 bg-gradient-to-r from-copper-500 to-copper-600 text-white rounded-xl cursor-hover disabled:opacity-50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-titanium-900 dark:text-white mb-2">
                  Select a Project
                </h3>
                <p className="text-gray-500">Choose a project to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
