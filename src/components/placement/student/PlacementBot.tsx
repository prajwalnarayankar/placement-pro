import { useState } from 'react';
import { User } from '../../../App';
import { Bot, Send, Sparkles } from 'lucide-react';

interface PlacementBotProps {
  user: User;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export function PlacementBot({ user }: PlacementBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hi ${user.name}! I'm your PlacementBot 🤖. I can help you with:\n\n• Information about placement drives\n• Eligibility criteria\n• Interview preparation tips\n• Resume building advice\n• Company research\n\nWhat would you like to know?`,
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickQuestions = [
    'What drives am I eligible for?',
    'When is the next interview?',
    'How to prepare for technical rounds?',
    'What is my CGPA?',
    'Tips for resume building'
  ];

  const getBotResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase();

    // Eligibility questions
    if (msg.includes('eligible') || msg.includes('apply') || msg.includes('drives')) {
      return `Based on your profile:\n\n• CGPA: ${user.cgpa}\n• Branch: ${user.branch}\n• Backlogs: ${user.backlogs}\n\nYou are eligible for companies with:\n- Minimum CGPA ≤ ${user.cgpa}\n- Maximum backlogs ≥ ${user.backlogs}\n- Branches including ${user.branch}\n\nCheck the "Eligible Drives" tab to see all available opportunities!`;
    }

    // CGPA questions
    if (msg.includes('cgpa') || msg.includes('grade')) {
      return `Your current CGPA is ${user.cgpa}.\n\n${
        user.cgpa && user.cgpa >= 8.5
          ? 'Excellent! You qualify for most premium companies.'
          : user.cgpa && user.cgpa >= 7.5
          ? 'Good CGPA! You qualify for many companies. Keep up the good work!'
          : 'You may want to focus on improving your CGPA to unlock more opportunities.'
      }`;
    }

    // Interview preparation
    if (msg.includes('interview') || msg.includes('prepare')) {
      return `Interview Preparation Tips:\n\n1. **Technical Round:**\n   • Practice DSA on LeetCode/CodeChef\n   • Revise core CS concepts\n   • Work on system design basics\n\n2. **HR Round:**\n   • Prepare your introduction\n   • Know about the company\n   • Practice behavioral questions\n\n3. **Key Tips:**\n   • Be confident and honest\n   • Ask relevant questions\n   • Dress professionally\n   • Arrive 10-15 minutes early\n\nWould you like specific tips for any round?`;
    }

    // Resume questions
    if (msg.includes('resume') || msg.includes('cv')) {
      return `Resume Building Tips:\n\n1. **Structure:**\n   • Keep it to 1-2 pages\n   • Use a clean, professional template\n   • Include contact information\n\n2. **Content:**\n   • Highlight projects and skills\n   • Use action verbs\n   • Quantify achievements\n   • Tailor for each company\n\n3. **Sections:**\n   • Education\n   • Skills (${user.skills?.length || 0} skills added)\n   • Projects (${user.projects?.length || 0} projects added)\n   • Certifications\n   • Achievements\n\nYou can generate your resume from the Profile tab!`;
    }

    // Skills questions
    if (msg.includes('skill') || msg.includes('technology')) {
      return `Your current skills: ${user.skills?.join(', ') || 'None added yet'}\n\n**In-Demand Skills for 2026:**\n• Cloud Computing (AWS, Azure)\n• AI/ML & Data Science\n• Full Stack Development\n• DevOps & CI/CD\n• Cybersecurity\n• Mobile Development\n\n${
        !user.skills || user.skills.length === 0
          ? 'Add your skills in the Profile tab to improve your chances!'
          : 'Great! Keep learning and updating your skillset.'
      }`;
    }

    // Company research
    if (msg.includes('company') || msg.includes('research')) {
      return `Company Research Tips:\n\n1. **Before Applying:**\n   • Check Glassdoor reviews\n   • Research company culture\n   • Understand their products/services\n\n2. **Key Areas:**\n   • Recent news & achievements\n   • Technology stack\n   • Growth opportunities\n   • Work-life balance\n\n3. **During Interview:**\n   • Show genuine interest\n   • Ask about team structure\n   • Inquire about learning opportunities\n\nResearch helps you stand out!`;
    }

    // Stress/motivation
    if (msg.includes('stress') || msg.includes('nervous') || msg.includes('worried')) {
      return `It's completely normal to feel nervous! Here's some advice:\n\n• **Remember:** Everyone gets rejected sometimes\n• **Stay Positive:** One opportunity is all you need\n• **Prepare Well:** Confidence comes from preparation\n• **Take Breaks:** Don't burn yourself out\n• **Talk to Seniors:** Learn from their experiences\n\nYou've got this! 💪 Keep applying and preparing.`;
    }

    // Default responses
    const defaultResponses = [
      `I can help you with information about:\n\n• Your eligibility for drives\n• Interview preparation\n• Resume building\n• Company research\n• CGPA and profile details\n\nTry asking about any of these topics!`,
      `That's an interesting question! I specialize in:\n\n✓ Placement drive information\n✓ Eligibility criteria\n✓ Interview tips\n✓ Resume guidance\n✓ Your profile status\n\nWhat would you like to know about these?`,
      `I'm here to help with your placement journey! You can ask me about:\n\n• Available drives and eligibility\n• Your CGPA and profile\n• Interview preparation\n• Resume tips\n• Skills development\n\nWhat's on your mind?`
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate bot thinking and response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(input),
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-white bg-opacity-20 p-3 rounded-full">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl">PlacementBot</h2>
            <p className="text-sm text-purple-100">Your 24/7 Career Assistant</p>
          </div>
        </div>
        <p className="text-sm text-purple-100">
          Ask me anything about placements, interviews, or your profile!
        </p>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Messages */}
        <div className="h-[500px] overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.sender === 'user'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {message.sender === 'bot' && (
                  <div className="flex items-center gap-2 mb-2">
                    <Bot className="w-4 h-4" />
                    <span className="text-xs font-semibold">PlacementBot</span>
                  </div>
                )}
                <p className="text-sm whitespace-pre-line">{message.text}</p>
                <p className={`text-xs mt-2 ${
                  message.sender === 'user' ? 'text-green-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-gray-600" />
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Questions */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-sm text-gray-700">Quick Questions:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((question, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickQuestion(question)}
                className="px-3 py-1.5 bg-white border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your question here..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
