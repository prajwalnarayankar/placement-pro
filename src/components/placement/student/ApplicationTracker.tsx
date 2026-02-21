import { useState, useEffect } from 'react';
import { User } from '../../../App';
import { getDrives, getApplications } from '../../../utils/dataInitializer';
import { Clock, CheckCircle, XCircle, AlertCircle, Calendar } from 'lucide-react';

interface ApplicationTrackerProps {
  user: User;
}

export function ApplicationTracker({ user }: ApplicationTrackerProps) {
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    loadApplications();
  }, [user]);

  const loadApplications = () => {
    const allApplications = getApplications();
    const myApplications = allApplications
      .filter((app: any) => app.studentId === user.id)
      .map((app: any) => {
        const drive = getDrives().find((d: any) => d.id === app.driveId);
        return { ...app, drive };
      })
      .sort((a: any, b: any) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());
    
    setApplications(myApplications);
  };

  const getStatusInfo = (status: string) => {
    const statusMap: any = {
      applied: {
        label: 'Applied',
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        icon: Clock,
        description: 'Your application has been submitted'
      },
      shortlisted: {
        label: 'Shortlisted',
        color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        icon: AlertCircle,
        description: 'Congratulations! You have been shortlisted'
      },
      interview_scheduled: {
        label: 'Interview Scheduled',
        color: 'bg-purple-100 text-purple-700 border-purple-200',
        icon: Calendar,
        description: 'Your interview has been scheduled'
      },
      selected: {
        label: 'Selected',
        color: 'bg-green-100 text-green-700 border-green-200',
        icon: CheckCircle,
        description: 'Congratulations! You have been selected'
      },
      rejected: {
        label: 'Not Selected',
        color: 'bg-red-100 text-red-700 border-red-200',
        icon: XCircle,
        description: "Don't give up! More opportunities await"
      }
    };
    return statusMap[status] || statusMap.applied;
  };

  const statusSteps = ['applied', 'shortlisted', 'interview_scheduled', 'selected'];

  const getStepStatus = (currentStatus: string, step: string): 'completed' | 'current' | 'pending' => {
    const currentIndex = statusSteps.indexOf(currentStatus);
    const stepIndex = statusSteps.indexOf(step);
    
    if (currentStatus === 'rejected') {
      return stepIndex < statusSteps.indexOf('applied') ? 'completed' : 'pending';
    }
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl text-gray-800 mb-2">My Applications</h2>
        <p className="text-sm text-gray-600">Track the status of all your placement applications</p>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {applications.map((app: any) => {
          const statusInfo = getStatusInfo(app.status);
          const Icon = statusInfo.icon;

          return (
            <div key={app.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                {/* Company Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg text-gray-800 mb-1">{app.drive?.companyName || 'Unknown Company'}</h3>
                    <p className="text-gray-600 mb-2">{app.drive?.position}</p>
                    <p className="text-green-600">{app.drive?.package}</p>
                  </div>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${statusInfo.color}`}>
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{statusInfo.label}</span>
                  </div>
                </div>

                {/* Status Timeline */}
                {app.status !== 'rejected' && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between relative">
                      {statusSteps.map((step, index) => {
                        const stepStatus = getStepStatus(app.status, step);
                        const stepInfo = getStatusInfo(step);
                        
                        return (
                          <div key={step} className="flex-1 relative">
                            <div className="flex flex-col items-center">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 ${
                                stepStatus === 'completed' 
                                  ? 'bg-green-600 border-green-600' 
                                  : stepStatus === 'current'
                                  ? 'bg-blue-600 border-blue-600'
                                  : 'bg-white border-gray-300'
                              }`}>
                                {stepStatus === 'completed' ? (
                                  <CheckCircle className="w-5 h-5 text-white" />
                                ) : stepStatus === 'current' ? (
                                  <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                                ) : (
                                  <div className="w-3 h-3 bg-gray-300 rounded-full" />
                                )}
                              </div>
                              <span className={`text-xs mt-2 text-center ${
                                stepStatus === 'completed' || stepStatus === 'current'
                                  ? 'text-gray-800'
                                  : 'text-gray-500'
                              }`}>
                                {stepInfo.label}
                              </span>
                            </div>
                            {index < statusSteps.length - 1 && (
                              <div className={`absolute top-5 left-1/2 w-full h-0.5 ${
                                getStepStatus(app.status, statusSteps[index + 1]) === 'completed'
                                  ? 'bg-green-600'
                                  : 'bg-gray-300'
                              }`} style={{ transform: 'translateY(-50%)' }} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Interview Slot */}
                {app.interviewSlot && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-5 h-5 text-purple-600" />
                      <span className="text-purple-900">Interview Scheduled</span>
                    </div>
                    <p className="text-purple-800">
                      {new Date(app.interviewSlot).toLocaleString('en-IN', {
                        dateStyle: 'full',
                        timeStyle: 'short'
                      })}
                    </p>
                  </div>
                )}

                {/* Status Description */}
                <div className={`border rounded-lg p-3 ${statusInfo.color}`}>
                  <p className="text-sm">{statusInfo.description}</p>
                </div>

                {/* Application Date */}
                <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                  <span>Applied on {new Date(app.appliedAt).toLocaleDateString()}</span>
                  {app.drive?.driveDate && (
                    <span>Drive Date: {new Date(app.drive.driveDate).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {applications.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-gray-800 mb-2">No Applications Yet</h3>
            <p className="text-gray-600 text-sm mb-4">
              You haven't applied to any placement drives yet
            </p>
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
              Browse Eligible Drives
            </button>
          </div>
        )}
      </div>

      {/* Statistics */}
      {applications.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg text-gray-800 mb-4">Application Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-2xl text-blue-600 mb-1">{applications.length}</p>
              <p className="text-xs text-blue-700">Total</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 text-center">
              <p className="text-2xl text-yellow-600 mb-1">
                {applications.filter(a => a.status === 'shortlisted').length}
              </p>
              <p className="text-xs text-yellow-700">Shortlisted</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <p className="text-2xl text-purple-600 mb-1">
                {applications.filter(a => a.status === 'interview_scheduled').length}
              </p>
              <p className="text-xs text-purple-700">Interviews</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-2xl text-green-600 mb-1">
                {applications.filter(a => a.status === 'selected').length}
              </p>
              <p className="text-xs text-green-700">Selected</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl text-gray-600 mb-1">
                {applications.filter(a => a.status === 'applied').length}
              </p>
              <p className="text-xs text-gray-700">Pending</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
