import React, { useState } from 'react';
import { Mic, Square, RotateCcw, Check, ArrowRight, Languages, Volume2, MessageSquare, Settings, User, BarChart2, Globe, Zap, Layers } from 'lucide-react';
import Sidebar from '../components/Sidebar';  // Import the previously created Sidebar component

const VoiceInputPage = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  
  const recentRecordings = [
    {
      id: 1,
      duration: "2:15",
      text: "Schedule a follow-up meeting with the design team to review the latest mockups and gather feedback on the new features we discussed yesterday.",
      confidence: 98,
      date: "Just now"
    },
    {
      id: 2,
      duration: "1:30",
      text: "Send the updated project timeline to stakeholders and highlight the key milestones we need to achieve by the end of this quarter.",
      confidence: 95,
      date: "2 hours ago"
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Add the previously created Sidebar component */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 overflow-y-auto h-screen">
        <header className="bg-white border-b p-4 sticky top-0 z-10">
          <h1 className="text-xl font-bold">Voice Input</h1>
        </header>

        <div className="p-6">
          <div className="grid grid-cols-3 gap-6">
            {/* Recording Section */}
            <div className="col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="text-center">
                  <div className="mb-8">
                    <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-indigo-100">
                      <Mic className={`h-12 w-12 ${isRecording ? 'text-red-500' : 'text-indigo-600'}`} />
                    </div>
                    {isRecording && (
                      <div className="mt-4">
                        <div className="text-2xl font-bold text-gray-700">
                          {Math.floor(recordingDuration / 60)}:{(recordingDuration % 60).toString().padStart(2, '0')}
                        </div>
                        <div className="flex justify-center gap-2 mt-2">
                          <div className="h-6 w-1 bg-indigo-600 animate-pulse"></div>
                          <div className="h-6 w-1 bg-indigo-600 animate-pulse delay-75"></div>
                          <div className="h-6 w-1 bg-indigo-600 animate-pulse delay-150"></div>
                          <div className="h-6 w-1 bg-indigo-600 animate-pulse delay-200"></div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-center gap-4">
                    <button
                      className={`p-4 rounded-full ${
                        isRecording ? 'bg-red-100 text-red-600' : 'bg-indigo-600 text-white'
                      }`}
                      onClick={() => setIsRecording(!isRecording)}
                    >
                      {isRecording ? <Square className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                    </button>
                    
                    {isRecording && (
                      <>
                        <button className="p-4 rounded-full bg-gray-100 text-gray-600">
                          <ArrowRight className="h-6 w-6" />
                        </button>
                        <button className="p-4 rounded-full bg-gray-100 text-gray-600">
                          <RotateCcw className="h-6 w-6" />
                        </button>
                      </>
                    )}
                  </div>
                  
                  <div className="mt-6 flex justify-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Languages className="h-5 w-5" />
                      <span>English (US)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Volume2 className="h-5 w-5" />
                      <span>Clear Audio</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Recordings */}
              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-medium">Recent Recordings</h2>
                </div>
                <div className="divide-y">
                  {recentRecordings.map((recording) => (
                    <div key={recording.id} className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-600">
                          <Mic className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div className="text-sm text-gray-500">
                              {recording.date} • {recording.duration}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-green-600">
                                {recording.confidence}% accurate
                              </span>
                              <Check className="h-4 w-4 text-green-600" />
                            </div>
                          </div>
                          <p className="mt-2 text-gray-700">{recording.text}</p>
                          <div className="mt-3 flex gap-2">
                            <button className="px-3 py-1.5 bg-indigo-100 text-indigo-600 rounded-lg text-sm">
                              Edit Text
                            </button>
                            <button className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm">
                              Download
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Quick Settings */}
              <div className="bg-white rounded-xl shadow-sm border p-4">
                <h2 className="font-medium mb-4">Quick Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Auto-Punctuation</span>
                      <div className="w-12 h-6 bg-green-100 rounded-full p-1 flex items-center">
                        <div className="w-4 h-4 bg-green-600 rounded-full ml-auto"></div>
                      </div>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Background Noise Reduction</span>
                      <div className="w-12 h-6 bg-green-100 rounded-full p-1 flex items-center">
                        <div className="w-4 h-4 bg-green-600 rounded-full ml-auto"></div>
                      </div>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Real-time Transcription</span>
                      <div className="w-12 h-6 bg-green-100 rounded-full p-1 flex items-center">
                        <div className="w-4 h-4 bg-green-600 rounded-full ml-auto"></div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Voice Stats */}
              <div className="bg-white rounded-xl shadow-sm border p-4">
                <h2 className="font-medium mb-4">Voice Stats</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Recognition Accuracy</span>
                      <span className="font-medium">96%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-600 rounded-full" style={{width: '96%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Noise Level</span>
                      <span className="font-medium">Low</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-600 rounded-full" style={{width: '20%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Signal Strength</span>
                      <span className="font-medium">Excellent</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-600 rounded-full" style={{width: '98%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceInputPage;