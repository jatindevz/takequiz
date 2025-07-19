'use client'
import axios from 'axios';
import React, { useState, useEffect, use } from 'react';
import { FaChartLine, FaUserGraduate, FaTrophy, FaSearch, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

// Mock data for testing
const mockStudents = [
    { id: 'ST001', name: 'Alice Johnson', email: 'alice.johnson@email.com', score: 92, date: '2025-07-15' },
    { id: 'ST002', name: 'Bob Smith', email: 'bob.smith@email.com', score: 78, date: '2025-07-16' },
    { id: 'ST003', name: 'Charlie Brown', email: 'charlie.brown@email.com', score: 85, date: '2025-07-14' },
    { id: 'ST004', name: 'Diana Prince', email: 'diana.prince@email.com', score: 96, date: '2025-07-17' },
    { id: 'ST005', name: 'Edward Wilson', email: 'edward.wilson@email.com', score: 67, date: '2025-07-13' },
    { id: 'ST006', name: 'Fiona Davis', email: 'fiona.davis@email.com', score: 89, date: '2025-07-18' },
    { id: 'ST007', name: 'George Miller', email: 'george.miller@email.com', score: 73, date: '2025-07-12' },
    { id: 'ST008', name: 'Hannah Garcia', email: 'hannah.garcia@email.com', score: 94, date: '2025-07-19' },
    { id: 'ST009', name: 'Ian Rodriguez', email: 'ian.rodriguez@email.com', score: 81, date: '2025-07-11' },
    { id: 'ST010', name: 'Julia Martinez', email: 'julia.martinez@email.com', score: 88, date: '2025-07-18' },
    { id: 'ST011', name: 'Kevin Lee', email: 'kevin.lee@email.com', score: 59, date: '2025-07-16' },
    { id: 'ST012', name: 'Laura Thompson', email: 'laura.thompson@email.com', score: 91, date: '2025-07-17' },
    { id: 'ST013', name: 'Michael Chen', email: 'michael.chen@email.com', score: 76, date: '2025-07-15' },
    { id: 'ST014', name: 'Nina Patel', email: 'nina.patel@email.com', score: 83, date: '2025-07-14' },
    { id: 'ST015', name: 'Oscar Kim', email: 'oscar.kim@email.com', score: 95, date: '2025-07-19' }
];

const ResultsPage = ({ params }) => {
    const { quizid } = use(params);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'score', direction: 'desc' });
    const [stats, setStats] = useState({
        averageScore: 0,
        highestScore: 0,
        participation: 0
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [questionCount, setQuestionCount] = useState(10); // Set default value

    useEffect(() => {
        const fetchResults = async () => {
            try {
                setLoading(true);
                setError(null);

                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 1500));

                const res = await axios.get("/api/submitresult", { params: { quizid } });

                // Use mock data if API fails or returns empty
                const studentsData = res.data?.students && res.data.students.length > 0
                    ? res.data.students
                    : mockStudents;

                const questionCountData = res.data?.questionCount || 100; // Default to 100 for percentage calculation

                setQuestionCount(questionCountData);

                // Calculate percentages immediately when setting students
                const studentsWithPercentage = studentsData.map(student => ({
                    ...student,
                    percentage: Math.round((student.score / questionCountData) * 100)
                }));

                setStudents(studentsWithPercentage);

            } catch (err) {
                console.error('Error fetching results:', err);
                // Use mock data as fallback with default question count
                const studentsWithPercentage = mockStudents.map(student => ({
                    ...student,
                    percentage: Math.round((student.score / questionCount) * 100)
                }));
                setStudents(studentsWithPercentage);
                setError(null); // Don't show error if using fallback data
            } finally {
                setLoading(false);
            }
        };

        if (quizid) {
            fetchResults();
        }
    }, [quizid]);

    // Calculate stats whenever students data changes
    useEffect(() => {
        if (students.length > 0) {
            const percentages = students.map(s => s.percentage);
            const average = percentages.reduce((a, b) => a + b, 0) / percentages.length;
            const highest = Math.max(...percentages);

            setStats({
                averageScore: average,
                highestScore: highest,
                participation: students.length,
            });
        } else {
            setStats({
                averageScore: 0,
                highestScore: 0,
                participation: 0,
            });
        }
    }, [students]);

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortedData = () => {
        const sortableData = [...students];
        if (sortConfig.key && sortableData.length > 0) {
            sortableData.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                // Handle string comparison for name sorting
                if (typeof aValue === 'string') {
                    aValue = aValue.toLowerCase();
                    bValue = bValue.toLowerCase();
                }

                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableData;
    };

    const getFilteredData = () => {
        const sortedData = getSortedData();
        if (!searchTerm.trim()) {
            return sortedData;
        }

        const searchLower = searchTerm.toLowerCase().trim();
        return sortedData.filter(student =>
            (student.name && student.name.toLowerCase().includes(searchLower)) ||
            (student.id && student.id.toLowerCase().includes(searchLower)) ||
            (student.email && student.email.toLowerCase().includes(searchLower))
        );
    };

    const getPaginatedData = () => {
        const filtered = getFilteredData();
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filtered.slice(startIndex, endIndex);
    };

    const getTotalPages = () => {
        const filteredLength = getFilteredData().length;
        return Math.max(1, Math.ceil(filteredLength / itemsPerPage));
    };

    const handlePageChange = (page) => {
        const totalPages = getTotalPages();
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNext = () => {
        const totalPages = getTotalPages();
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const getPageNumbers = () => {
        const totalPages = getTotalPages();
        const pageNumbers = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            let startPage = Math.max(1, currentPage - 2);
            let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

            if (endPage - startPage < maxVisiblePages - 1) {
                startPage = Math.max(1, endPage - maxVisiblePages + 1);
            }

            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i);
            }
        }

        return pageNumbers;
    };

    // Reset to first page when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // Reset to valid page when itemsPerPage changes
    useEffect(() => {
        const totalPages = getTotalPages();
        if (currentPage > totalPages) {
            setCurrentPage(Math.max(1, totalPages));
        }
    }, [itemsPerPage, students, searchTerm]);

    const renderSortIcon = (key) => {
        if (sortConfig.key !== key) return <FaSort className="text-gray-400 ml-1" />;
        return sortConfig.direction === 'asc' ?
            <FaSortUp className="text-blue-500 ml-1" /> :
            <FaSortDown className="text-blue-500 ml-1" />;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 text-lg">Loading results...</p>
                    <p className="mt-2 text-gray-500 text-sm">Please wait while we fetch student performance data</p>
                </div>
            </div>
        );
    }

    if (error && students.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center bg-red-50 border border-red-200 rounded-xl p-8 max-w-md">
                    <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaChartLine className="text-red-500 text-2xl" />
                    </div>
                    <h2 className="text-xl font-bold text-red-700 mb-2">Error Loading Results</h2>
                    <p className="text-gray-700 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-10 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-3">
                        <FaChartLine className="text-blue-600" />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                            Quiz Results Dashboard
                        </span>
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Comprehensive analysis of student performance across all quizzes
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white rounded-xl shadow-md p-6 border border-blue-100">
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-100 p-3 rounded-full">
                                <FaUserGraduate className="text-blue-600 text-xl" />
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Participants</p>
                                <p className="text-2xl font-bold">{stats.participation}</p>
                            </div>
                        </div>
                        <div className="mt-4 h-2 bg-blue-50 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                                style={{ width: '100%' }}
                            ></div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6 border border-green-100">
                        <div className="flex items-center gap-4">
                            <div className="bg-green-100 p-3 rounded-full">
                                <FaChartLine className="text-green-600 text-xl" />
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Average Score</p>
                                <p className="text-2xl font-bold">{stats.averageScore.toFixed(1)}%</p>
                            </div>
                        </div>
                        <div className="mt-4 h-2 bg-green-50 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-green-500 to-teal-500 rounded-full"
                                style={{ width: `${Math.min(100, Math.max(0, stats.averageScore))}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6 border border-yellow-100">
                        <div className="flex items-center gap-4">
                            <div className="bg-yellow-100 p-3 rounded-full">
                                <FaTrophy className="text-yellow-600 text-xl" />
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Top Score</p>
                                <p className="text-2xl font-bold">{stats.highestScore}%</p>
                            </div>
                        </div>
                        <div className="mt-4 h-2 bg-yellow-50 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
                                style={{ width: '100%' }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Search and Controls */}
                <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="relative w-full sm:w-auto">
                        <input
                            type="text"
                            placeholder="Search students..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>

                    <div className="flex gap-3">
                        <select
                            className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={itemsPerPage}
                            onChange={(e) => {
                                setItemsPerPage(parseInt(e.target.value));
                                setCurrentPage(1);
                            }}
                        >
                            <option value={5}>5 per page</option>
                            <option value={10}>10 per page</option>
                            <option value={25}>25 per page</option>
                            <option value={50}>50 per page</option>
                        </select>
                    </div>
                </div>

                {/* Results Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSort('id')}
                                    >
                                        <div className="flex items-center">
                                            Student ID
                                            {renderSortIcon('id')}
                                        </div>
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSort('name')}
                                    >
                                        <div className="flex items-center">
                                            Name
                                            {renderSortIcon('name')}
                                        </div>
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSort('score')}
                                    >
                                        <div className="flex items-center">
                                            Score
                                            {renderSortIcon('score')}
                                        </div>
                                    </th>

                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Performance
                                    </th>

                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {getPaginatedData().map((student, index) => (
                                    <tr key={student.id || student._id || index} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {student.id || `ST${((currentPage - 1) * itemsPerPage + index + 1).toString().padStart(2, '0')}`}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-800 font-bold">
                                                    {student.name ? student.name.charAt(0).toUpperCase() : 'N'}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{student.name || 'N/A'}</div>
                                                    <div className="text-sm text-gray-500">{student.email || 'N/A'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold">
                                                <span className="text-gray-800">
                                                    {student.score || 0}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${(student.percentage || 0) >= 80 ? 'bg-green-500' :
                                                            (student.percentage || 0) >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                                            }`}
                                                        style={{ width: `${Math.min(100, Math.max(0, student.percentage || 0))}%` }}
                                                    ></div>
                                                </div>
                                                <span className="ml-2 text-xs text-gray-500">
                                                    {student.percentage || 0}%
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {getPaginatedData().length === 0 && getFilteredData().length === 0 && students.length > 0 && (
                        <div className="text-center py-12">
                            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaSearch className="text-gray-400 text-xl" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">No results found</h3>
                            <p className="text-gray-500 max-w-md mx-auto">
                                We couldn't find any students matching your search. Try different keywords.
                            </p>
                        </div>
                    )}

                    {students.length === 0 && !loading && (
                        <div className="text-center py-12">
                            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaUserGraduate className="text-gray-400 text-xl" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">No students data available</h3>
                            <p className="text-gray-500 max-w-md mx-auto">
                                There are no student results to display for this quiz.
                            </p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {getFilteredData().length > 0 && (
                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between bg-white rounded-xl shadow-sm p-4 gap-4">
                        <div className="text-sm text-gray-700">
                            Showing <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span> to{' '}
                            <span className="font-medium">
                                {Math.min(currentPage * itemsPerPage, getFilteredData().length)}
                            </span> of{' '}
                            <span className="font-medium">{getFilteredData().length}</span> results
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handlePrevious}
                                disabled={currentPage === 1}
                                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${currentPage === 1
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                Previous
                            </button>

                            {getPageNumbers().map((pageNum) => (
                                <button
                                    key={pageNum}
                                    onClick={() => handlePageChange(pageNum)}
                                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${pageNum === currentPage
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            ))}

                            <button
                                onClick={handleNext}
                                disabled={currentPage === getTotalPages()}
                                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${currentPage === getTotalPages()
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResultsPage;