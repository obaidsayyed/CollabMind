import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  displayName: string;
  bio: string;
  skills: string[];
  avatar?: string;
  role: 'owner' | 'builder';
  isVerified: boolean;
  membership: 'free' | 'premium';
  joinDate: string;
  problemsPosted: number;
  activeProjects: number;
  completedProjects: number;
  trustScore: number;
}

interface Idea {
  id: string;
  userId: string;
  userName: string;
  title: string;
  description: string;
  expectations: string;
  status: 'open' | 'in_review' | 'completed';
  progress?: number;
  projectStatus?: string;
  dueDate?: string;
  createdAt: string;
  collaborators: string[];
  isPublished: boolean;
}

interface ChatMessage {
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

interface CollaborationRequest {
  id: string;
  ideaId: string;
  ideaTitle: string;
  requesterId: string;
  requesterName: string;
  ownerId: string; 
  answer: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

interface Feedback {
  id: string;
  userName: string;
  email: string;
  category: string;
  message: string;
  contactPermission: boolean;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: string;
  formattedDate: string;
}

interface Certificate {
  id: string;
  userId: string;
  projectId: string;
  projectTitle: string;
  earnedAt: string;
  type: 'completion' | 'excellence' | 'innovation';
}

interface AppState {
  darkMode: boolean;
  toggleTheme: () => void;
  
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => void;
  register: (email: string, password: string, displayName: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  updateUser: (updates: Partial<User>) => void;
  deleteAccount: () => void;
  
  ideas: Idea[];
  addIdea: (idea: Omit<Idea, 'id' | 'createdAt' | 'collaborators'>) => void;
  updateIdea: (id: string, updates: Partial<Idea>) => void;
  deleteIdea: (id: string) => void;
  
  requests: CollaborationRequest[];
  addRequest: (request: Omit<CollaborationRequest, 'id' | 'createdAt' | 'status'>) => void;
  updateRequest: (id: string, updates: Partial<CollaborationRequest>) => void;
  
  chats: ChatMessage[];
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  
  feedbackList: Feedback[];
  addFeedback: (feedback: Omit<Feedback, 'id' | 'timestamp' | 'status' | 'formattedDate'>) => void;
  
  certificates: Certificate[];

  addCertificate: (certificate: Omit<Certificate, 'id'>) => void;
  
  activeSection: string;
  setActiveSection: (section: string) => void;
  showProfileModal: boolean;
  setShowProfileModal: (show: boolean) => void;
  profileToView: User | null;
  setProfileToView: (user: User | null) => void;
  
  notifications: { id: string; message: string; type: 'success' | 'error' | 'info' }[];
  addNotification: (message: string, type: 'success' | 'error' | 'info') => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const mockUsers: User[] = [
  {
    id: 'user1',
    email: 'demo@collabmind.com',
    displayName: 'Alex Chen',
    bio: 'Passionate about solving real-world problems through technology. Building the future, one project at a time.',
    skills: ['React', 'Node.js', 'UI/UX', 'Python'],
    role: 'owner',
    isVerified: true,
    membership: 'premium',
    joinDate: '2024-01-15',
    problemsPosted: 12,
    activeProjects: 3,
    completedProjects: 8,
    trustScore: 94
  },
  {
    id: 'user2',
    email: 'sarah@example.com',
    displayName: 'Sarah Johnson',
    bio: 'Full-stack developer and problem solver. Love building products that make a difference.',
    skills: ['React', 'TypeScript', 'AWS', 'PostgreSQL'],
    role: 'builder',
    isVerified: true,
    membership: 'free',
    joinDate: '2024-02-20',
    problemsPosted: 2,
    activeProjects: 2,
    completedProjects: 5,
    trustScore: 87
  }
];

const mockIdeas: Idea[] = [
  {
    id: 'idea1',
    userId: 'user1',
    userName: 'Alex Chen',
    title: 'AI-Powered Study Companion',
    description: 'A smart study assistant that helps students organize their learning materials, track progress, and get personalized recommendations.',
    expectations: 'Looking for developers skilled in React, Python, and machine learning integration.',
    status: 'open',
    dueDate: '2024-06-01',
    createdAt: '2024-01-20',
    collaborators: [],
    isPublished: true
  },
  {
    id: 'idea2',
    userId: 'user1',
    userName: 'Alex Chen',
    title: 'Sustainable Living Tracker',
    description: 'Mobile app to track carbon footprint and suggest eco-friendly alternatives in daily life.',
    expectations: 'Need mobile developers with experience in React Native and sustainability APIs.',
    status: 'in_review',
    createdAt: '2024-02-10',
    collaborators: ['user2'],
    isPublished: true
  },
  {
    id: 'idea3',
    userId: 'user2',
    userName: 'Sarah Johnson',
    title: 'Community Skill Exchange',
    description: 'Platform connecting people to share and learn skills from each other through collaborative projects.',
    expectations: 'Looking for designers and frontend developers to create an engaging user experience.',
    status: 'open',
    createdAt: '2024-02-15',
    collaborators: [],
    isPublished: true
  }
];

const mockRequests: CollaborationRequest[] = [
  {
    id: 'req1',
    ideaId: 'idea1',
    ideaTitle: 'AI-Powered Study Companion',
    requesterId: 'user2',
    requesterName: 'Sarah Johnson',
    ownerId: 'user1',
    answer: 'I have 3 years of experience with React and Python. I have built similar educational platforms before.',
    status: 'pending',
    createdAt: '2024-02-18'
  }
];

const mockChats: ChatMessage[] = [
  {
    id: 'chat1',
    projectId: 'idea2',
    senderId: 'user1',
    senderName: 'Alex Chen',
    content: 'Hi Sarah! Thanks for joining the project. Let me share the initial specs.',
    timestamp: '2024-02-10T10:00:00'
  },
  {
    id: 'chat2',
    projectId: 'idea2',
    senderId: 'user2',
    senderName: 'Sarah Johnson',
    content: 'Thanks for having me! I have reviewed the requirements. Should we start with the data models?',
    timestamp: '2024-02-10T10:15:00'
  }
];

const mockFeedback: Feedback[] = [
  {
    id: 'fb1',
    userName: 'Michael Brown',
    email: 'michael@example.com',
    category: 'testimonial',
    message: 'Collab Mind changed how I approach problem-solving. Found amazing collaborators for my startup idea!',
    contactPermission: true,
    status: 'approved',
    timestamp: '2024-01-15',
    formattedDate: 'January 15, 2024'
  },
  {
    id: 'fb2',
    userName: 'Emily Davis',
    email: 'emily@example.com',
    category: 'testimonial',
    message: 'As a student builder, this platform gave me real-world project experience. Highly recommended!',
    contactPermission: true,
    status: 'approved',
    timestamp: '2024-02-01',
    formattedDate: 'February 1, 2024'
  },
  {
    id: 'fb3',
    userName: 'James Wilson',
    email: 'james@example.com',
    category: 'testimonial',
    message: 'The matching system is impressive. Got connected with exactly the right team for my project.',
    contactPermission: false,
    status: 'approved',
    timestamp: '2024-02-10',
    formattedDate: 'February 10, 2024'
  }
];

const mockCertificates: Certificate[] = [
  {
    id: 'cert1',
    userId: 'user1',
    projectId: 'proj1',
    projectTitle: 'EcoTrack Dashboard',
    earnedAt: '2024-01-20',
    type: 'completion'
  },
  {
    id: 'cert2',
    userId: 'user1',
    projectId: 'proj2',
    projectTitle: 'HealthHub App',
    earnedAt: '2024-02-05',
    type: 'excellence'
  }
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      
      login: async (email: string, password: string) => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  // check mock users
  const mockUser = mockUsers.find(u => u.email === email);

  if (mockUser) {
    set({ user: mockUser, isAuthenticated: true });
    return true;
  }

  // check if user already exists in storage
  const storedUser = get().user;

  if (storedUser && storedUser.email === email) {
    set({ user: storedUser, isAuthenticated: true });
    return true;
  }

  return false;
},
      
      loginWithGoogle: async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        set({ user: mockUsers[0], isAuthenticated: true });
        return true;
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false, activeSection: 'overview' });
      },
      
