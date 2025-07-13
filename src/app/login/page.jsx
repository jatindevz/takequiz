'use client'
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';

// Reusable Components
const AuthHeader = ({ username }) => (
    <Link className="absolute top-6 left-6 cursor-pointer" href="/">
        <div className="flex items-center">
            <span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                QuizMaster {username || 'User'}{' '}
                {username && (
                    <button className="cursor-pointer ml-2" onClick={() => signOut()}>
                        Logout
                    </button>
                )}
            </span>
        </div>
    </Link>
);

const AuthToggle = ({ isLogin, setIsLogin }) => (
    <div className="flex mb-8 bg-gray-800 rounded-lg p-1">
        <button
            className={`flex-1 py-3 rounded-md text-center font-medium transition-all ${isLogin
                    ? 'bg-gradient-to-r from-cyan-600/50 to-blue-600/50 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
            onClick={() => setIsLogin(true)}
        >
            Login
        </button>
        <button
            className={`flex-1 py-3 rounded-md text-center font-medium transition-all ${!isLogin
                    ? 'bg-gradient-to-r from-cyan-600/50 to-blue-600/50 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
            onClick={() => setIsLogin(false)}
        >
            Register
        </button>
    </div>
);

const PasswordField = ({
    label,
    value,
    onChange,
    showPassword,
    setShowPassword,
    forgotPassword = false,
    name
}) => (
    <div className="relative">
        <div className="flex justify-between items-center mb-2">
            <label className="block text-gray-400 text-sm">{label}</label>
            {forgotPassword && (
                <a href="#" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                    Forgot?
                </a>
            )}
        </div>
        <input
            type={showPassword ? "text" : "password"}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all pr-10"
            placeholder="••••••••"
            value={value}
            onChange={onChange}
            name={name}
        />
        <button
            type="button"
            className="absolute inset-y-0 top-6 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
        >
            {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
            ) : (
                <Eye className="h-5 w-5 text-gray-400" />
            )}
        </button>
    </div>
);

const InputField = ({
    label,
    type,
    placeholder,
    value,
    onChange,
    name
}) => (
    <div>
        <label className="block text-gray-400 text-sm mb-2">{label}</label>
        <input
            type={type}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            name={name}
        />
    </div>
);

const AuthButton = ({ children, onClick, disabled = false, isLoading }) => (
    <button
        onClick={onClick}
        disabled={disabled || isLoading}
        className={`w-full py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-cyan-500/20 ${disabled || isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
    >
        {isLoading ? (
            <span className="flex items-center justify-center">
                <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                </svg>
                Processing...
            </span>
        ) : (
            children
        )}
    </button>
);

const FormFooter = ({ text, linkText, onClick }) => (
    <div className="mt-6 text-center text-gray-500 text-sm">
        {text}{' '}
        <button
            onClick={onClick}
            className="text-cyan-400 hover:text-cyan-300 transition-colors"
        >
            {linkText}
        </button>
    </div>
);

const LoginForm = ({
    email,
    password,
    showPassword,
    setShowPassword,
    handleInputChange,
    handleLogin,
    isLoading,
    setIsLogin,
}) => (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            Welcome Back
        </h2>

        <form onSubmit={handleLogin}>
            <div className="space-y-5">
                <InputField
                    label="Email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={handleInputChange}
                    name="email"
                />

                <PasswordField
                    label="Password"
                    value={password}
                    onChange={handleInputChange}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    forgotPassword={true}
                    name="password"
                />

                <AuthButton onClick={handleLogin} disabled={isLoading} isLoading={isLoading}>
                    Login
                </AuthButton>
            </div>
        </form>

        <FormFooter
            text="Don't have an account?"
            linkText="Register"
            onClick={() => setIsLogin(false)}
        />
    </div>
);

const RegisterForm = ({
    username,
    email,
    password,
    confirmPassword,
    showPassword,
    showConfirmPassword,
    setShowPassword,
    setShowConfirmPassword,
    handleInputChange,
    handleRegister,
    isLoading,
    setIsLogin,
}) => (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            Create Account
        </h2>

        <form onSubmit={handleRegister}>
            <div className="space-y-5">
                <InputField
                    label="Full Name"
                    type="text"
                    placeholder="John Doe"
                    value={username}
                    onChange={handleInputChange}
                    name="username"
                />

                <InputField
                    label="Email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={handleInputChange}
                    name="email"
                />

                <PasswordField
                    label="Password"
                    value={password}
                    onChange={handleInputChange}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    name="password"
                />

                <PasswordField
                    label="Confirm Password"
                    value={confirmPassword}
                    onChange={handleInputChange}
                    showPassword={showConfirmPassword}
                    setShowPassword={setShowConfirmPassword}
                    name="confirmPassword"
                />

                <AuthButton onClick={handleRegister} disabled={isLoading} isLoading={isLoading}>
                    Create Account
                </AuthButton>
            </div>
        </form>

        <FormFooter
            text="Already have an account?"
            linkText="Login"
            onClick={() => setIsLogin(true)}
        />
    </div>
);

const AuthPages = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value);
        
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const { email, password } = formData;
            if (!email || !password) {
                throw new Error('Please fill in all fields');
            }

            const res = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            if (res?.ok) {
                router.push('/dashboard');
            } else {
                throw new Error(res?.error || 'Invalid credentials');
            }
        } catch (err) {
            setError(err.response?.data?.error || err.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const { username, email, password, confirmPassword } = formData;
            if (!username || !email || !password || !confirmPassword) {
                throw new Error('Please fill in all fields');
            }

            if (password !== confirmPassword) {
                throw new Error("Passwords don't match");
            }

            const res = await axios.post('/api/auth/register', {
                username,
                email,
                password,
            });

            if (res.data?.error) {
                throw new Error(res.data.error);
            }

            // Auto-login after registration
            await handleLogin(e);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4">
            <AuthHeader username={session?.user?.username} />

            <div className="w-full max-w-md">
                <AuthToggle isLogin={isLogin} setIsLogin={setIsLogin} />

                {error && (
                    <div className="mb-4 bg-red-900/50 border border-red-700 rounded-lg p-3 text-red-300 text-sm">
                        {error}
                    </div>
                )}

                {isLogin ? (
                    <LoginForm
                        email={formData.email}
                        password={formData.password}
                        showPassword={showPassword}
                        setShowPassword={setShowPassword}
                        handleInputChange={handleInputChange}
                        handleLogin={handleLogin}
                        isLoading={isLoading}
                        setIsLogin={setIsLogin}
                    />
                ) : (
                    <RegisterForm
                        username={formData.username}
                        email={formData.email}
                        password={formData.password}
                        confirmPassword={formData.confirmPassword}
                        showPassword={showPassword}
                        showConfirmPassword={showConfirmPassword}
                        setShowPassword={setShowPassword}
                        setShowConfirmPassword={setShowConfirmPassword}
                        handleInputChange={handleInputChange}
                        handleRegister={handleRegister}
                        isLoading={isLoading}
                        setIsLogin={setIsLogin}
                    />
                )}
            </div>
        </div>
    );
};

export default AuthPages;