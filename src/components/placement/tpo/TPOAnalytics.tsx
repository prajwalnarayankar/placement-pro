import { useState, useEffect } from 'react';
import { getUsers, getDrives, getApplications } from '../../../utils/dataInitializer';
import { BarChart3, TrendingUp, Users, Building2, PieChart, Target } from 'lucide-react';

export function TPOAnalytics() {
  const [students, setStudents] = useState<any[]>([]);
  const [drives, setDrives] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    const allUsers = getUsers();
    setStudents(allUsers.filter((u: any) => u.role === 'student'));
    setDrives(getDrives());
    setApplications(getApplications());
  }, []);

  // Calculate statistics
  const totalStudents = students.length;
  const placedStudents = applications.filter((app: any) => app.status === 'selected').length;
  const placementRate = totalStudents > 0 ? ((placedStudents / totalStudents) * 100).toFixed(1) : 0;

  // Branch-wise distribution
  const branchDistribution = students.reduce((acc: any, student: any) => {
    const branch = student.branch || 'Other';
    acc[branch] = (acc[branch] || 0) + 1;
    return acc;
  }, {});

  // Application status distribution
  const statusDistribution = applications.reduce((acc: any, app: any) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});

  // Company-wise applications
  const companyApplications = drives.map((drive: any) => ({
    company: drive.companyName,
    count: applications.filter((app: any) => app.driveId === drive.id).length
  })).sort((a, b) => b.count - a.count);

  // CGPA Distribution
  const cgpaRanges = {
    '9.0+': 0,
    '8.0-8.9': 0,
    '7.0-7.9': 0,
    '6.0-6.9': 0,
    '<6.0': 0
  };

  students.forEach((student: any) => {
    const cgpa = student.cgpa || 0;
    if (cgpa >= 9.0) cgpaRanges['9.0+']++;
    else if (cgpa >= 8.0) cgpaRanges['8.0-8.9']++;
    else if (cgpa >= 7.0) cgpaRanges['7.0-7.9']++;
    else if (cgpa >= 6.0) cgpaRanges['6.0-6.9']++;
    else cgpaRanges['<6.0']++;
  });

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 opacity-80" />
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-3xl mb-1">{totalStudents}</p>
          <p className="text-sm opacity-90">Total Students</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-8 h-8 opacity-80" />
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-3xl mb-1">{placedStudents}</p>
          <p className="text-sm opacity-90">Placed Students</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="w-8 h-8 opacity-80" />
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-3xl mb-1">{placementRate}%</p>
          <p className="text-sm opacity-90">Placement Rate</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <Building2 className="w-8 h-8 opacity-80" />
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-3xl mb-1">{drives.length}</p>
          <p className="text-sm opacity-90">Total Drives</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Branch Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg text-gray-800">Branch-wise Distribution</h3>
          </div>
          <div className="space-y-3">
            {Object.entries(branchDistribution).map(([branch, count]: [string, any]) => (
              <div key={branch}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-700">{branch}</span>
                  <span className="text-gray-600">{count} students</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(count / totalStudents) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Application Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-green-600" />
            <h3 className="text-lg text-gray-800">Application Status</h3>
          </div>
          <div className="space-y-3">
            {Object.entries(statusDistribution).map(([status, count]: [string, any]) => {
              const colors: any = {
                applied: 'bg-blue-600',
                shortlisted: 'bg-yellow-600',
                interview_scheduled: 'bg-purple-600',
                selected: 'bg-green-600',
                rejected: 'bg-red-600'
              };
              return (
                <div key={status}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-700 capitalize">{status.replace('_', ' ')}</span>
                    <span className="text-gray-600">{count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${colors[status] || 'bg-gray-600'} h-2 rounded-full`}
                      style={{ width: `${(count / applications.length) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CGPA Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg text-gray-800">CGPA Distribution</h3>
          </div>
          <div className="space-y-3">
            {Object.entries(cgpaRanges).map(([range, count]: [string, any]) => (
              <div key={range}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-700">{range}</span>
                  <span className="text-gray-600">{count} students</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: `${totalStudents > 0 ? (count / totalStudents) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Company-wise Applications */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-5 h-5 text-orange-600" />
            <h3 className="text-lg text-gray-800">Company-wise Applications</h3>
          </div>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {companyApplications.map((item: any) => (
              <div key={item.company} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">{item.company}</span>
                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">
                  {item.count} applications
                </span>
              </div>
            ))}
            {companyApplications.length === 0 && (
              <p className="text-gray-500 text-center py-4">No applications yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-6">
        <h3 className="text-lg text-gray-800 mb-4">Key Insights</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Average CGPA</p>
            <p className="text-2xl text-gray-800">
              {students.length > 0
                ? (students.reduce((sum: number, s: any) => sum + (s.cgpa || 0), 0) / students.length).toFixed(2)
                : '0.00'}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Active Drives</p>
            <p className="text-2xl text-gray-800">
              {drives.filter((d: any) => d.status === 'active').length}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Applications per Student</p>
            <p className="text-2xl text-gray-800">
              {totalStudents > 0 ? (applications.length / totalStudents).toFixed(1) : '0.0'}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Students with 0 Backlogs</p>
            <p className="text-2xl text-gray-800">
              {students.filter((s: any) => s.backlogs === 0).length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
