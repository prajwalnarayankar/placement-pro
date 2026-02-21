import { useState } from 'react';
import { User } from '../../App';
import { getUsers } from '../../utils/dataInitializer';
import { Building2, Users, GraduationCap } from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'tpo' | 'student' | 'alumni'>('student');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  // Additional fields for signup
  const [rollNumber, setRollNumber] = useState('');
  const [branch, setBranch] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [phone, setPhone] = useState('');
  const [year, setYear] = useState('');
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [graduationYear, setGraduationYear] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const users = getUsers();

    if (isSignup) {
      // Check if user already exists
      const existingUser = users.find((u: User) => u.email === email);
      if (existingUser) {
        setError('User with this email already exists');
        return;
      }

      // Create new user
      const newUser: User = {
        id: `${role}${Date.now()}`,
        email,
        password,
        role,
        name,
        ...(role === 'student' && {
          rollNumber,
          branch,
          cgpa: parseFloat(cgpa),
          backlogs: 0,
          phone,
          year: parseInt(year),
          skills: [],
          projects: []
        }),
        ...(role === 'alumni' && {
          company,
          position,
          graduationYear: parseInt(graduationYear),
          phone
        })
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      onLogin(newUser);
    } else {
      // Login
      const user = users.find((u: User) => u.email === email && u.password === password);
      if (user) {
        onLogin(user);
      } else {
        setError('Invalid email or password');
      }
    }
  };

  const demoCredentials = [
    { role: 'TPO', email: 'tpo@college.edu', password: 'tpo123' },
    { role: 'Student', email: 'student1@college.edu', password: 'student123' },
    { role: 'Alumni', email: 'alumni1@gmail.com', password: 'alumni123' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl text-blue-600">PlacementPro</h1>
              <p className="text-sm text-gray-600">Integrated Campus Career Suite</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Left Side - Features */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl mb-2 text-gray-800">Welcome to PlacementPro</h2>
              <p className="text-gray-600">The complete solution for campus placement management</p>
            </div>

            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Building2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-800 mb-1">TPO Dashboard</h3>
                    <p className="text-sm text-gray-600">Manage drives with intelligent criteria engine, schedule interviews, and notify eligible students instantly</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-800 mb-1">Student Portal</h3>
                    <p className="text-sm text-gray-600">Build your profile, generate resume, track applications, and view personalized job opportunities</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <GraduationCap className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-800 mb-1">Alumni Connect</h3>
                    <p className="text-sm text-gray-600">Post job referrals, offer mentorship, and conduct mock interviews for juniors</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Demo Credentials */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="text-sm text-blue-900 mb-2">Demo Credentials:</h3>
              <div className="space-y-1 text-xs text-blue-800">
                {demoCredentials.map((cred, idx) => (
                  <div key={idx} className="font-mono">
                    <span className="font-semibold">{cred.role}:</span> {cred.email} / {cred.password}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Login/Signup Form */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="mb-6">
              <h2 className="text-2xl text-gray-800 mb-2">
                {isSignup ? 'Create Account' : 'Sign In'}
              </h2>
              <p className="text-sm text-gray-600">
                {isSignup ? 'Register to access PlacementPro' : 'Access your dashboard'}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Selection */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">Role</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['tpo', 'student', 'alumni'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`px-3 py-2 rounded-lg border text-sm capitalize transition-colors ${
                        role === r
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Common Fields */}
              {isSignup && (
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Student-specific fields */}
              {isSignup && role === 'student' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Roll Number</label>
                      <input
                        type="text"
                        value={rollNumber}
                        onChange={(e) => setRollNumber(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Branch</label>
                      <select
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select</option>
                        <option value="CS">CS</option>
                        <option value="MCA">MCA</option>
                        <option value="IT">IT</option>
                        <option value="ECE">ECE</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">CGPA</label>
                      <input
                        type="number"
                        step="0.01"
                        value={cgpa}
                        onChange={(e) => setCgpa(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        min="0"
                        max="10"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Year</label>
                      <select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select</option>
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                        <option value="3">3rd Year</option>
                        <option value="4">4th Year</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </>
              )}

              {/* Alumni-specific fields */}
              {isSignup && role === 'alumni' && (
                <>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Current Company</label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Position</label>
                    <input
                      type="text"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Graduation Year</label>
                      <input
                        type="number"
                        value={graduationYear}
                        onChange={(e) => setGraduationYear(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        min="2000"
                        max="2025"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isSignup ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setIsSignup(!isSignup);
                  setError('');
                }}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
