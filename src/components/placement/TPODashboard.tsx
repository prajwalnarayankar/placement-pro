import { useState } from 'react';
import { User } from '../../App';
import { 
  LayoutDashboard, 
  Plus, 
  Users, 
  Calendar,
  BarChart3,
  LogOut,
  Filter,
  Search,
  Bell,
  GraduationCap
} from 'lucide-react';
import { CriteriaEngine } from './tpo/CriteriaEngine';
import { DriveManagement } from './tpo/DriveManagement';
import { InterviewScheduler } from './tpo/InterviewScheduler';
import { TPOAnalytics } from './tpo/TPOAnalytics';

interface TPODashboardProps {
  user: User;
  onLogout: () => void;
}

type TabType = 'overview' | 'drives' | 'criteria' | 'scheduler' | 'analytics';

export function TPODashboard({ user, onLogout }: TPODashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: LayoutDashboard },
    { id: 'drives' as TabType, label: 'Manage Drives', icon: Plus },
    { id: 'criteria' as TabType, label: 'Criteria Engine', icon: Filter },
    { id: 'scheduler' as TabType, label: 'Interview Scheduler', icon: Calendar },
    { id: 'analytics' as TabType, label: 'Analytics', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl text-blue-600">PlacementPro</h1>
                <p className="text-xs text-gray-600">TPO Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="text-right">
                <div className="text-sm text-gray-800">{user.name}</div>
                <div className="text-xs text-gray-500">Training & Placement Officer</div>
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
                      ? 'bg-blue-600 text-white'
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
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'drives' && <DriveManagement />}
          {activeTab === 'criteria' && <CriteriaEngine />}
          {activeTab === 'scheduler' && <InterviewScheduler />}
          {activeTab === 'analytics' && <TPOAnalytics />}
        </div>
      </div>
    </div>
  );
}

function OverviewTab() {
  const drives = JSON.parse(localStorage.getItem('drives') || '[]');
  const applications = JSON.parse(localStorage.getItem('applications') || '[]');
  const students = JSON.parse(localStorage.getItem('users') || '[]').filter(
    (u: User) => u.role === 'student'
  );

  const activeDrives = drives.filter((d: any) => d.status === 'active').length;
  const totalApplications = applications.length;
  const placedStudents = applications.filter((a: any) => a.status === 'selected').length;

  const stats = [
    { label: 'Active Drives', value: activeDrives, color: 'bg-blue-500', icon: Plus },
    { label: 'Total Students', value: students.length, color: 'bg-green-500', icon: Users },
    { label: 'Applications', value: totalApplications, color: 'bg-purple-500', icon: BarChart3 },
    { label: 'Placed Students', value: placedStudents, color: 'bg-orange-500', icon: GraduationCap }
  ];

  const recentDrives = drives.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-3xl text-gray-800 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Drives */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg text-gray-800 mb-4">Recent Placement Drives</h2>
        <div className="space-y-3">
          {recentDrives.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No drives created yet</p>
          ) : (
            recentDrives.map((drive: any) => (
              <div key={drive.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-gray-800 mb-1">{drive.companyName}</h3>
                    <p className="text-sm text-gray-600 mb-2">{drive.position} • {drive.package}</p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                        CGPA ≥ {drive.minCGPA}
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                        Backlogs ≤ {drive.maxBacklogs}
                      </span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">
                        {drive.eligibleBranches.join(', ')}
                      </span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    drive.status === 'active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {drive.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <button className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors text-left">
          <Plus className="w-6 h-6 mb-2" />
          <div className="text-sm">Create New Drive</div>
        </button>
        <button className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors text-left">
          <Calendar className="w-6 h-6 mb-2" />
          <div className="text-sm">Schedule Interviews</div>
        </button>
        <button className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition-colors text-left">
          <BarChart3 className="w-6 h-6 mb-2" />
          <div className="text-sm">View Analytics</div>
        </button>
      </div>
    </div>
  );
}
