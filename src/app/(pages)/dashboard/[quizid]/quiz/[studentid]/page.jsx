'use client'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, use } from 'react';
import { FaCheckCircle, FaTimesCircle, FaChevronRight, FaChevronLeft, FaClock, FaUser, FaQuestionCircle, FaSave, FaRedo, FaEye, FaEyeSlash, FaHome } from 'react-icons/fa';

const QuizPage = ({ params }) => {
    const { quizid, studentid } = use(params);
    const router = useRouter();
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [showReview, setShowReview] = useState(false);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);
    const [quizTitle, setQuizTitle] = useState('');
    const [timeLeft, setTimeLeft] = useState(null);
    const [quizDuration, setQuizDuration] = useState(null);
    const [autoSaved, setAutoSaved] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [error, setError] = useState(null);
    const [studentName, setStudentName] = useState('');
    const [quizStartTime, setQuizStartTime] = useState(null);
    const [resultSubmitted, setResultSubmitted] = useState(false);

    // Mock API functions for demonstration
    const mockFetchQuiz = async (quizid) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        return {
            title: "JavaScript Fundamentals Quiz",
            duration: 30, // 30 minutes
        };
    };



    useEffect(() => {
        const fetchQuizQuestions = async () => {
            try {
                setError(null);
                const data = await mockFetchQuiz(quizid);
                const res = await axios.get("/api/getquiz", { params: { quizid } });

                const questionsWithUserAnswers = res.data.quizQue.map(q => ({
                    ...q,
                    userAnswer: null,
                    timeSpent: 0
                }));

                setQuestions(questionsWithUserAnswers);
                setQuizTitle(res.data.topic);
                setQuizDuration(data.duration);
                setTimeLeft(data.duration * 60); // Convert to seconds
                setQuizStartTime(new Date());
                setStudentName(`Student ${studentid}`);
                setLoading(false);

            } catch (error) {
                console.error("Error fetching quiz questions:", error);
                setError("Failed to load quiz. Please try again.");
                setLoading(false);
            }
        };

        fetchQuizQuestions();
    }, [quizid, studentid]);

    // Timer effect
    useEffect(() => {
        if (timeLeft > 0 && !submitted) {
            const timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && !submitted) {
            // Auto-submit when time runs out
            handleAutoSubmit();
        }
    }, [timeLeft, submitted]);

    const handleAutoSubmit = () => {
        const correctAnswers = questions.filter(q => q.userAnswer === q.correctAnswer).length;
        setScore(correctAnswers);
        setSubmitted(true);
        setShowReview(true);
    };

    const handleSubmitResult = async () => {
        if (resultSubmitted) return;
        if (!quizid || !studentid || score === null) {
            console.error("Missing submission data:", { quizid, studentid, score });
            return alert("Submission data is incomplete");
        }

        try {
            const res = await axios.post("/api/submitresult", { quizid, studentid, score });
            if (res.status === 200) {
                setResultSubmitted(true);
                alert(res.data.message || "Result submitted successfully!");
                router.replace(`/dashboard/${quizid}/quiz/result`);

            } else {
                alert("Unexpected error. Please try again later.");
            }
        } catch (error) {
            const errorMsg = error.response
                ? error.response.data?.message || "Server error occurred."
                : error.request
                    ? "No response from server. Check internet connection."
                    : "Something went wrong. Please try again.";
            alert(errorMsg);
        }
    };

    const handleAnswerSelect = (optionKey) => {
        if (submitted) return;

        const updatedQuestions = [...questions];
        updatedQuestions[currentQuestionIndex].userAnswer = optionKey;
        setQuestions(updatedQuestions);
    };

    const handleSubmit = () => {
        if (!submitted) {
            setShowConfirmDialog(true);
        } else {
            setShowReview(!showReview);
        }
    };

    const confirmSubmit = () => {
        const correctAnswers = questions.filter(q => q.userAnswer === q.correctAnswer).length;
        setScore(correctAnswers);
        setSubmitted(true);
        setShowReview(true);
        setShowConfirmDialog(false);
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };


    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getScoreColor = () => {
        const percentage = (score / questions.length) * 100;
        if (percentage >= 80) return 'text-green-400';
        if (percentage >= 60) return 'text-yellow-400';
        return 'text-red-400';
    };

    const getScoreMessage = () => {
        const percentage = (score / questions.length) * 100;
        if (percentage >= 90) return "Excellent! 🏆";
        if (percentage >= 80) return "Great job! 🎉";
        if (percentage >= 70) return "Good work! 👍";
        if (percentage >= 60) return "Not bad! 📈";
        return "Keep learning! 📚";
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-500 mx-auto"></div>
                    <p className="mt-4 text-gray-400 text-lg">Loading quiz questions...</p>
                    <p className="mt-2 text-gray-500 text-sm">Please wait while we prepare your quiz</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
                <div className="text-center bg-red-900/20 border border-red-500 rounded-xl p-8">
                    <FaTimesCircle className="text-red-500 text-6xl mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-red-400 mb-2">Error Loading Quiz</h2>
                    <p className="text-gray-300 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questions.length - 1;
    const allAnswered = questions.every(q => q.userAnswer);
    const answeredCount = questions.filter(q => q.userAnswer).length;
    const unansweredCount = questions.length - answeredCount;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-6 px-2 sm:px-4">
            <div className="max-w-6xl mx-auto">
                {/* Confirmation Dialog */}
                {showConfirmDialog && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-md mx-4">
                            <h3 className="text-lg font-bold text-white mb-4">Confirm Submission</h3>
                            <p className="text-gray-300 mb-4">
                                Are you sure you want to submit the quiz? You have answered {answeredCount} out of {questions.length} questions.
                                {unansweredCount > 0 && (
                                    <span className="text-yellow-400"> {unansweredCount} questions remain unanswered.</span>
                                )}
                            </p>
                            <div className="flex gap-4">
                                <button
                                    onClick={confirmSubmit}
                                    className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white py-2 px-4 rounded-lg transition-colors"
                                >
                                    Yes, Submit
                                </button>
                                <button
                                    onClick={() => setShowConfirmDialog(false)}
                                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Quiz Header */}
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 sm:p-6 mb-6">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div className="flex-1">
                            <h1 className="text-2xl sm:text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                                {quizTitle}
                            </h1>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                                <div className="flex items-center gap-2">
                                    <FaUser />
                                    <span>{studentName}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaQuestionCircle />
                                    <span>Quiz ID: {quizid}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaQuestionCircle />
                                    <span>{questions.length} Questions</span>
                                </div>
                            </div>
                        </div>

                        {/* Timer and Status */}
                        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                            {!submitted && timeLeft !== null && (
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${timeLeft < 300 ? 'bg-red-900/30 text-red-400' : 'bg-cyan-900/30 text-cyan-400'}`}>
                                    <FaClock />
                                    <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
                                </div>
                            )}

                            {autoSaved && (
                                <div className="flex items-center gap-2 text-green-400 text-sm">
                                    <FaSave />
                                    <span>Progress saved</span>
                                </div>
                            )}

                            {submitted && (
                                <div className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-xl px-4 py-3">
                                    <p className="text-xl font-bold text-center">
                                        Score: <span className={getScoreColor()}>{score}</span>/{questions.length}
                                    </p>
                                    <p className="text-xs text-gray-400 text-center mt-1">
                                        {getScoreMessage()}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                        <div className="flex justify-between text-sm text-gray-400 mb-2">
                            <span>Progress: {answeredCount}/{questions.length}</span>
                            <span>{Math.round((answeredCount / questions.length) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(answeredCount / questions.length) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Question Card */}
                <div className="relative mb-6">
                    <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-3xl blur-xl z-0"></div>

                    <div className="relative bg-gray-800/50 border border-gray-700 rounded-2xl p-4 sm:p-6 shadow-xl z-10">
                        {/* Question Header */}
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-start flex-1">
                                <div className="flex-shrink-0 mr-4 mt-1">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 flex items-center justify-center">
                                        <span className="font-bold text-white">{currentQuestionIndex + 1}</span>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-lg sm:text-xl font-medium text-white mb-2">
                                        {currentQuestion.question}
                                    </h2>
                                    <div className="text-sm text-gray-400">
                                        Question {currentQuestionIndex + 1} of {questions.length}
                                    </div>
                                </div>
                            </div>

                            {currentQuestion.userAnswer && !submitted && (
                                <div className="flex items-center gap-2 text-green-400 text-sm">
                                    <FaCheckCircle />
                                    <span>Answered</span>
                                </div>
                            )}
                        </div>

                        {/* Options */}
                        <div className="space-y-3 mb-8">
                            {Object.entries(currentQuestion.options).map(([key, value]) => {
                                const isSelected = currentQuestion.userAnswer === key;
                                const isCorrect = key === currentQuestion.correctAnswer;
                                const showResult = submitted && showReview;

                                return (
                                    <div
                                        key={key}
                                        onClick={() => handleAnswerSelect(key)}
                                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${isSelected
                                                ? showResult
                                                    ? isCorrect
                                                        ? "border-green-500 bg-green-900/20 shadow-green-500/20 shadow-lg"
                                                        : "border-red-500 bg-red-900/20 shadow-red-500/20 shadow-lg"
                                                    : "border-cyan-500 bg-cyan-900/20 shadow-cyan-500/20 shadow-lg"
                                                : "border-gray-700 hover:border-gray-600 hover:bg-gray-800/30"
                                            } ${showResult && isCorrect && !isSelected ? "border-green-500/50 bg-green-900/10" : ""}`}
                                    >
                                        <div className="flex items-center">
                                            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4 font-bold text-white transition-all ${isSelected
                                                    ? showResult
                                                        ? isCorrect
                                                            ? "bg-green-500"
                                                            : "bg-red-500"
                                                        : "bg-cyan-500"
                                                    : showResult && isCorrect
                                                        ? "bg-green-500"
                                                        : "bg-gray-700"
                                                }`}>
                                                {showResult && isCorrect && !isSelected ? (
                                                    <FaCheckCircle className="text-sm" />
                                                ) : (
                                                    key
                                                )}
                                            </div>
                                            <p className="text-gray-300 flex-1">{value}</p>

                                            {showResult && isSelected && (
                                                <div className="ml-4">
                                                    {isCorrect ? (
                                                        <FaCheckCircle className="text-green-500 text-xl" />
                                                    ) : (
                                                        <FaTimesCircle className="text-red-500 text-xl" />
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Explanation */}
                        {submitted && showReview && (
                            <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4 mb-6 animate-fadeIn">
                                <div className="flex items-center mb-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center mr-3">
                                        <span className="text-sm text-white font-bold">?</span>
                                    </div>
                                    <h3 className="font-semibold text-purple-400">Explanation</h3>
                                </div>
                                <p className="text-gray-300 pl-11 leading-relaxed">{currentQuestion.explanation}</p>
                            </div>
                        )}

                        {/* Navigation Controls */}
                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                            <button
                                onClick={handlePrevQuestion}
                                disabled={currentQuestionIndex === 0}
                                className={`flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all ${currentQuestionIndex === 0
                                        ? "text-gray-600 cursor-not-allowed bg-gray-800/50"
                                        : "text-gray-400 hover:text-white hover:bg-gray-700 border border-gray-700"
                                    }`}
                            >
                                <FaChevronLeft className="mr-2" />
                                Previous
                            </button>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleNextQuestion}
                                    disabled={isLastQuestion}
                                    className={`flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all ${isLastQuestion
                                            ? "text-gray-600 cursor-not-allowed bg-gray-800/50"
                                            : "text-gray-400 hover:text-white hover:bg-gray-700 border border-gray-700"
                                        }`}
                                >
                                    Next
                                    <FaChevronRight className="ml-2" />
                                </button>

                                <button
                                    onClick={handleSubmit}
                                    disabled={!allAnswered && !submitted}
                                    className={`px-8 py-3 rounded-lg font-medium flex items-center gap-2 transition-all ${submitted
                                            ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500"
                                            : allAnswered
                                                ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500"
                                                : "bg-gray-700 text-gray-500 cursor-not-allowed"
                                        }`}
                                >
                                    {submitted ? (
                                        <>
                                            {showReview ? <FaEyeSlash /> : <FaEye />}
                                            {showReview ? "Hide Explanations" : "Show Explanations"}
                                        </>
                                    ) : (
                                        <>
                                            Submit Quiz
                                            <FaCheckCircle />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Question Navigation Dots */}
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {questions.map((question, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentQuestionIndex(index)}
                            className={`w-12 h-12 rounded-full flex items-center justify-center font-medium transition-all ${index === currentQuestionIndex
                                    ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/30"
                                    : questions[index].userAnswer
                                        ? submitted && showReview
                                            ? questions[index].userAnswer === questions[index].correctAnswer
                                                ? "bg-green-900/30 text-green-400 border border-green-500/30"
                                                : "bg-red-900/30 text-red-400 border border-red-500/30"
                                            : "bg-cyan-900/30 text-cyan-400 border border-cyan-500/30"
                                        : "bg-gray-700 text-gray-400 border border-gray-600"
                                }`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>

                {/* Action Buttons */}
                {submitted && (
                    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                            <div className="text-center sm:text-left">
                                <h3 className="text-lg font-semibold text-white mb-2">Quiz Completed!</h3>
                                <p className="text-gray-400">Your score: <span className={getScoreColor()}>{score}/{questions.length}</span></p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleSubmitResult}
                                    disabled={isSubmitting || resultSubmitted}
                                    className={`flex items-center px-6 py-3 rounded-lg transition-colors ${resultSubmitted
                                            ? "bg-green-600 text-white cursor-not-allowed"
                                            : isSubmitting
                                                ? "bg-cyan-400 text-white cursor-wait"
                                                : "bg-cyan-500 hover:bg-cyan-600 text-white"
                                        }`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                                            Submitting...
                                        </>
                                    ) : resultSubmitted ? (
                                        <>
                                            <FaCheckCircle className="mr-2" />
                                            Submitted
                                        </>
                                    ) : (
                                        <>
                                            <FaSave className="mr-2" />
                                            Submit Result
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuizPage;