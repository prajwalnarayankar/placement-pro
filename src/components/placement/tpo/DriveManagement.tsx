import { useState, useEffect } from 'react';
import { getDrives, saveDrives } from '../../../utils/dataInitializer';
import { Edit, Trash2, Eye, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function DriveManagement() {
  const [drives, setDrives] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    loadDrives();
  }, []);

  const loadDrives = () => {
    const allDrives = getDrives();
    setDrives(allDrives);
  };

  const filteredDrives = drives.filter(drive => {
    if (filter === 'all') return true;
    return drive.status === filter;
  });

  const handleStatusChange = (driveId: string, newStatus: string) => {
    const allDrives = getDrives();
    const updatedDrives = allDrives.map((d: any) => 
      d.id === driveId ? { ...d, status: newStatus } : d
    );
    saveDrives(updatedDrives);
    loadDrives();
    toast.success(`Drive status updated to ${newStatus}`);
  };

  const handleDelete = (driveId: string) => {
    if (!confirm('Are you sure you want to delete this drive?')) return;
    
    const allDrives = getDrives();
    const updatedDrives = allDrives.filter((d: any) => d.id !== driveId);
    saveDrives(updatedDrives);
    loadDrives();
    toast.success('Drive deleted successfully');
  };

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl text-gray-800">Manage Placement Drives</h2>
          <div className="flex gap-2">
            {(['all', 'active', 'completed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                  filter === f
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Drives List */}
      <div className="space-y-4">
        {filteredDrives.map((drive) => (
          <div key={drive.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg text-gray-800 mb-1">{drive.companyName}</h3>
                  <p className="text-gray-600">{drive.position}</p>
                  <p className="text-green-600 mt-1">{drive.package}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    drive.status === 'active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {drive.status}
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-sm text-gray-600">Drive Date:</span>
                  <p className="text-gray-800">{new Date(drive.driveDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Application Deadline:</span>
                  <p className="text-gray-800">{new Date(drive.applicationDeadline).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="mb-4">
                <span className="text-sm text-gray-600">Description:</span>
                <p className="text-gray-800 text-sm mt-1">{drive.description}</p>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  CGPA ≥ {drive.minCGPA}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  Backlogs ≤ {drive.maxBacklogs}
                </span>
                {drive.eligibleBranches.map((branch: string) => (
                  <span key={branch} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                    {branch}
                  </span>
                ))}
              </div>

              {drive.requirements && drive.requirements.length > 0 && (
                <div className="mb-4">
                  <span className="text-sm text-gray-600 mb-2 block">Requirements:</span>
                  <ul className="list-disc list-inside space-y-1">
                    {drive.requirements.map((req: string, idx: number) => (
                      <li key={idx} className="text-sm text-gray-700">{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center gap-2 pt-4 border-t">
                {drive.status === 'active' ? (
                  <button
                    onClick={() => handleStatusChange(drive.id, 'completed')}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark as Completed
                  </button>
                ) : (
                  <button
                    onClick={() => handleStatusChange(drive.id, 'active')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Reactivate
                  </button>
                )}
                <button
                  onClick={() => handleDelete(drive.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredDrives.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-600">No {filter !== 'all' ? filter : ''} drives found</p>
          </div>
        )}
      </div>
    </div>
  );
}
