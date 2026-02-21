import { useState, useEffect } from 'react';
import { User } from '../../../App';
import { getReferrals, saveReferrals } from '../../../utils/dataInitializer';
import { Plus, X, Save, Briefcase, MapPin, IndianRupee, Users } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface JobReferralBoardProps {
  user: User;
}

export function JobReferralBoard({ user }: JobReferralBoardProps) {
  const [referrals, setReferrals] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newReferral, setNewReferral] = useState({
    companyName: '',
    position: '',
    package: '',
    location: '',
    description: '',
    requirements: ''
  });

  useEffect(() => {
    loadReferrals();
  }, []);

  const loadReferrals = () => {
    const allReferrals = getReferrals();
    setReferrals(allReferrals);
  };

  const handleCreate = () => {
    if (!newReferral.companyName || !newReferral.position || !newReferral.package || !newReferral.location) {
      toast.error('Please fill all required fields');
      return;
    }

    const referral = {
      id: `ref${Date.now()}`,
      alumniId: user.id,
      ...newReferral,
      requirements: newReferral.requirements.split('\n').filter(r => r.trim()),
      postedAt: new Date().toISOString(),
      applicationsCount: 0
    };

    const allReferrals = getReferrals();
    allReferrals.push(referral);
    saveReferrals(allReferrals);

    toast.success('Job referral posted successfully!');
    setShowModal(false);
    setNewReferral({
      companyName: '',
      position: '',
      package: '',
      location: '',
      description: '',
      requirements: ''
    });
    loadReferrals();
  };

  const handleDelete = (referralId: string) => {
    if (!confirm('Are you sure you want to delete this referral?')) return;

    const allReferrals = getReferrals();
    const updated = allReferrals.filter((r: any) => r.id !== referralId);
    saveReferrals(updated);
    
    toast.success('Referral deleted successfully');
    loadReferrals();
  };

  const myReferrals = referrals.filter(r => r.alumniId === user.id);
  const otherReferrals = referrals.filter(r => r.alumniId !== user.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl text-gray-800">Job Referral Board</h2>
            <p className="text-sm text-gray-600 mt-1">
              Help juniors by sharing job opportunities from your network
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Post Referral
          </button>
        </div>
      </div>

      {/* My Referrals */}
      {myReferrals.length > 0 && (
        <div>
          <h3 className="text-lg text-gray-800 mb-4">My Referrals ({myReferrals.length})</h3>
          <div className="grid gap-4">
            {myReferrals.map((referral) => (
              <div key={referral.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-lg text-gray-800 mb-1">{referral.position}</h4>
                    <p className="text-gray-600 mb-2">{referral.companyName}</p>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <IndianRupee className="w-4 h-4" />
                        <span>{referral.package}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{referral.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{referral.applicationsCount || 0} applications</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(referral.id)}
                    className="text-red-600 hover:text-red-700 p-2"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {referral.description && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-700">{referral.description}</p>
                  </div>
                )}

                {referral.requirements && referral.requirements.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-2">Requirements:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {referral.requirements.map((req: string, idx: number) => (
                        <li key={idx} className="text-sm text-gray-700">{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-4 text-xs text-gray-500">
                  Posted on {new Date(referral.postedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Other Alumni Referrals */}
      {otherReferrals.length > 0 && (
        <div>
          <h3 className="text-lg text-gray-800 mb-4">Referrals from Other Alumni</h3>
          <div className="grid gap-4">
            {otherReferrals.map((referral) => (
              <div key={referral.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex-1 mb-4">
                  <h4 className="text-lg text-gray-800 mb-1">{referral.position}</h4>
                  <p className="text-gray-600 mb-2">{referral.companyName}</p>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <IndianRupee className="w-4 h-4" />
                      <span>{referral.package}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{referral.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{referral.applicationsCount || 0} applications</span>
                    </div>
                  </div>
                </div>

                {referral.description && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-700">{referral.description}</p>
                  </div>
                )}

                {referral.requirements && referral.requirements.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-2">Requirements:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {referral.requirements.map((req: string, idx: number) => (
                        <li key={idx} className="text-sm text-gray-700">{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-4 text-xs text-gray-500">
                  Posted on {new Date(referral.postedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {myReferrals.length === 0 && otherReferrals.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-gray-800 mb-2">No referrals posted yet</h3>
          <p className="text-gray-600 text-sm mb-4">
            Be the first to share job opportunities with juniors
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Post Your First Referral
          </button>
        </div>
      )}

      {/* Create Referral Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl text-gray-800">Post Job Referral</h3>
              <button onClick={() => setShowModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Company Name *</label>
                  <input
                    type="text"
                    value={newReferral.companyName}
                    onChange={(e) => setNewReferral({ ...newReferral, companyName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Google"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Position *</label>
                  <input
                    type="text"
                    value={newReferral.position}
                    onChange={(e) => setNewReferral({ ...newReferral, position: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Software Engineer"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Package *</label>
                  <input
                    type="text"
                    value={newReferral.package}
                    onChange={(e) => setNewReferral({ ...newReferral, package: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 25 LPA"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Location *</label>
                  <input
                    type="text"
                    value={newReferral.location}
                    onChange={(e) => setNewReferral({ ...newReferral, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Bangalore"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Description</label>
                <textarea
                  value={newReferral.description}
                  onChange={(e) => setNewReferral({ ...newReferral, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Brief description about the role..."
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Requirements (one per line)</label>
                <textarea
                  value={newReferral.requirements}
                  onChange={(e) => setNewReferral({ ...newReferral, requirements: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="3+ years experience&#10;Strong in Java/Python&#10;Good communication skills"
                />
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                <Save className="w-4 h-4" />
                Post Referral
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
