import { useState, useEffect } from 'react';
import { User } from '../../../App';
import { getDrives, getApplications } from '../../../utils/dataInitializer';
import { Briefcase, Target, Clock, TrendingUp } from 'lucide-react';

interface StudentOverviewProps {
  user: User;
}

export function StudentOverview({ user }: StudentOverviewProps) {
  const [eligibleDrives, setEligibleDrives] = useState<any[]>([]);
  const [myApplications, setMyApplications] = useState<any[]>([]);

  useEffect(() => {
    const allDrives = getDrives();
    const eligible = allDrives.filter((drive: any) => {
      const cgpaCheck = user.cgpa ? user.cgpa >= drive.minCGPA : false;
      const backlogCheck = user.backlogs !== undefined ? user.backlogs <= drive.maxBacklogs : false;
      const branchCheck = user.branch && drive.eligibleBranches.includes(user.branch);
      return cgpaCheck && backlogCheck && branchCheck && drive.status === 'active';
    });
    setEligibleDrives(eligible);

    const allApplications = getApplications();
    const myApps = allApplications.filter((app: any) => app.studentId === user.id);
    setMyApplications(myApps);
  }, [user]);

  const stats = [
    { 
      label: 'Eligible Drives', 
      value: eligibleDrives.length, 
      color: 'bg-blue-500',
      icon: Briefcase 
    },
    { 
      label: 'Applications', 
      value: myApplications.length, 
      color: 'bg-green-500',
      icon: Target 
    },
    { 
      label: 'Interviews Scheduled', 
      value: myApplications.filter((a: any) => a.status === 'interview_scheduled').length, 
      color: 'bg-purple-500',
      icon: Clock 
    },
    { 
      label: 'Your CGPA', 
      value: user.cgpa?.toFixed(2) || 'N/A', 
      color: 'bg-orange-500',
      icon: TrendingUp 
    }
  ];

  const recentDrives = eligibleDrives.slice(0, 3);
  const upcomingInterviews = myApplications
    .filter((app: any) => app.interviewSlot)
    .slice(0, 3);

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

      {/* Profile Completeness */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg text-gray-800 mb-4">Profile Completeness</h3>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-700">Your profile is {getProfileCompleteness(user)}% complete</span>
              <span className="text-blue-600">{getProfileCompleteness(user)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all"
                style={{ width: `${getProfileCompleteness(user)}%` }}
              />
            </div>
          </div>
          {getProfileCompleteness(user) < 100 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                Complete your profile to increase your chances of getting shortlisted!
              </p>
              <ul className="mt-2 text-sm text-blue-700 space-y-1">
                {!user.skills || user.skills.length === 0 ? <li>• Add your skills</li> : null}
                {!user.projects || user.projects.length === 0 ? <li>• Add your projects</li> : null}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Eligible Drives */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg text-gray-800 mb-4">Recent Eligible Drives</h3>
          <div className="space-y-3">
            {recentDrives.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No eligible drives available</p>
            ) : (
              recentDrives.map((drive: any) => (
                <div key={drive.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <h4 className="text-gray-800 mb-1">{drive.companyName}</h4>
                  <p className="text-sm text-gray-600 mb-2">{drive.position}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-green-600">{drive.package}</span>
                    <span className="text-xs text-gray-500">
                      Deadline: {new Date(drive.applicationDeadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Interviews */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg text-gray-800 mb-4">Upcoming Interviews</h3>
          <div className="space-y-3">
            {upcomingInterviews.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No interviews scheduled</p>
            ) : (
              upcomingInterviews.map((app: any) => {
                const drive = getDrives().find((d: any) => d.id === app.driveId);
                return (
                  <div key={app.id} className="border border-gray-200 rounded-lg p-4 bg-purple-50">
                    <h4 className="text-gray-800 mb-1">{drive?.companyName}</h4>
                    <p className="text-sm text-gray-600 mb-2">{drive?.position}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-purple-600" />
                      <span className="text-purple-700">
                        {new Date(app.interviewSlot).toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Application Status Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg text-gray-800 mb-4">Application Status Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { status: 'applied', label: 'Applied', color: 'bg-blue-100 text-blue-700' },
            { status: 'shortlisted', label: 'Shortlisted', color: 'bg-yellow-100 text-yellow-700' },
            { status: 'interview_scheduled', label: 'Interview', color: 'bg-purple-100 text-purple-700' },
            { status: 'selected', label: 'Selected', color: 'bg-green-100 text-green-700' },
            { status: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-700' }
          ].map((item) => {
            const count = myApplications.filter((a: any) => a.status === item.status).length;
            return (
              <div key={item.status} className={`${item.color} rounded-lg p-4 text-center`}>
                <p className="text-2xl mb-1">{count}</p>
                <p className="text-sm">{item.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function getProfileCompleteness(user: User): number {
  let score = 40; // Base score for having account
  
  if (user.skills && user.skills.length > 0) score += 30;
  if (user.projects && user.projects.length > 0) score += 30;
  
  return Math.min(score, 100);
}
