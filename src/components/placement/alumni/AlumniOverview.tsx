import { useState, useEffect } from 'react';
import { User } from '../../../App';
import { getReferrals, getMentorshipSlots } from '../../../utils/dataInitializer';
import { Briefcase, Users, Calendar, TrendingUp } from 'lucide-react';

interface AlumniOverviewProps {
  user: User;
}

export function AlumniOverview({ user }: AlumniOverviewProps) {
  const [myReferrals, setMyReferrals] = useState<any[]>([]);
  const [myMentorshipSlots, setMyMentorshipSlots] = useState<any[]>([]);

  useEffect(() => {
    const referrals = getReferrals().filter((r: any) => r.alumniId === user.id);
    setMyReferrals(referrals);

    const slots = getMentorshipSlots().filter((s: any) => s.alumniId === user.id);
    setMyMentorshipSlots(slots);
  }, [user]);

  const totalApplications = myReferrals.reduce((sum, r) => sum + (r.applicationsCount || 0), 0);
  const totalMentees = myMentorshipSlots.reduce((sum, s) => sum + (s.bookedBy?.length || 0), 0);

  const stats = [
    { 
      label: 'Job Referrals Posted', 
      value: myReferrals.length, 
      color: 'bg-blue-500',
      icon: Briefcase 
    },
    { 
      label: 'Total Applications', 
      value: totalApplications, 
      color: 'bg-green-500',
      icon: TrendingUp 
    },
    { 
      label: 'Mentorship Sessions', 
      value: myMentorshipSlots.length, 
      color: 'bg-purple-500',
      icon: Calendar 
    },
    { 
      label: 'Students Mentored', 
      value: totalMentees, 
      color: 'bg-orange-500',
      icon: Users 
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl mb-2">Welcome back, {user.name}! 👋</h2>
        <p className="text-purple-100 mb-4">
          {user.position} at {user.company} • Batch of {user.graduationYear}
        </p>
        <p className="text-sm text-purple-100">
          Thank you for giving back to the community! Your support helps juniors achieve their career goals.
        </p>
      </div>

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

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Referrals */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg text-gray-800 mb-4">Recent Job Referrals</h3>
          <div className="space-y-3">
            {myReferrals.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No referrals posted yet</p>
            ) : (
              myReferrals.slice(0, 3).map((referral: any) => (
                <div key={referral.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <h4 className="text-gray-800 mb-1">{referral.position}</h4>
                  <p className="text-sm text-gray-600 mb-2">{referral.companyName}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-green-600 text-sm">{referral.package}</span>
                    <span className="text-xs text-gray-500">
                      {referral.applicationsCount || 0} applications
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Mentorship Sessions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg text-gray-800 mb-4">Upcoming Mentorship Sessions</h3>
          <div className="space-y-3">
            {myMentorshipSlots.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No sessions scheduled</p>
            ) : (
              myMentorshipSlots.slice(0, 3).map((slot: any) => (
                <div key={slot.id} className="border border-gray-200 rounded-lg p-4 bg-purple-50">
                  <h4 className="text-gray-800 mb-1">{slot.title}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(slot.date).toLocaleDateString()} at {slot.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {slot.bookedBy?.length || 0}/{slot.maxStudents} students
                    </span>
                    <span className="text-xs text-gray-500">
                      {slot.duration} minutes
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Impact Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg text-gray-800 mb-4">Your Impact</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-700 mb-1">Total Reach</p>
            <p className="text-2xl text-blue-900">{totalApplications + totalMentees}</p>
            <p className="text-xs text-blue-600 mt-1">Students helped</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-green-700 mb-1">Response Rate</p>
            <p className="text-2xl text-green-900">
              {myReferrals.length > 0 ? Math.round((totalApplications / myReferrals.length) * 10) / 10 : 0}
            </p>
            <p className="text-xs text-green-600 mt-1">Avg applications per referral</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-sm text-purple-700 mb-1">Engagement</p>
            <p className="text-2xl text-purple-900">
              {myMentorshipSlots.length > 0 
                ? Math.round((totalMentees / myMentorshipSlots.length) * 10) / 10 
                : 0}
            </p>
            <p className="text-xs text-purple-600 mt-1">Avg attendees per session</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <button className="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700 transition-colors text-left">
          <Briefcase className="w-8 h-8 mb-3" />
          <h3 className="text-lg mb-1">Post Job Referral</h3>
          <p className="text-sm text-blue-100">Share job opportunities from your company</p>
        </button>
        <button className="bg-purple-600 text-white p-6 rounded-lg hover:bg-purple-700 transition-colors text-left">
          <Calendar className="w-8 h-8 mb-3" />
          <h3 className="text-lg mb-1">Schedule Mentorship</h3>
          <p className="text-sm text-purple-100">Offer guidance and conduct mock interviews</p>
        </button>
      </div>
    </div>
  );
}
