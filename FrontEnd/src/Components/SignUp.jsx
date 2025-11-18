import React, { useRef, useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();

    const serverURL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';

    const validateForm = () => {
        const newErrors = {};
        const name = nameRef.current.value.trim();
        const email = emailRef.current.value.trim();
        const password = passwordRef.current.value;

        // Name validation
        if (!name) {
            newErrors.name = 'Name is required';
        } else if (name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        // Email validation
        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email is invalid';
        }

        // Password validation
        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess('');

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const userData = {
                name: nameRef.current.value.trim(),
                email: emailRef.current.value.trim(),
                password: passwordRef.current.value
            };

            const response = await fetch(`${serverURL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(data.message || 'Account created successfully!');
                // Clear form
                nameRef.current.value = '';
                emailRef.current.value = '';
                passwordRef.current.value = '';
                setErrors({});

                // Redirect to login after 2 seconds
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setErrors({ submit: data.error || 'Something went wrong!' });
            }
        } catch (error) {
            setErrors({ submit: 'Network error. Please try again.' });
            console.error('Signup error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field) => {
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
        if (errors.submit) {
            setErrors(prev => ({
                ...prev,
                submit: ''
            }));
        }
        if (success) {
            setSuccess('');
        }
    };

    return (
        <div className="min-h-screen  from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-indigo-600 rounded-full flex items-center justify-center">
                        <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Create your account
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Sign up to get started
                    </p>
                </div>

                {/* Success Message */}
                {success && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                            <p className="text-green-800 text-sm">{success}</p>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {errors.submit && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center">
                            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                            <p className="text-red-800 text-sm">{errors.submit}</p>
                        </div>
                    </div>
                )}

                {/* Sign Up Form */}
                <div className="bg-white py-8 px-6 shadow-xl rounded-2xl sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Name Field */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Full name
                            </label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    ref={nameRef}
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    onChange={() => handleInputChange('name')}
                                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${errors.name ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter your full name"
                                />
                                {errors.name && (
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <AlertCircle className="h-5 w-5 text-red-500" />
                                    </div>
                                )}
                            </div>
                            {errors.name && (
                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    ref={emailRef}
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    onChange={() => handleInputChange('email')}
                                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${errors.email ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter your email"
                                />
                                {errors.email && (
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <AlertCircle className="h-5 w-5 text-red-500" />
                                    </div>
                                )}
                            </div>
                            {errors.email && (
                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    ref={passwordRef}
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    onChange={() => handleInputChange('password')}
                                    className={`block w-full pl-10 pr-10 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${errors.password ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    placeholder="Create a password"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                                {errors.password && (
                                    <div className="absolute inset-y-0 right-8 pr-3 flex items-center">
                                        <AlertCircle className="h-5 w-5 text-red-500" />
                                    </div>
                                )}
                            </div>
                            {errors.password && (
                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
                            >
                                {isLoading ? (
                                    <div className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating account...
                                    </div>
                                ) : (
                                    'Sign up'
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Sign in link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to={'/login'} className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;