      register: async (email: string, password: string, displayName: string, role: 'owner' | 'builder') => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const newUser: User = {
          id: generateId(),
          email,
          displayName,
          bio: '',
          skills: [],
          role,
          isVerified: false,
          membership: 'free',
          joinDate: new Date().toISOString().split('T')[0],
          problemsPosted: 0,
          activeProjects: 0,
          completedProjects: 0,
          trustScore: 50
        };
        set({ user: newUser, isAuthenticated: true });
        return true;
      },
      
      resetPassword: async (email: string) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return true;
      },
      
      updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null
      })),
      
      deleteAccount: () => {
        set({ user: null, isAuthenticated: false });
      },
      
      ideas: mockIdeas,
      addIdea: (idea) => set((state) => ({
        ideas: [...state.ideas, { ...idea, id: generateId(), createdAt: new Date().toISOString(), collaborators: [] }]
      })),
      updateIdea: (id, updates) => set((state) => ({
        ideas: state.ideas.map(idea => idea.id === id ? { ...idea, ...updates } : idea)
      })),
      deleteIdea: (id) => set((state) => ({
        ideas: state.ideas.filter(idea => idea.id !== id)
      })),
      
      requests: mockRequests,
      addRequest: (request) => set((state) => ({
        requests: [...state.requests, { ...request, id: generateId(), createdAt: new Date().toISOString(), status: 'pending' as const }]
      })),
      updateRequest: (id, updates) => set((state) => ({
        requests: state.requests.map(req => req.id === id ? { ...req, ...updates } : req)
      })),
      
      chats: mockChats,
      addMessage: (message) => set((state) => ({
        chats: [...state.chats, { ...message, id: generateId(), timestamp: new Date().toISOString() }]
      })),
      
      feedbackList: mockFeedback,
      addFeedback: (feedback) => set((state) => ({
        feedbackList: [...state.feedbackList, { 
          ...feedback, 
          id: generateId(), 
          timestamp: new Date().toISOString(),
          formattedDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          status: 'pending' as const
        }]
      })),
      
      certificates: mockCertificates,

      addCertificate: (certificate) =>
  set((state) => ({
    certificates: [
      ...state.certificates,
      { ...certificate, id: generateId() }
    ]
  })),
      
      activeSection: 'overview',
      setActiveSection: (section) => set({ activeSection: section }),
      showProfileModal: false,
      setShowProfileModal: (show) => set({ showProfileModal: show }),
      profileToView: null,
      setProfileToView: (user) => set({ profileToView: user, showProfileModal: !!user }),
      
      notifications: [],
      addNotification: (message, type) => {
        const id = generateId();
        set((state) => ({
          notifications: [...state.notifications, { id, message, type }]
        }));
        setTimeout(() => {
          set((state) => ({
            notifications: state.notifications.filter(n => n.id !== id)
          }));
        }, 5000);
      }
    }),
    {
      name: 'collab-mind-storage',
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        ideas: state.ideas,
        requests: state.requests,
        chats: state.chats,
        feedbackList: state.feedbackList,
        certificates: state.certificates
      })
    }
  )
);
