# PlacementPro - Integrated Campus Career Suite

## 🎓 Overview
PlacementPro is a comprehensive role-based web application designed to streamline campus placement activities. It replaces traditional Excel sheets and notice boards with a dynamic, real-time digital platform.

## 👥 User Roles

### 1. TPO (Training & Placement Officer)
**Demo Credentials:** `tpo@college.edu` / `tpo123`

**Features:**
- **Criteria Engine**: Create placement drives with automatic eligibility filtering
  - Set minimum CGPA, maximum backlogs, and eligible branches
  - Instantly see eligible student count
  - One-click notification to all eligible students
  
- **Drive Management**: Create, edit, and manage placement drives
  - Track application status
  - Mark drives as active/completed
  
- **Interview Scheduler**: Drag-and-drop calendar interface
  - Assign interview slots to students
  - Prevent scheduling conflicts
  - View all scheduled interviews
  
- **Analytics Dashboard**: Data-driven insights
  - Placement statistics and rates
  - Branch-wise distribution
  - Company-wise applications
  - CGPA distribution
  - Application status tracking

### 2. Student Portal
**Demo Credentials:** `student1@college.edu` / `student123`

**Features:**
- **Profile Management**: Complete student profile with:
  - Personal details (Roll number, branch, CGPA, backlogs)
  - Skills management
  - Projects portfolio
  
- **Resume Wizard**: One-click PDF resume generation
  - College-branded template
  - Auto-populated from profile data
  - Professional formatting
  
- **Eligible Drives**: Personalized feed showing only eligible opportunities
  - Real-time filtering based on CGPA, backlogs, and branch
  - Application deadlines
  - One-click apply
  
- **Application Tracker**: Visual status tracking
  - Applied → Shortlisted → Interview Scheduled → Selected
  - Interview slot details
  - Timeline visualization
  - Application statistics
  
- **PlacementBot**: 24/7 AI Career Assistant
  - Instant query resolution
  - Interview preparation tips
  - Resume building advice
  - Company research guidance
  - Skill gap analysis
  - Quick question suggestions

### 3. Alumni Connect Portal
**Demo Credentials:** `alumni1@gmail.com` / `alumni123`

**Features:**
- **Job Referral Board**: Post job openings from current companies
  - Share referrals with juniors
  - Track application count
  - Manage posted referrals
  
- **Mentorship Slots**: Schedule sessions for juniors
  - Mock interviews
  - Resume reviews
  - Career guidance
  - Technical prep sessions
  - Student booking management

## 🚀 Key Features

### The Criteria Engine (Core Feature)
The TPO creates a drive with specific requirements:
```
Example: TCS Digital
- Minimum CGPA: 7.0
- Backlogs: 0
- Branches: CS/MCA Only
```
**Result**: System instantly displays "142 Students Eligible"
**Action**: One-click "Notify All Eligible" button

### Market Intelligence & Analytics
- **Skill Gap Analysis**: Compares student profiles against market data
  - Example: "80% of placed students had PowerBI, but you don't"
  - Provides recommended learning paths
  
- **Real-time Dashboards**: 
  - Placement rates
  - Branch-wise statistics
  - Application trends
  - Interview scheduling overview

### Resume Wizard
Students input:
- Project details
- Skills
- Academic marks

**Output**: Standardized, college-branded PDF resume generated instantly

### PlacementBot - 24/7 Virtual Assistant
Automates common TPO queries:
- "What is the cutoff?"
- "When is the interview?"
- "Is the venue changed?"
- Interview preparation tips
- Company research assistance

## 💾 Data Persistence
All data is stored in browser localStorage and persists across sessions:
- User accounts and profiles
- Placement drives
- Applications
- Job referrals
- Mentorship slots

## 🎨 Design Features
- **Mobile-responsive**: Works on all device sizes
- **Intuitive UI**: Tab-based navigation for each role
- **Real-time updates**: Instant reflection of data changes
- **Professional styling**: Modern, clean interface with role-specific color schemes
  - TPO: Blue
  - Student: Green
  - Alumni: Purple

## 📊 Sample Data Included
The application comes pre-loaded with:
- 1 TPO account
- 4 Student accounts (varying CGPA and profiles)
- 2 Alumni accounts
- 3 Active placement drives
- Sample applications and referrals

## 🔐 Authentication System
- Role-based login (TPO/Student/Alumni)
- Signup functionality for new users
- Persistent sessions
- Secure logout

## 📱 User Experience Highlights

### For Students:
1. **Profile Completeness Tracker**: Shows percentage complete
2. **Personalized Feeds**: Only see relevant drives
3. **Visual Application Timeline**: Track progress at a glance
4. **AI Assistant**: Get help 24/7 without waiting for TPO

### For TPO:
1. **Automated Filtering**: No manual CSV filtering needed
2. **Bulk Notifications**: Reach all eligible students instantly
3. **Visual Analytics**: Make data-driven decisions
4. **Interview Conflict Prevention**: Smart scheduling system

### For Alumni:
1. **Impact Dashboard**: See how many students you've helped
2. **Easy Referral Posting**: Share opportunities quickly
3. **Mentorship Management**: Track all your sessions
4. **Give-back Platform**: Stay connected with juniors

## 🛠️ Technical Stack
- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Data Storage**: Browser localStorage
- **PDF Generation**: jsPDF library
- **Icons**: Lucide React
- **Notifications**: Sonner

## 🎯 Problem Solved
PlacementPro eliminates:
- ❌ Manual Excel sheet management
- ❌ Notice board updates
- ❌ Email overload
- ❌ Scheduling conflicts
- ❌ Missed opportunities for eligible students
- ❌ Repetitive queries to TPO

And provides:
- ✅ Real-time digital platform
- ✅ Automated eligibility filtering
- ✅ Instant notifications
- ✅ Visual tracking
- ✅ AI-powered assistance
- ✅ Alumni networking

## 📈 Future Enhancements (Bonus Ideas)
- Email/SMS integration for notifications
- Video interview platform integration
- Company portal for direct posting
- Advanced analytics with ML predictions
- Mobile app (React Native)
- Document verification system
- Placement cell resource library
- Student feedback and ratings system

## 🚦 Getting Started
1. Open the application
2. Use demo credentials or sign up
3. Explore features based on your role
4. Data persists automatically

## 📝 Note
This is a prototype application designed for demonstration purposes. For production use:
- Implement a backend database (e.g., PostgreSQL, MongoDB)
- Add server-side authentication (JWT, OAuth)
- Set up email/SMS services
- Implement file storage (AWS S3, Cloudinary)
- Add security measures (HTTPS, input validation)
- Deploy on cloud platform (AWS, Azure, Vercel)

---

**Developed for MCA Track 2 Project**
*Making campus placements efficient, transparent, and data-driven*
