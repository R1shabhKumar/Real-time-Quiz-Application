import React, { useState } from "react";
import { AcademicCapIcon, UserIcon } from '@heroicons/react/solid';
import { FaGoogle, FaGithub, FaLinkedin } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { Axios } from "../config/AxiosHelper"; // Import Axios from AxiosHelper.js

const HomePage = () => {
    const [showRole, setShowRole] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedPage, setSelectedPage] = useState(null);
    const [showVisualizerOptions, setShowVisualizerOptions] = useState(false); // State to show visualizer options
    const navigate = useNavigate(); // Initialize useNavigate

    const handlePageSelection = (page) => {
        if (page === 'chat') {
            toast.error('Under development'); // Display toaster message
            return; // Do not proceed further
        }
        if (page === 'visualizer') {
            setShowVisualizerOptions(true); // Show visualizer options
            return;
        }
        setSelectedPage(page);
        setShowRole(true); // Automatically show role selection
    };

    const handleRoleSelection = (role) => {
        console.log(`Selected role: ${role}`);
        if (selectedPage === 'quiz' && role === 'student') {
            navigate('/'); // Navigate to JoinQuiz page
        } else if (role === 'educator') {
            setShowLogin(true);
        }
    };

    const handleLoginClick = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            toast.error('Please enter a valid email address.');
            return;
        }

        if (!password) {
            toast.error('Password cannot be empty.');
            return;
        }

        try {
            const response = await Axios.post('/api/login', { email, password });

            if (response.status === 200) {
                const data = response.data;
                toast.success('Login successful!');
                console.log('User data:', data);

                localStorage.setItem("email", email); // Store email in local storage
                navigate('/dashboard'); // Navigate to dashboard on successful login
            } else {
                toast.error(response.data.message || 'Login failed.');
            }
        } catch (error) {
            console.error('Error during login:', error);
            toast.error('An error occurred. Please try again.');
        }
    };

    const handleRegisterClick = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            toast.error('Please enter a valid email address.');
            return;
        }

        if (!password) {
            toast.error('Password cannot be empty.');
            return;
        }

        try {
            const response = await Axios.post('/api/register', { email, password });

            if (response.status === 200) {
                toast.success('Registration successful!');
                setEmail('');
                setPassword('');
            } else {
                toast.error(response.data.message || 'Registration failed.');
            }
        } catch (error) {
            console.error('Error during registration:', error);
            toast.error('An error occurred. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-400 via-blue-400 to-blue-400">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8">
                SELECT ONE
            </h1>
            {!selectedPage && !showVisualizerOptions && (
                <div className="flex space-x-8">
                    {/* Chatting Page Icon */}
                    <a
                        onClick={() => handlePageSelection('chat')}
                        className="flex flex-col items-center cursor-pointer group"
                    >
                        <div className="p-6 bg-blue-500 text-white rounded-full shadow-lg transform transition duration-300 group-hover:scale-110 group-hover:bg-blue-600">
                            <div className="text-4xl">💬</div>
                        </div>
                        <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600">
                            Chat Page
                        </p>
                    </a>

                    {/* Quiz Page Icon */}
                    <a
                        onClick={() => handlePageSelection('quiz')}
                        className="flex flex-col items-center cursor-pointer group"
                    >
                        <div className="p-6 bg-green-500 text-white rounded-full shadow-lg transform transition duration-300 group-hover:scale-110 group-hover:bg-green-600">
                            <div className="text-4xl">❓</div>
                        </div>
                        <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300 group-hover:text-green-600">
                            Quiz Page
                        </p>
                    </a>

                    {/* Visualizer Icon */}
                    <a
                        onClick={() => handlePageSelection('visualizer')}
                        className="flex flex-col items-center cursor-pointer group"
                    >
                        <div className="p-6 bg-purple-500 text-white rounded-full shadow-lg transform transition duration-300 group-hover:scale-110 group-hover:bg-purple-600">
                            <div className="text-4xl">📦</div>
                        </div>
                        <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300 group-hover:text-purple-600">
                            Visualizer
                        </p>
                    </a>
                </div>
            )}

            {/* Visualizer Options */}
            {showVisualizerOptions && (
                <div className="flex flex-col items-center space-y-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Choose a Visualizer
                    </h2>
                    <div className="flex space-x-8">
                        <button
                            onClick={() => navigate('/compress')}
                            className="px-6 py-3 bg-purple-500 text-white rounded-lg font-semibold shadow-lg hover:bg-purple-600 transition duration-300"
                        >
                            Huffman Coding
                        </button>
                        <button
                            onClick={() => navigate('/queens')}
                            className="px-6 py-3 bg-purple-500 text-white rounded-lg font-semibold shadow-lg hover:bg-purple-600 transition duration-300"
                        >
                            N Queens Visualizer
                        </button>
                    </div>
                </div>
            )}

            {showRole && (
                <div className="text-center mt-12">
                    <h1 className="text-2xl mb-5">Select Your Role</h1>
                    <div className="flex justify-center gap-5">
                        <button
                            className="flex items-center gap-2 px-5 py-2 text-white bg-blue-500 rounded hover:bg-blue-700 transition-colors"
                            onClick={() => handleRoleSelection('educator')}
                        >
                            <AcademicCapIcon className="w-5 h-5" />
                            I am an Educator
                        </button>
                        <button
                            className="flex items-center gap-2 px-5 py-2 text-white bg-blue-500 rounded hover:bg-blue-700 transition-colors"
                            onClick={() => handleRoleSelection('student')}
                        >
                            <UserIcon className="w-5 h-5" />
                            I am a Student
                        </button>
                    </div>
                    {showLogin && (
                        <div className="mt-10 flex items-center justify-center">
                            <div className="border p-8 w-full max-w-md rounded-lg bg-white dark:bg-gray-900 shadow-lg transform transition duration-500 hover:scale-105">
                                <h2 className="text-xl font-bold text-center mb-6 text-gray-800 dark:text-white">
                                    Educator Login/Register
                                </h2>
                                <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none dark:bg-gray-800 dark:text-white hover:border-blue-500 hover:shadow-md transition duration-300"
                                            placeholder="Enter your email"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            id="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none dark:bg-gray-800 dark:text-white hover:border-blue-500 hover:shadow-md transition duration-300"
                                            placeholder="Enter your password"
                                            required
                                        />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex gap-4">
                                            <FaGoogle className="text-red-500 w-6 h-6 cursor-pointer hover:scale-110 transition-transform" />
                                            <FaGithub className="text-gray-800 dark:text-white w-6 h-6 cursor-pointer hover:scale-110 transition-transform" />
                                            <FaLinkedin className="text-blue-700 w-6 h-6 cursor-pointer hover:scale-110 transition-transform" />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleLoginClick}
                                            className="w-1/3 bg-gradient-to-r from-blue-500 to-blue-700 text-white py-1 px-2 rounded-lg font-semibold shadow-md hover:from-blue-600 hover:to-blue-800 transform transition duration-300"
                                        >
                                            Login
                                        </button>
                                    </div>
                                </form>
                                <div className="text-center my-4 text-gray-600 dark:text-gray-400">OR</div>
                                <button
                                    className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-2 px-4 rounded-lg font-semibold shadow-md hover:from-green-600 hover:to-green-800 transform transition duration-300"
                                    onClick={handleRegisterClick}
                                >
                                    Register
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default HomePage;