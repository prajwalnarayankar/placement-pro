import { useState, useEffect } from 'react';
import { User } from '../../../App';
import { getMentorshipSlots, saveMentorshipSlots, getUsers } from '../../../utils/dataInitializer';
import { Plus, X, Save, Calendar, Clock, Users, Video } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface MentorshipSlotsProps {
  user: User;
}

export function MentorshipSlots({ user }: MentorshipSlotsProps) {
  const [slots, setSlots] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newSlot, setNewSlot] = useState({
    title: '',
    date: '',
    time: '',
    duration: '',
    maxStudents: '',
    description: ''
  });

  useEffect(() => {
    loadSlots();
  }, []);

  const loadSlots = () => {
    const allSlots = getMentorshipSlots();
    setSlots(allSlots);
  };

  const handleCreate = () => {
    if (!newSlot.title || !newSlot.date || !newSlot.time || !newSlot.duration || !newSlot.maxStudents) {
      toast.error('Please fill all required fields');
      return;
    }

    const slot = {
      id: `mentor${Date.now()}`,
      alumniId: user.id,
      ...newSlot,
      duration: parseInt(newSlot.duration),
      maxStudents: parseInt(newSlot.maxStudents),
      bookedBy: []
    };

    const allSlots = getMentorshipSlots();
    allSlots.push(slot);
    saveMentorshipSlots(allSlots);

    toast.success('Mentorship slot created successfully!');
    setShowModal(false);
    setNewSlot({
      title: '',
      date: '',
      time: '',
      duration: '',
      maxStudents: '',
      description: ''
    });
    loadSlots();
  };

  const handleDelete = (slotId: string) => {
    if (!confirm('Are you sure you want to delete this mentorship slot?')) return;

    const allSlots = getMentorshipSlots();
    const updated = allSlots.filter((s: any) => s.id !== slotId);
    saveMentorshipSlots(updated);
    
    toast.success('Mentorship slot deleted successfully');
    loadSlots();
  };

  const handleRemoveStudent = (slotId: string, studentId: string) => {
    const allSlots = getMentorshipSlots();
    const updated = allSlots.map((s: any) => {
      if (s.id === slotId) {
        return {
          ...s,
          bookedBy: s.bookedBy.filter((id: string) => id !== studentId)
        };
      }
      return s;
    });
    saveMentorshipSlots(updated);
    toast.success('Student removed from slot');
    loadSlots();
  };

  const mySlots = slots.filter(s => s.alumniId === user.id);
  const otherSlots = slots.filter(s => s.alumniId !== user.id);

  const getStudentName = (studentId: string) => {
    const users = getUsers();
    const student = users.find((u: any) => u.id === studentId);
    return student?.name || 'Unknown';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl text-gray-800">Mentorship Slots</h2>
            <p className="text-sm text-gray-600 mt-1">
              Schedule sessions for mock interviews, resume reviews, and career guidance
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            <Plus className="w-4 h-4" />
            Create Slot
          </button>
        </div>
      </div>

      {/* My Slots */}
      {mySlots.length > 0 && (
        <div>
          <h3 className="text-lg text-gray-800 mb-4">My Mentorship Sessions ({mySlots.length})</h3>
          <div className="grid gap-4">
            {mySlots.map((slot) => {
              const isFull = slot.bookedBy.length >= slot.maxStudents;
              const isPast = new Date(`${slot.date}T${slot.time}`) < new Date();

              return (
                <div key={slot.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg text-gray-800">{slot.title}</h4>
                        {isFull && (
                          <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
                            Full
                          </span>
                        )}
                        {isPast && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                            Completed
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(slot.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{slot.time} ({slot.duration} min)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{slot.bookedBy.length}/{slot.maxStudents} students</span>
                        </div>
                      </div>
                      {slot.description && (
                        <p className="text-sm text-gray-700 mb-3">{slot.description}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(slot.id)}
                      className="text-red-600 hover:text-red-700 p-2"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Registered Students */}
                  {slot.bookedBy.length > 0 && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <p className="text-sm text-purple-900 mb-2">Registered Students:</p>
                      <div className="space-y-2">
                        {slot.bookedBy.map((studentId: string) => (
                          <div key={studentId} className="flex items-center justify-between bg-white px-3 py-2 rounded">
                            <span className="text-sm text-gray-800">{getStudentName(studentId)}</span>
                            <button
                              onClick={() => handleRemoveStudent(slot.id, studentId)}
                              className="text-xs text-red-600 hover:text-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Other Alumni Slots */}
      {otherSlots.length > 0 && (
        <div>
          <h3 className="text-lg text-gray-800 mb-4">Sessions by Other Alumni</h3>
          <div className="grid gap-4">
            {otherSlots.map((slot) => {
              const isFull = slot.bookedBy.length >= slot.maxStudents;
              const isPast = new Date(`${slot.date}T${slot.time}`) < new Date();

              return (
                <div key={slot.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex-1 mb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg text-gray-800">{slot.title}</h4>
                      {isFull && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
                          Full
                        </span>
                      )}
                      {isPast && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          Completed
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(slot.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{slot.time} ({slot.duration} min)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{slot.bookedBy.length}/{slot.maxStudents} students</span>
                      </div>
                    </div>
                    {slot.description && (
                      <p className="text-sm text-gray-700">{slot.description}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {mySlots.length === 0 && otherSlots.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-gray-800 mb-2">No mentorship slots scheduled</h3>
          <p className="text-gray-600 text-sm mb-4">
            Create your first mentorship session to help juniors
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
          >
            Schedule Your First Session
          </button>
        </div>
      )}

      {/* Create Slot Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl text-gray-800">Create Mentorship Slot</h3>
              <button onClick={() => setShowModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Session Title *</label>
                <input
                  type="text"
                  value={newSlot.title}
                  onChange={(e) => setNewSlot({ ...newSlot, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., Mock Interview - DSA Focus"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Date *</label>
                  <input
                    type="date"
                    value={newSlot.date}
                    onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Time *</label>
                  <input
                    type="time"
                    value={newSlot.time}
                    onChange={(e) => setNewSlot({ ...newSlot, time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Duration (minutes) *</label>
                  <select
                    value={newSlot.duration}
                    onChange={(e) => setNewSlot({ ...newSlot, duration: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select duration</option>
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="90">1.5 hours</option>
                    <option value="120">2 hours</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Max Students *</label>
                  <input
                    type="number"
                    value={newSlot.maxStudents}
                    onChange={(e) => setNewSlot({ ...newSlot, maxStudents: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., 10"
                    min="1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Description</label>
                <textarea
                  value={newSlot.description}
                  onChange={(e) => setNewSlot({ ...newSlot, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={3}
                  placeholder="What will be covered in this session..."
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
                className="flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
              >
                <Save className="w-4 h-4" />
                Create Slot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
