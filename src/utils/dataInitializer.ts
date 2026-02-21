// Initialize sample data for the application
export function initializeData() {
  // Check if data already exists
  if (localStorage.getItem('dataInitialized')) {
    return;
  }

  // Sample Users (TPO, Students, Alumni)
  const users = [
    {
      id: 'tpo1',
      email: 'tpo@college.edu',
      password: 'tpo123',
      role: 'tpo',
      name: 'Dr. Rajesh Kumar',
      phone: '+91-9876543210'
    },
    {
      id: 'std1',
      email: 'student1@college.edu',
      password: 'student123',
      role: 'student',
      name: 'Priya Sharma',
      rollNumber: 'MCA2023001',
      branch: 'MCA',
      cgpa: 8.5,
      backlogs: 0,
      phone: '+91-9876543211',
      year: 2,
      skills: ['React', 'Node.js', 'Python', 'SQL', 'MongoDB'],
      projects: [
        {
          title: 'E-Commerce Platform',
          description: 'Built a full-stack e-commerce application with payment integration',
          technologies: ['React', 'Node.js', 'MongoDB', 'Stripe']
        },
        {
          title: 'Machine Learning Model',
          description: 'Developed a sentiment analysis model using NLP',
          technologies: ['Python', 'TensorFlow', 'NLTK']
        }
      ]
    },
    {
      id: 'std2',
      email: 'student2@college.edu',
      password: 'student123',
      role: 'student',
      name: 'Arjun Patel',
      rollNumber: 'MCA2023002',
      branch: 'MCA',
      cgpa: 7.8,
      backlogs: 0,
      phone: '+91-9876543212',
      year: 2,
      skills: ['Java', 'Spring Boot', 'MySQL', 'AWS'],
      projects: [
        {
          title: 'Hospital Management System',
          description: 'Created a comprehensive system for managing hospital operations',
          technologies: ['Java', 'Spring Boot', 'MySQL', 'Angular']
        }
      ]
    },
    {
      id: 'std3',
      email: 'student3@college.edu',
      password: 'student123',
      role: 'student',
      name: 'Sneha Reddy',
      rollNumber: 'CS2023001',
      branch: 'CS',
      cgpa: 9.1,
      backlogs: 0,
      phone: '+91-9876543213',
      year: 4,
      skills: ['Python', 'Django', 'React', 'PostgreSQL', 'Docker', 'PowerBI'],
      projects: [
        {
          title: 'Data Analytics Dashboard',
          description: 'Built an interactive dashboard for business intelligence',
          technologies: ['Python', 'Django', 'React', 'PowerBI', 'PostgreSQL']
        }
      ]
    },
    {
      id: 'std4',
      email: 'student4@college.edu',
      password: 'student123',
      role: 'student',
      name: 'Rahul Singh',
      rollNumber: 'MCA2023003',
      branch: 'MCA',
      cgpa: 6.5,
      backlogs: 1,
      phone: '+91-9876543214',
      year: 2,
      skills: ['JavaScript', 'React', 'HTML', 'CSS'],
      projects: []
    },
    {
      id: 'alum1',
      email: 'alumni1@gmail.com',
      password: 'alumni123',
      role: 'alumni',
      name: 'Vikram Malhotra',
      company: 'Google',
      position: 'Senior Software Engineer',
      graduationYear: 2019,
      branch: 'CS',
      phone: '+91-9876543215'
    },
    {
      id: 'alum2',
      email: 'alumni2@gmail.com',
      password: 'alumni123',
      role: 'alumni',
      name: 'Ananya Iyer',
      company: 'Microsoft',
      position: 'Product Manager',
      graduationYear: 2020,
      branch: 'MCA',
      phone: '+91-9876543216'
    }
  ];

  // Sample Placement Drives
  const drives = [
    {
      id: 'drive1',
      companyName: 'TCS Digital',
      position: 'System Engineer',
      package: '7.5 LPA',
      minCGPA: 7.0,
      maxBacklogs: 0,
      eligibleBranches: ['CS', 'MCA'],
      driveDate: '2026-03-15',
      applicationDeadline: '2026-03-01',
      description: 'TCS is hiring for System Engineer role in Digital division',
      requirements: ['Good programming skills', 'Problem solving ability', 'Communication skills'],
      status: 'active',
      createdBy: 'tpo1',
      createdAt: new Date().toISOString(),
      interviewSlots: []
    },
    {
      id: 'drive2',
      companyName: 'Infosys',
      position: 'Software Developer',
      package: '6.5 LPA',
      minCGPA: 6.5,
      maxBacklogs: 1,
      eligibleBranches: ['CS', 'MCA', 'IT'],
      driveDate: '2026-03-20',
      applicationDeadline: '2026-03-05',
      description: 'Infosys is looking for talented software developers',
      requirements: ['Java or Python', 'Database knowledge', 'Team player'],
      status: 'active',
      createdBy: 'tpo1',
      createdAt: new Date().toISOString(),
      interviewSlots: []
    },
    {
      id: 'drive3',
      companyName: 'Amazon',
      position: 'SDE-1',
      package: '28 LPA',
      minCGPA: 8.0,
      maxBacklogs: 0,
      eligibleBranches: ['CS', 'MCA'],
      driveDate: '2026-04-10',
      applicationDeadline: '2026-03-25',
      description: 'Amazon is hiring for Software Development Engineer role',
      requirements: ['Strong DSA skills', 'System Design knowledge', 'At least 2 projects'],
      status: 'active',
      createdBy: 'tpo1',
      createdAt: new Date().toISOString(),
      interviewSlots: []
    }
  ];

  // Sample Applications
  const applications = [
    {
      id: 'app1',
      studentId: 'std1',
      driveId: 'drive1',
      status: 'applied',
      appliedAt: new Date().toISOString(),
      interviewSlot: null
    },
    {
      id: 'app2',
      studentId: 'std1',
      driveId: 'drive3',
      status: 'shortlisted',
      appliedAt: new Date().toISOString(),
      interviewSlot: '2026-04-10T10:00:00'
    },
    {
      id: 'app3',
      studentId: 'std2',
      driveId: 'drive1',
      status: 'applied',
      appliedAt: new Date().toISOString(),
      interviewSlot: null
    },
    {
      id: 'app4',
      studentId: 'std3',
      driveId: 'drive3',
      status: 'interview_scheduled',
      appliedAt: new Date().toISOString(),
      interviewSlot: '2026-04-10T11:00:00'
    }
  ];

  // Sample Job Referrals posted by Alumni
  const referrals = [
    {
      id: 'ref1',
      alumniId: 'alum1',
      companyName: 'Google',
      position: 'Software Engineer',
      package: '35 LPA',
      location: 'Bangalore',
      description: 'Looking for talented engineers to join our Cloud team',
      requirements: ['3+ years experience', 'Strong in Java/Python', 'System Design'],
      postedAt: new Date().toISOString(),
      applicationsCount: 5
    },
    {
      id: 'ref2',
      alumniId: 'alum2',
      companyName: 'Microsoft',
      position: 'Product Manager',
      package: '32 LPA',
      location: 'Hyderabad',
      description: 'PM role for Office365 team',
      requirements: ['MBA or equivalent', 'Technical background', 'Leadership skills'],
      postedAt: new Date().toISOString(),
      applicationsCount: 3
    }
  ];

  // Sample Mentorship Slots
  const mentorshipSlots = [
    {
      id: 'mentor1',
      alumniId: 'alum1',
      title: 'Mock Interview - DSA Focus',
      date: '2026-02-25',
      time: '18:00',
      duration: 60,
      maxStudents: 5,
      bookedBy: ['std1', 'std3'],
      description: 'Practice coding interviews with focus on Data Structures'
    },
    {
      id: 'mentor2',
      alumniId: 'alum2',
      title: 'Career Guidance Session',
      date: '2026-02-27',
      time: '19:00',
      duration: 45,
      maxStudents: 10,
      bookedBy: ['std2'],
      description: 'General career advice and resume review'
    }
  ];

  // Save to localStorage
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('drives', JSON.stringify(drives));
  localStorage.setItem('applications', JSON.stringify(applications));
  localStorage.setItem('referrals', JSON.stringify(referrals));
  localStorage.setItem('mentorshipSlots', JSON.stringify(mentorshipSlots));
  localStorage.setItem('dataInitialized', 'true');
}

// Helper functions to get data
export function getUsers() {
  return JSON.parse(localStorage.getItem('users') || '[]');
}

export function getDrives() {
  return JSON.parse(localStorage.getItem('drives') || '[]');
}

export function getApplications() {
  return JSON.parse(localStorage.getItem('applications') || '[]');
}

export function getReferrals() {
  return JSON.parse(localStorage.getItem('referrals') || '[]');
}

export function getMentorshipSlots() {
  return JSON.parse(localStorage.getItem('mentorshipSlots') || '[]');
}

// Helper functions to save data
export function saveUsers(users: any[]) {
  localStorage.setItem('users', JSON.stringify(users));
}

export function saveDrives(drives: any[]) {
  localStorage.setItem('drives', JSON.stringify(drives));
}

export function saveApplications(applications: any[]) {
  localStorage.setItem('applications', JSON.stringify(applications));
}

export function saveReferrals(referrals: any[]) {
  localStorage.setItem('referrals', JSON.stringify(referrals));
}

export function saveMentorshipSlots(slots: any[]) {
  localStorage.setItem('mentorshipSlots', JSON.stringify(slots));
}
