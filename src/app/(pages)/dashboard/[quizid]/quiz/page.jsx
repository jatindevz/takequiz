'use client'

import React, { useState } from 'react';
import { use } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const QuizDetailsPage =  ({ params }) => {
    const { quizid } = use(params);
    const router = useRouter();
    const [form, setForm] = useState({
        name: '',
        email: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const res = await axios.post('/api/getquiz', {
                quizid,
                name: form.name,
                email: form.email
            });

            console.log(res.data);

            router.push(`/dashboard/${quizid.toString()}/quiz/${res.data.studentid}`);

        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    {quizid}
                    <h1 className="text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                        Almost There!
                    </h1>
                    <p className="text-gray-400">
                        Enter your details to start the quiz
                    </p>
                </div>

                <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl"></div>
                    <div className="relative bg-gray-800/50 border border-gray-700 rounded-2xl p-8 shadow-xl">
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-6">
                                {error && (
                                    <div className="bg-red-900/50 border border-red-700 rounded-lg p-3 text-red-300 text-sm">
                                        {error}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-gray-400 text-sm mb-2">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <input
                                            name="name"
                                            type="text"
                                            value={form.name}
                                            onChange={handleChange}
                                            placeholder="John Doe"
                                            className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 pl-11 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                                            required
                                        />
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-400 text-sm mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <input
                                            name="email"
                                            type="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            placeholder="your@email.com"
                                            className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 pl-11 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                                            required
                                        />
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>



                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${isSubmitting
                                            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500 shadow-lg hover:shadow-cyan-500/20'
                                        }`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Starting Quiz...
                                        </>
                                    ) : (
                                        'Start Quiz Now'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="mt-8 text-center text-gray-500 text-sm">
                    <p>Your information is securely stored and will only be used for quiz results.</p>
                </div>
            </div>
        </div>
    );
};

export default QuizDetailsPage;