import { useState, useEffect } from 'react';
import { User } from '../../../App';
import { getUsers, getDrives, saveDrives } from '../../../utils/dataInitializer';
import { Plus, X, Save, Users, Filter, Send } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function CriteriaEngine() {
  const [drives, setDrives] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDrive, setSelectedDrive] = useState<any>(null);
  const [eligibleStudents, setEligibleStudents] = useState<User[]>([]);

  // Form fields
  const [companyName, setCompanyName] = useState('');
  const [position, setPosition] = useState('');
  const [packageAmount, setPackageAmount] = useState('');
  const [minCGPA, setMinCGPA] = useState('');
  const [maxBacklogs, setMaxBacklogs] = useState('');
  const [eligibleBranches, setEligibleBranches] = useState<string[]>([]);
  const [driveDate, setDriveDate] = useState('');
  const [deadline, setDeadline] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');

  useEffect(() => {
    loadDrives();
  }, []);

  const loadDrives = () => {
    const allDrives = getDrives();
    setDrives(allDrives);
  };

  const handleBranchToggle = (branch: string) => {
    setEligibleBranches(prev => 
      prev.includes(branch) 
        ? prev.filter(b => b !== branch)
        : [...prev, branch]
    );
  };

  const calculateEligibleStudents = () => {
    const students = getUsers().filter((u: User) => u.role === 'student');
    
    const eligible = students.filter((student: User) => {
      const cgpaCheck = student.cgpa ? student.cgpa >= parseFloat(minCGPA || '0') : false;
      const backlogCheck = student.backlogs !== undefined ? student.backlogs <= parseInt(maxBacklogs || '999') : false;
      const branchCheck = eligibleBranches.length === 0 || (student.branch && eligibleBranches.includes(student.branch));
      
      return cgpaCheck && backlogCheck && branchCheck;
    });

    setEligibleStudents(eligible);
  };

  useEffect(() => {
    if (minCGPA || maxBacklogs || eligibleBranches.length > 0) {
      calculateEligibleStudents();
    }
  }, [minCGPA, maxBacklogs, eligibleBranches]);

  const handleCreateDrive = () => {
    if (!companyName || !position || !packageAmount || !minCGPA || !maxBacklogs || eligibleBranches.length === 0) {
      toast.error('Please fill all required fields');
      return;
    }

    const newDrive = {
      id: `drive${Date.now()}`,
      companyName,
      position,
      package: packageAmount,
      minCGPA: parseFloat(minCGPA),
      maxBacklogs: parseInt(maxBacklogs),
      eligibleBranches,
      driveDate,
      applicationDeadline: deadline,
      description,
      requirements: requirements.split('\n').filter(r => r.trim()),
      status: 'active',
      createdBy: 'tpo1',
      createdAt: new Date().toISOString(),
      interviewSlots: []
    };

    const allDrives = getDrives();
    allDrives.push(newDrive);
    saveDrives(allDrives);
    
    toast.success(`Drive created! ${eligibleStudents.length} students are eligible`);
    resetForm();
    setShowCreateModal(false);
    loadDrives();
  };

  const resetForm = () => {
    setCompanyName('');
    setPosition('');
    setPackageAmount('');
    setMinCGPA('');
    setMaxBacklogs('');
    setEligibleBranches([]);
    setDriveDate('');
    setDeadline('');
    setDescription('');
    setRequirements('');
    setEligibleStudents([]);
  };

  const handleNotifyStudents = (drive: any) => {
    const students = getUsers().filter((u: User) => u.role === 'student');
    const eligible = students.filter((student: User) => {
      const cgpaCheck = student.cgpa ? student.cgpa >= drive.minCGPA : false;
      const backlogCheck = student.backlogs !== undefined ? student.backlogs <= drive.maxBacklogs : false;
      const branchCheck = student.branch && drive.eligibleBranches.includes(student.branch);
      return cgpaCheck && backlogCheck && branchCheck;
    });

    toast.success(`Notification sent to ${eligible.length} eligible students for ${drive.companyName}`);
  };

  const branches = ['CS', 'MCA', 'IT', 'ECE', 'EEE', 'MECH'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl text-gray-800">Criteria Engine</h2>
            <p className="text-sm text-gray-600 mt-1">Create drives and automatically filter eligible students</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Create New Drive
          </button>
        </div>
      </div>

      {/* Drives List */}
      <div className="space-y-4">
        {drives.map((drive) => {
          const students = getUsers().filter((u: User) => u.role === 'student');
          const eligible = students.filter((student: User) => {
            const cgpaCheck = student.cgpa ? student.cgpa >= drive.minCGPA : false;
            const backlogCheck = student.backlogs !== undefined ? student.backlogs <= drive.maxBacklogs : false;
            const branchCheck = student.branch && drive.eligibleBranches.includes(student.branch);
            return cgpaCheck && backlogCheck && branchCheck;
          });

          return (
            <div key={drive.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg text-gray-800">{drive.companyName}</h3>
                  <p className="text-gray-600">{drive.position}</p>
                  <p className="text-green-600 mt-1">{drive.package}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  drive.status === 'active' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {drive.status}
                </span>
              </div>

              {/* Criteria Display */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Filter className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">Eligibility Criteria:</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <span className="text-xs text-gray-500">Minimum CGPA</span>
                    <p className="text-gray-800">{drive.minCGPA}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Max Backlogs</span>
                    <p className="text-gray-800">{drive.maxBacklogs}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Branches</span>
                    <p className="text-gray-800">{drive.eligibleBranches.join(', ')}</p>
                  </div>
                </div>
              </div>

              {/* Eligible Students Count */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 px-4 py-2 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="text-blue-900">
                        <span className="text-2xl">{eligible.length}</span>
                        <span className="text-sm ml-1">Students Eligible</span>
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    Drive Date: {new Date(drive.driveDate).toLocaleDateString()}
                  </div>
                </div>
                <button
                  onClick={() => handleNotifyStudents(drive)}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  <Send className="w-4 h-4" />
                  Notify All Eligible
                </button>
              </div>
            </div>
          );
        })}

        {drives.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-gray-800 mb-2">No drives created yet</h3>
            <p className="text-gray-600 text-sm mb-4">Create your first placement drive using the Criteria Engine</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Create Drive
            </button>
          </div>
        )}
      </div>

      {/* Create Drive Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl text-gray-800">Create New Placement Drive</h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Company Details */}
              <div className="space-y-4">
                <h4 className="text-gray-800">Company Details</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Company Name *</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., TCS Digital"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Position *</label>
                    <input
                      type="text"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., System Engineer"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Package *</label>
                  <input
                    type="text"
                    value={packageAmount}
                    onChange={(e) => setPackageAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 7.5 LPA"
                  />
                </div>
              </div>

              {/* Eligibility Criteria */}
              <div className="space-y-4 border-t pt-4">
                <h4 className="text-gray-800">Eligibility Criteria</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Minimum CGPA *</label>
                    <input
                      type="number"
                      step="0.1"
                      value={minCGPA}
                      onChange={(e) => setMinCGPA(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 7.0"
                      min="0"
                      max="10"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Maximum Backlogs *</label>
                    <input
                      type="number"
                      value={maxBacklogs}
                      onChange={(e) => setMaxBacklogs(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 0"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">Eligible Branches *</label>
                  <div className="flex flex-wrap gap-2">
                    {branches.map((branch) => (
                      <button
                        key={branch}
                        type="button"
                        onClick={() => handleBranchToggle(branch)}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                          eligibleBranches.includes(branch)
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                        }`}
                      >
                        {branch}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="space-y-4 border-t pt-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Drive Date</label>
                    <input
                      type="date"
                      value={driveDate}
                      onChange={(e) => setDriveDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Application Deadline</label>
                    <input
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div className="space-y-4 border-t pt-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Brief description about the role..."
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Requirements (one per line)</label>
                  <textarea
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    placeholder="Good programming skills&#10;Problem solving ability&#10;Communication skills"
                  />
                </div>
              </div>

              {/* Eligible Students Preview */}
              {eligibleStudents.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span className="text-blue-900">
                      <span className="text-2xl">{eligibleStudents.length}</span>
                      <span className="text-sm ml-2">students match this criteria</span>
                    </span>
                  </div>
                  <p className="text-sm text-blue-700">
                    These students will be notified once the drive is created
                  </p>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateDrive}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                <Save className="w-4 h-4" />
                Create Drive
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
