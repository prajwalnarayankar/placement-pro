import { useState, useEffect } from 'react';
import { LoginPage } from './components/placement/LoginPage';
import { TPODashboard } from './components/placement/TPODashboard';
import { StudentDashboard } from './components/placement/StudentDashboard';
import { AlumniDashboard } from './components/placement/AlumniDashboard';
import { initializeData } from './utils/dataInitializer';

export type UserRole = 'tpo' | 'student' | 'alumni';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  password: string;
  // Student-specific fields
  rollNumber?: string;
  branch?: string;
  cgpa?: number;
  backlogs?: number;
  phone?: string;
  year?: number;
  skills?: string[];
  projects?: Array<{
    title: string;
    description: string;
    technologies: string[];
  }>;
  // Alumni-specific fields
  company?: string;
  position?: string;
  graduationYear?: number;
}

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize sample data on first load
    initializeData();

    // Check if user is logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading PlacementPro...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  switch (currentUser.role) {
    case 'tpo':
      return <TPODashboard user={currentUser} onLogout={handleLogout} />;
    case 'student':
      return <StudentDashboard user={currentUser} onLogout={handleLogout} />;
    case 'alumni':
      return <AlumniDashboard user={currentUser} onLogout={handleLogout} />;
    default:
      return <LoginPage onLogin={handleLogin} />;
  }
}

export default App;
