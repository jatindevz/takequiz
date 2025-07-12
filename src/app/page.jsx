"use client";
import React from 'react';
import { useRef } from 'react';
import Navbar from "@/components/Navbar";


const LandingPage = () => {

  // Create refs for sections
  const howItWorksRef = useRef(null);
  const getStartedRef = useRef(null);

  // Smooth scroll function
  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen text-gray-100 font-sans">
      {/* Hero Section */}
      <Navbar />
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Create <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">AI-Powered</span> Quizzes in Seconds
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl">
              QuizMaster transforms any topic into engaging quizzes with AI-generated questions. Perfect for educators, content creators, and knowledge enthusiasts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => scrollToSection(getStartedRef)} className="px-8 py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-mediumtransition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer">
                Create Your First Quiz
              </button>
              <button onClick={() => scrollToSection(howItWorksRef)} className="px-8 py-3 rounded-lg bg-gray-800 text-white font-medium border border-gray-700 hover:border-cyan-500 transition-all duration-300">
                See How It Works
              </button>
            </div>
          </div>
          <div className="lg:w-1/2 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl"></div>
              <div className="relative bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full max-w-md">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                    <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
                    <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                    <div className="flex-1 bg-gray-700 h-8 rounded-lg"></div>
                  </div>

                  <div className="p-4 bg-gray-900 rounded-lg">
                    <div className="font-medium mb-2">Enter your topic:</div>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-gray-800 px-4 py-2 rounded-lg">Ancient Roman History</div>
                      <button className="bg-gradient-to-r from-cyan-600 to-blue-600 px-4 rounded-lg">Generate</button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-gray-900 rounded-lg p-4 animate-pulse">
                      <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-700 rounded w-full mb-1"></div>
                      <div className="h-3 bg-gray-700 rounded w-5/6 mb-1"></div>
                      <div className="h-3 bg-gray-700 rounded w-4/5"></div>
                    </div>

                    <div className="bg-gray-900 rounded-lg p-4">
                      <div className="font-medium mb-2">Who was the first Roman Emperor?</div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-gray-800 p-2 rounded-lg">Julius Caesar</div>
                        <div className="bg-cyan-900 border border-cyan-500 p-2 rounded-lg">Augustus</div>
                        <div className="bg-gray-800 p-2 rounded-lg">Nero</div>
                        <div className="bg-gray-800 p-2 rounded-lg">Constantine</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Everything you need to create, customize, and share engaging quizzes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 transition-all duration-300 hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/10"
              >
                <div className="text-cyan-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        ref={howItWorksRef}
        className="py-16 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              How QuizMaster Works
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Create and share quizzes in four simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="bg-gray-800/30 border border-gray-700 rounded-xl p-6 transition-all duration-300 hover:border-cyan-500"
              >
                <div className="flex items-start gap-5">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-cyan-600/30 to-blue-600/30 border border-cyan-500/30 flex items-center justify-center">
                    <div className="text-lg font-bold text-cyan-400">
                      {index + 1}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-gray-400 text-sm">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Get Started Section */}
      <section ref={getStartedRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-cyan-900/20 to-blue-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Create Your First AI-Powered Quiz?
          </h2>
          {/* <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Join thousands of educators and content creators who are already using QuizMaster
          </p> */}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium  transition-all duration-300 transform hover:scale-105 shadow-lg ">
              Get Started for Free
            </button>
            {/* <button className="px-8 py-3 rounded-lg bg-gray-800 text-white font-medium border border-gray-700 hover:border-cyan-500 transition-all duration-300">
              Schedule a Demo
            </button> */}
          </div>

          
        </div>
      </section>

      {/* Mini Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="h-8 w-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></div>
            <span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              QuizMaster
            </span>
          </div>

          <div className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} QuizMaster. All rights reserved.
          </div>

          <div className="flex gap-6 mt-4 md:mt-0">
            {footerLinks.map((link, index) => (
              <a
                key={index}
                href="#"
                className="text-gray-500 hover:text-cyan-400 transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

// Feature data
const features = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: "AI Question Generation",
    description: "Simply enter a topic and our AI instantly creates 25 relevant questions with detailed explanations."
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
    title: "Custom Quiz Creation",
    description: "Select exactly which questions to include in your quiz and customize difficulty levels."
  },
  
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
    ),
    title: "Easy Sharing",
    description: "Share quizzes via link, embed in websites, or export to LMS platforms with one click."
  }
];

// How It Works Steps
const steps = [
  {
    title: "Enter Your Topic",
    description: "Provide the subject you want to quiz on. Our AI will analyze it and generate relevant questions."
  },
  {
    title: "Select Your Questions",
    description: "Review the AI-generated questions and choose 15-20 that best fit your needs. Customize as needed."
  },
  {
    title: "Share with Participants",
    description: "Distribute your quiz via a unique link, embed code, or directly through our platform."
  },
  {
    title: "Analyze Results",
    description: "View real-time analytics as participants complete your quiz. Compare scores and identify knowledge gaps."
  }
];

// Stats
const stats = [
  { value: "10K+", label: "Quizzes Created" },
  { value: "500K+", label: "Questions Generated" },
  { value: "95%", label: "User Satisfaction" },
  { value: "24/7", label: "Support Available" }
];

// Footer Links
const footerLinks = ["Privacy Policy", "Terms of Service", "Contact", "Documentation"];

export default LandingPage;