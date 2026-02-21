import { useState, useEffect } from 'react';
import { User } from '../../../App';
import { getDrives, getApplications, saveApplications } from '../../../utils/dataInitializer';
import { Briefcase, Calendar, IndianRupee, MapPin, CheckCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface EligibleDrivesProps {
  user: User;
}

export function EligibleDrives({ user }: EligibleDrivesProps) {
  const [drives, setDrives] = useState<any[]>([]);
  const [appliedDrives, setAppliedDrives] = useState<string[]>([]);
  const [filter, setFilter] = useState<'all' | 'applied' | 'not-applied'>('all');

  useEffect(() => {
    loadDrives();
    loadAppliedDrives();
  }, [user]);

  const loadDrives = () => {
    const allDrives = getDrives();
    const eligible = allDrives.filter((drive: any) => {
      const cgpaCheck = user.cgpa ? user.cgpa >= drive.minCGPA : false;
      const backlogCheck = user.backlogs !== undefined ? user.backlogs <= drive.maxBacklogs : false;
      const branchCheck = user.branch && drive.eligibleBranches.includes(user.branch);
      return cgpaCheck && backlogCheck && branchCheck && drive.status === 'active';
    });
    setDrives(eligible);
  };

  const loadAppliedDrives = () => {
    const applications = getApplications();
    const myApplications = applications
      .filter((app: any) => app.studentId === user.id)
      .map((app: any) => app.driveId);
    setAppliedDrives(myApplications);
  };

  const handleApply = (driveId: string) => {
    const applications = getApplications();
    
    // Check if already applied
    const alreadyApplied = applications.some(
      (app: any) => app.studentId === user.id && app.driveId === driveId
    );

    if (alreadyApplied) {
      toast.error('You have already applied to this drive');
      return;
    }

    const newApplication = {
      id: `app${Date.now()}`,
      studentId: user.id,
      driveId,
      status: 'applied',
      appliedAt: new Date().toISOString(),
      interviewSlot: null
    };

    applications.push(newApplication);
    saveApplications(applications);
    
    toast.success('Application submitted successfully!');
    loadAppliedDrives();
  };

  const filteredDrives = drives.filter(drive => {
    if (filter === 'all') return true;
    if (filter === 'applied') return appliedDrives.includes(drive.id);
    if (filter === 'not-applied') return !appliedDrives.includes(drive.id);
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl text-gray-800">Eligible Placement Drives</h2>
            <p className="text-sm text-gray-600 mt-1">
              {drives.length} drives available based on your profile
            </p>
          </div>
          <div className="flex gap-2">
            {(['all', 'not-applied', 'applied'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg capitalize text-sm transition-colors ${
                  filter === f
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {f.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Drives List */}
      <div className="grid gap-4">
        {filteredDrives.map((drive) => {
          const hasApplied = appliedDrives.includes(drive.id);
          const deadline = new Date(drive.applicationDeadline);
          const isExpiringSoon = deadline.getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000;

          return (
            <div key={drive.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl text-gray-800">{drive.companyName}</h3>
                      {hasApplied && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Applied
                        </span>
                      )}
                      {isExpiringSoon && !hasApplied && (
                        <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
                          Deadline Soon
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-1">{drive.position}</p>
                    <p className="text-xl text-green-600">{drive.package}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <div>
                      <span className="text-xs text-gray-500">Drive Date:</span>
                      <p className="text-sm text-gray-800">{new Date(drive.driveDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <div>
                      <span className="text-xs text-gray-500">Deadline:</span>
                      <p className="text-sm text-gray-800">{deadline.toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {drive.description && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-700">{drive.description}</p>
                  </div>
                )}

                {/* Eligibility Criteria */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-xs text-gray-600 mb-2">Eligibility Criteria:</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                      CGPA ≥ {drive.minCGPA}
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                      Backlogs ≤ {drive.maxBacklogs}
                    </span>
                    {drive.eligibleBranches.map((branch: string) => (
                      <span key={branch} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                        {branch}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Requirements */}
                {drive.requirements && drive.requirements.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Requirements:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {drive.requirements.map((req: string, idx: number) => (
                        <li key={idx} className="text-sm text-gray-700">{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Apply Button */}
                <div className="flex items-center gap-3 pt-4 border-t">
                  {hasApplied ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span>Application Submitted</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleApply(drive.id)}
                      className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Briefcase className="w-4 h-4" />
                      Apply Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredDrives.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-gray-800 mb-2">No drives found</h3>
            <p className="text-gray-600 text-sm">
              {filter === 'all' 
                ? 'There are no eligible drives available at the moment'
                : filter === 'applied'
                ? "You haven't applied to any drives yet"
                : 'All eligible drives have been applied to'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
