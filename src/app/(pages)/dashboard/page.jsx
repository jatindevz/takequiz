'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Zap, Brain, Rocket, BookOpen, Code, Globe, Star } from 'lucide-react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import LinkSharingComponent from '@/components/LinkSharingComponent';
import LogoutBtn from '../../../components/LogoutBtn';     

const useTimeGreeting = () => {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const getTimeOfDay = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) return 'Morning';
      if (hour >= 12 && hour < 17) return 'Afternoon';
      if (hour >= 17 && hour < 21) return 'Evening';
      return 'Night';
    };

    setGreeting(getTimeOfDay());
    const interval = setInterval(() => setGreeting(getTimeOfDay()), 60000);
    return () => clearInterval(interval);
  }, []);

  return greeting;
};

const QuizInputPage = () => {
  const router = useRouter();
  const timeGreeting = useTimeGreeting();
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const textareaRef = useRef(null);
  const { data: session } = useSession();
  const [link, setLink] = useState('');
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);


  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [topic]);

  const handleGenerate = async() => {
    setIsGenerating(true);

    try {
      const res = await axios.post('/api/createquiz', {
        topic,
      })
      const quizid = await res.data.quizId;
      console.log('Response:', res.data);

      setLink(`${origin}/dashboard/${quizid.toString()}/quiz`);

    } catch (error) {
      console.error('Error generating quiz:', error);
    }

    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  }


  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Animated background elements */}
      <LogoutBtn />
      <div className="relative max-w-6xl mx-auto p-6 sm:p-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium">AI-Powered Quiz Generator</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text ">
            Good {timeGreeting}, {session?.user?.username} ! ✨
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            What's the vibe today? Drop any topic and let's create some brain-teasing magic 🧠
          </p>
        </div>

        {/* Main Input Card */}
        <div className="relative mb-16">
          <div className="absolute -inset-1 bg-gradient-to-r  rounded-2xl blur opacity-20"></div>
          <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 mt-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <Zap className="text-white text-xl" />
                </div>
              </div>

              <div className="flex-1">
                <textarea
                  ref={textareaRef}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Type anything that sparks your curiosity... "
                  className="w-full bg-transparent border-none focus:ring-0 text-lg min-h-[100px] p-0 resize-none placeholder-gray-400 text-white"
                  style={{ outline: 'none' }}
                />

                <div className="flex justify-between items-center mt-8">
                  <div className="text-sm text-gray-400">
                    {topic.length > 0 ? (
                      <span className="flex items-center gap-1">
                        <Rocket className="w-4 h-4" />
                        Ready to launch!
                      </span>
                    ) : (
                      <span>Start typing to unlock the magic ✨</span>
                    )}
                  </div>

                  <button
                    onClick={handleGenerate}
                    disabled={!topic.trim() || isGenerating}
                    className={`px-8 py-4 rounded-xl font-semibold flex items-center gap-3 transition-all transform hover:scale-105 ${topic.trim()
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-purple-500/25 hover:shadow-2xl'
                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      } ${isGenerating ? 'opacity-80 cursor-not-allowed animate-pulse' : ''
                      }`}
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin">⚡</div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Generate Quiz
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
        </div>
        { link && < LinkSharingComponent link={link} />}
      </div>
    </div>
  );
};

export default QuizInputPage;