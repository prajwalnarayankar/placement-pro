import { useState, useEffect } from 'react';
import { getDrives, getApplications, getUsers, saveApplications } from '../../../utils/dataInitializer';
import { Calendar, Clock, User, Building2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function InterviewScheduler() {
  const [drives, setDrives] = useState<any[]>([]);
  const [selectedDrive, setSelectedDrive] = useState<string>('');
  const [applications, setApplications] = useState<any[]>([]);
  const [slots, setSlots] = useState<Array<{ time: string; studentId: string | null }>>([]);

  useEffect(() => {
    const allDrives = getDrives().filter((d: any) => d.status === 'active');
    setDrives(allDrives);
  }, []);

  useEffect(() => {
    if (selectedDrive) {
      loadApplicationsForDrive(selectedDrive);
    }
  }, [selectedDrive]);

  const loadApplicationsForDrive = (driveId: string) => {
    const allApplications = getApplications();
    const driveApplications = allApplications.filter(
      (app: any) => app.driveId === driveId && app.status !== 'rejected'
    );
    setApplications(driveApplications);

    // Generate time slots for the day (9 AM to 5 PM)
    const timeSlots = [];
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const existingApp = driveApplications.find((app: any) => 
          app.interviewSlot && app.interviewSlot.includes(time)
        );
        timeSlots.push({
          time,
          studentId: existingApp ? existingApp.studentId : null
        });
      }
    }
    setSlots(timeSlots);
  };

  const assignSlot = (time: string, studentId: string) => {
    const drive = drives.find(d => d.id === selectedDrive);
    if (!drive) return;

    const allApplications = getApplications();
    const updatedApplications = allApplications.map((app: any) => {
      if (app.studentId === studentId && app.driveId === selectedDrive) {
        return {
          ...app,
          interviewSlot: `${drive.driveDate}T${time}:00`,
          status: 'interview_scheduled'
        };
      }
      return app;
    });

    saveApplications(updatedApplications);
    loadApplicationsForDrive(selectedDrive);
    toast.success('Interview slot assigned successfully');
  };

  const removeSlot = (studentId: string) => {
    const allApplications = getApplications();
    const updatedApplications = allApplications.map((app: any) => {
      if (app.studentId === studentId && app.driveId === selectedDrive) {
        return {
          ...app,
          interviewSlot: null,
          status: 'shortlisted'
        };
      }
      return app;
    });

    saveApplications(updatedApplications);
    loadApplicationsForDrive(selectedDrive);
    toast.success('Interview slot removed');
  };

  const getStudentById = (studentId: string) => {
    const users = getUsers();
    return users.find((u: any) => u.id === studentId);
  };

  const unscheduledApplications = applications.filter((app: any) => !app.interviewSlot);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl text-gray-800 mb-4">Interview Scheduler</h2>
        <div>
          <label className="block text-sm text-gray-700 mb-2">Select Placement Drive</label>
          <select
            value={selectedDrive}
            onChange={(e) => setSelectedDrive(e.target.value)}
            className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Choose a drive...</option>
            {drives.map((drive) => (
              <option key={drive.id} value={drive.id}>
                {drive.companyName} - {drive.position}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedDrive && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Time Slots Calendar */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg text-gray-800">Interview Schedule</h3>
            </div>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {slots.map((slot, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    slot.studentId
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-800">{slot.time}</span>
                  </div>
                  {slot.studentId ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-blue-700">
                        {getStudentById(slot.studentId)?.name}
                      </span>
                      <button
                        onClick={() => removeSlot(slot.studentId!)}
                        className="text-xs text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">Available</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Unscheduled Students */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-green-600" />
              <h3 className="text-lg text-gray-800">
                Unscheduled Students ({unscheduledApplications.length})
              </h3>
            </div>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {unscheduledApplications.map((app: any) => {
                const student = getStudentById(app.studentId);
                if (!student) return null;

                return (
                  <div
                    key={app.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="mb-3">
                      <p className="text-gray-800">{student.name}</p>
                      <p className="text-sm text-gray-600">{student.rollNumber}</p>
                      <p className="text-sm text-gray-600">
                        CGPA: {student.cgpa} | {student.branch}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Assign Time Slot
                      </label>
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            assignSlot(e.target.value, student.id);
                          }
                        }}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select time...</option>
                        {slots
                          .filter(s => !s.studentId)
                          .map((slot, idx) => (
                            <option key={idx} value={slot.time}>
                              {slot.time}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                );
              })}

              {unscheduledApplications.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>All students have been scheduled</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {!selectedDrive && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Select a placement drive to start scheduling interviews</p>
        </div>
      )}
    </div>
  );
}
