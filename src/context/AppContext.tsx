import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Types
interface AppState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  notifications: Notification[];
  filters: {
    search: string;
    location: string;
    jobType: string;
    experienceLevel: string;
  };
  savedOpportunities: number[];
  appliedOpportunities: number[];
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

type AppAction =
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SIDEBAR_OPEN'; payload: boolean }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'SET_FILTERS'; payload: Partial<AppState['filters']> }
  | { type: 'SAVE_OPPORTUNITY'; payload: number }
  | { type: 'UNSAVE_OPPORTUNITY'; payload: number }
  | { type: 'APPLY_OPPORTUNITY'; payload: number }
  | { type: 'CLEAR_NOTIFICATIONS' };

// Initial state
const initialState: AppState = {
  theme: 'light',
  sidebarOpen: false,
  notifications: [],
  filters: {
    search: '',
    location: '',
    jobType: '',
    experienceLevel: '',
  },
  savedOpportunities: [],
  appliedOpportunities: [],
};

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload,
      };

    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        sidebarOpen: !state.sidebarOpen,
      };

    case 'SET_SIDEBAR_OPEN':
      return {
        ...state,
        sidebarOpen: action.payload,
      };

    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };

    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
      };

    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };

    case 'SAVE_OPPORTUNITY':
      return {
        ...state,
        savedOpportunities: [...state.savedOpportunities, action.payload],
      };

    case 'UNSAVE_OPPORTUNITY':
      return {
        ...state,
        savedOpportunities: state.savedOpportunities.filter(id => id !== action.payload),
      };

    case 'APPLY_OPPORTUNITY':
      return {
        ...state,
        appliedOpportunities: [...state.appliedOpportunities, action.payload],
      };

    case 'CLEAR_NOTIFICATIONS':
      return {
        ...state,
        notifications: [],
      };

    default:
      return state;
  }
};

// Context
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  actions: {
    setTheme: (theme: 'light' | 'dark') => void;
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
    addNotification: (notification: Omit<Notification, 'id'>) => void;
    removeNotification: (id: string) => void;
    setFilters: (filters: Partial<AppState['filters']>) => void;
    saveOpportunity: (id: number) => void;
    unsaveOpportunity: (id: number) => void;
    applyOpportunity: (id: number) => void;
    clearNotifications: () => void;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Actions
  const actions = {
    setTheme: (theme: 'light' | 'dark') => {
      dispatch({ type: 'SET_THEME', payload: theme });
      sessionStorage.setItem('theme', theme);
    },

    toggleSidebar: () => {
      dispatch({ type: 'TOGGLE_SIDEBAR' });
    },

    setSidebarOpen: (open: boolean) => {
      dispatch({ type: 'SET_SIDEBAR_OPEN', payload: open });
    },

    addNotification: (notification: Omit<Notification, 'id'>) => {
      const id = Date.now().toString();
      const newNotification = { ...notification, id };
      dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });

      // Auto-remove notification after duration
      if (notification.duration !== 0) {
        setTimeout(() => {
          dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
        }, notification.duration || 5000);
      }
    },

    removeNotification: (id: string) => {
      dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
    },

    setFilters: (filters: Partial<AppState['filters']>) => {
      dispatch({ type: 'SET_FILTERS', payload: filters });
    },

    saveOpportunity: (id: number) => {
      dispatch({ type: 'SAVE_OPPORTUNITY', payload: id });
    },

    unsaveOpportunity: (id: number) => {
      dispatch({ type: 'UNSAVE_OPPORTUNITY', payload: id });
    },

    applyOpportunity: (id: number) => {
      dispatch({ type: 'APPLY_OPPORTUNITY', payload: id });
    },

    clearNotifications: () => {
      dispatch({ type: 'CLEAR_NOTIFICATIONS' });
    },
  };

  // Load theme from localStorage on mount
  React.useEffect(() => {
    const savedTheme = sessionStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme && savedTheme !== state.theme) {
      actions.setTheme(savedTheme);
    }
  }, []);

  const value = {
    state,
    dispatch,
    actions,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Hook to use the app context
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Hook for notifications
export const useNotifications = () => {
  const { state, actions } = useApp();

  return {
    notifications: state.notifications,
    addNotification: actions.addNotification,
    removeNotification: actions.removeNotification,
    clearNotifications: actions.clearNotifications,
  };
};

// Hook for filters
export const useFilters = () => {
  const { state, actions } = useApp();

  return {
    filters: state.filters,
    setFilters: actions.setFilters,
  };
};

// Hook for opportunities
export const useOpportunities = () => {
  const { state, actions } = useApp();

  return {
    savedOpportunities: state.savedOpportunities,
    appliedOpportunities: state.appliedOpportunities,
    saveOpportunity: actions.saveOpportunity,
    unsaveOpportunity: actions.unsaveOpportunity,
    applyOpportunity: actions.applyOpportunity,
    isSaved: (id: number) => state.savedOpportunities.includes(id),
    isApplied: (id: number) => state.appliedOpportunities.includes(id),
  };
};
