import { useState } from 'react';
import { User } from '../../App';
import { 
  LayoutDashboard, 
  FileText, 
  Briefcase,
  User as UserIcon,
  Bot,
  LogOut,
  Bell,
  GraduationCap
} from 'lucide-react';
import { StudentOverview } from './student/StudentOverview';
import { StudentProfile } from './student/StudentProfile';
import { EligibleDrives } from './student/EligibleDrives';
import { ApplicationTracker } from './student/ApplicationTracker';
import { PlacementBot } from './student/PlacementBot';

interface StudentDashboardProps {
  user: User;
  onLogout: () => void;
}

type TabType = 'overview' | 'profile' | 'drives' | 'applications' | 'bot';

export function StudentDashboard({ user, onLogout }: StudentDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: LayoutDashboard },
    { id: 'profile' as TabType, label: 'My Profile', icon: UserIcon },
    { id: 'drives' as TabType, label: 'Eligible Drives', icon: Briefcase },
    { id: 'applications' as TabType, label: 'My Applications', icon: FileText },
    { id: 'bot' as TabType, label: 'PlacementBot', icon: Bot }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-green-600 p-2 rounded-lg">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl text-green-600">PlacementPro</h1>
                <p className="text-xs text-gray-600">Student Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="text-right">
                <div className="text-sm text-gray-800">{user.name}</div>
                <div className="text-xs text-gray-500">{user.rollNumber}</div>
              </div>
              <button
                onClick={onLogout}
                className="p-2 hover:bg-red-50 rounded-lg text-red-600"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 mb-6">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'bg-green-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="space-y-6">
          {activeTab === 'overview' && <StudentOverview user={user} />}
          {activeTab === 'profile' && <StudentProfile user={user} />}
          {activeTab === 'drives' && <EligibleDrives user={user} />}
          {activeTab === 'applications' && <ApplicationTracker user={user} />}
          {activeTab === 'bot' && <PlacementBot user={user} />}
        </div>
      </div>
    </div>
  );
}
