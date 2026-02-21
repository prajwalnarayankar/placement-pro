import { useState } from 'react';
import { User } from '../../../App';
import { getUsers, saveUsers } from '../../../utils/dataInitializer';
import { Edit, Plus, X, Save, Download, FileText } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import jsPDF from 'jspdf';

interface StudentProfileProps {
  user: User;
}

export function StudentProfile({ user }: StudentProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User>({ ...user });
  const [newSkill, setNewSkill] = useState('');
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    technologies: ''
  });
  const [showProjectModal, setShowProjectModal] = useState(false);

  const handleSave = () => {
    const users = getUsers();
    const updatedUsers = users.map((u: User) => 
      u.id === editedUser.id ? editedUser : u
    );
    saveUsers(updatedUsers);
    
    // Update current session
    localStorage.setItem('currentUser', JSON.stringify(editedUser));
    
    toast.success('Profile updated successfully');
    setIsEditing(false);
    window.location.reload();
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    
    const skills = editedUser.skills || [];
    if (!skills.includes(newSkill.trim())) {
      setEditedUser({
        ...editedUser,
        skills: [...skills, newSkill.trim()]
      });
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (skill: string) => {
    setEditedUser({
      ...editedUser,
      skills: (editedUser.skills || []).filter(s => s !== skill)
    });
  };

  const handleAddProject = () => {
    if (!newProject.title || !newProject.description) {
      toast.error('Please fill all project fields');
      return;
    }

    const projects = editedUser.projects || [];
    projects.push({
      title: newProject.title,
      description: newProject.description,
      technologies: newProject.technologies.split(',').map(t => t.trim())
    });

    setEditedUser({
      ...editedUser,
      projects
    });

    setNewProject({ title: '', description: '', technologies: '' });
    setShowProjectModal(false);
    toast.success('Project added successfully');
  };

  const handleRemoveProject = (index: number) => {
    const projects = [...(editedUser.projects || [])];
    projects.splice(index, 1);
    setEditedUser({
      ...editedUser,
      projects
    });
  };

  const generateResume = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 20;

    // Header
    const imgData = 'data:image/jpeg;base64,...';
    doc.setFillColor(59, 130, 246);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text(user.name || 'Student Name', pageWidth / 2, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(user.email || '', pageWidth / 2, 30, { align: 'center' });

    yPos = 50;
    doc.setTextColor(0, 0, 0);

    // Personal Details
    doc.setFontSize(16);
    doc.setTextColor(59, 130, 246);
    doc.text('Personal Details', 20, yPos);
    yPos += 10;
    
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`Roll Number: ${user.rollNumber || 'N/A'}`, 20, yPos);
    yPos += 7;
    doc.text(`Branch: ${user.branch || 'N/A'}`, 20, yPos);
    yPos += 7;
    doc.text(`CGPA: ${user.cgpa || 'N/A'}`, 20, yPos);
    yPos += 7;
    doc.text(`Phone: ${user.phone || 'N/A'}`, 20, yPos);
    yPos += 15;

    // Skills
    if (user.skills && user.skills.length > 0) {
      doc.setFontSize(16);
      doc.setTextColor(59, 130, 246);
      doc.text('Skills', 20, yPos);
      yPos += 10;
      
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      const skillsText = user.skills.join(', ');
      const splitSkills = doc.splitTextToSize(skillsText, pageWidth - 40);
      doc.text(splitSkills, 20, yPos);
      yPos += (splitSkills.length * 7) + 10;
    }

    // Projects
    if (user.projects && user.projects.length > 0) {
      doc.setFontSize(16);
      doc.setTextColor(59, 130, 246);
      doc.text('Projects', 20, yPos);
      yPos += 10;

      user.projects.forEach((project, index) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.setFont(undefined, 'bold');
        doc.text(`${index + 1}. ${project.title}`, 20, yPos);
        doc.setFont(undefined, 'normal');
        yPos += 7;

        doc.setFontSize(10);
        const descLines = doc.splitTextToSize(project.description, pageWidth - 40);
        doc.text(descLines, 25, yPos);
        yPos += (descLines.length * 6) + 3;

        doc.setTextColor(100, 100, 100);
        doc.text(`Technologies: ${project.technologies.join(', ')}`, 25, yPos);
        yPos += 10;
      });
    }

    // Footer
    const footerY = doc.internal.pageSize.getHeight() - 20;
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text('Generated by PlacementPro', pageWidth / 2, footerY, { align: 'center' });

    doc.save(`${user.name}_Resume.pdf`);
    toast.success('Resume downloaded successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl text-gray-800">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={generateResume}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Download className="w-4 h-4" />
              Download Resume
            </button>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedUser({ ...user });
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg text-gray-800 mb-4">Personal Information</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Roll Number</label>
            {isEditing ? (
              <input
                type="text"
                value={editedUser.rollNumber || ''}
                onChange={(e) => setEditedUser({ ...editedUser, rollNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            ) : (
              <p className="text-gray-800">{user.rollNumber || 'N/A'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Branch</label>
            {isEditing ? (
              <select
                value={editedUser.branch || ''}
                onChange={(e) => setEditedUser({ ...editedUser, branch: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="CS">CS</option>
                <option value="MCA">MCA</option>
                <option value="IT">IT</option>
                <option value="ECE">ECE</option>
              </select>
            ) : (
              <p className="text-gray-800">{user.branch || 'N/A'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">CGPA</label>
            {isEditing ? (
              <input
                type="number"
                step="0.01"
                value={editedUser.cgpa || ''}
                onChange={(e) => setEditedUser({ ...editedUser, cgpa: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                min="0"
                max="10"
              />
            ) : (
              <p className="text-gray-800">{user.cgpa || 'N/A'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Backlogs</label>
            {isEditing ? (
              <input
                type="number"
                value={editedUser.backlogs || 0}
                onChange={(e) => setEditedUser({ ...editedUser, backlogs: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                min="0"
              />
            ) : (
              <p className="text-gray-800">{user.backlogs || 0}</p>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Phone</label>
            {isEditing ? (
              <input
                type="tel"
                value={editedUser.phone || ''}
                onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            ) : (
              <p className="text-gray-800">{user.phone || 'N/A'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Year</label>
            {isEditing ? (
              <select
                value={editedUser.year || ''}
                onChange={(e) => setEditedUser({ ...editedUser, year: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            ) : (
              <p className="text-gray-800">{user.year ? `${user.year}${getOrdinalSuffix(user.year)} Year` : 'N/A'}</p>
            )}
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg text-gray-800">Skills</h3>
          {isEditing && (
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                placeholder="Add skill..."
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
              />
              <button
                onClick={handleAddSkill}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {(!user.skills || user.skills.length === 0) && !isEditing ? (
            <p className="text-gray-500">No skills added yet</p>
          ) : (
            (isEditing ? editedUser.skills : user.skills)?.map((skill, idx) => (
              <div
                key={idx}
                className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2"
              >
                {skill}
                {isEditing && (
                  <button onClick={() => handleRemoveSkill(skill)}>
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Projects */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg text-gray-800">Projects</h3>
          {isEditing && (
            <button
              onClick={() => setShowProjectModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Project
            </button>
          )}
        </div>
        <div className="space-y-4">
          {(!user.projects || user.projects.length === 0) && !isEditing ? (
            <p className="text-gray-500">No projects added yet</p>
          ) : (
            (isEditing ? editedUser.projects : user.projects)?.map((project, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-gray-800">{project.title}</h4>
                  {isEditing && (
                    <button
                      onClick={() => handleRemoveProject(idx)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                <div className="flex flex-wrap gap-1">
                  {project.technologies.map((tech, i) => (
                    <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Project Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg text-gray-800">Add New Project</h3>
              <button onClick={() => setShowProjectModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Project Title</label>
                <input
                  type="text"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., E-Commerce Website"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Description</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                  placeholder="Brief description of your project..."
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Technologies (comma-separated)</label>
                <input
                  type="text"
                  value={newProject.technologies}
                  onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="React, Node.js, MongoDB"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t">
              <button
                onClick={() => setShowProjectModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProject}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getOrdinalSuffix(num: number): string {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return 'st';
  if (j === 2 && k !== 12) return 'nd';
  if (j === 3 && k !== 13) return 'rd';
  return 'th';
}
