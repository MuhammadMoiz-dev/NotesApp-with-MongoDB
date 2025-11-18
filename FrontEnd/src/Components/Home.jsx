import React from 'react';
import { Link } from 'react-router-dom';
import { Notebook, PenTool, Shield, CheckCircle, ArrowRight } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <Notebook className="h-6 w-6" />,
      title: "Simple Notes",
      description: "Write and organize your notes with a clean, distraction-free interface."
    },
    {
      icon: <PenTool className="h-6 w-6" />,
      title: "Easy Editing",
      description: "Edit your notes anytime, anywhere with our intuitive editor."
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure & Private",
      description: "Your notes are safe with us. We respect your privacy."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <section className="py-16 from-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="h-16 w-16 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-6">
              <Notebook className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Simple Notes for 
              <span className="text-indigo-600"> Everyone</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              The easiest way to capture your thoughts and access them from anywhere. 
              Clean, simple, and free.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/signup" 
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center"
            >
              Start Taking Notes
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link 
              to="/login" 
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium hover:border-gray-400 transition-colors"
            >
              I have an account
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose NoteApp?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to organize your thoughts, without the complexity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors"
              >
                <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="h-12 w-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sign Up</h3>
              <p className="text-gray-600">Create your free account in seconds</p>
            </div>
            
            <div className="text-center">
              <div className="h-12 w-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Write Notes</h3>
              <p className="text-gray-600">Start capturing your thoughts</p>
            </div>
            
            <div className="text-center">
              <div className="h-12 w-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Anywhere</h3>
              <p className="text-gray-600">Your notes are always available</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-indigo-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already organizing their thoughts with NoteApp.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/signup" 
              className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center"
            >
              <Notebook className="mr-2 h-4 w-4" />
              Create Free Account
            </Link>
            <Link 
              to="/login" 
              className="border border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-indigo-600 transition-colors"
            >
              Sign In
            </Link>
          </div>
          
          <div className="mt-6 flex items-center justify-center text-indigo-200 text-sm">
            <CheckCircle className="h-4 w-4 mr-2" />
            No credit card required • Free forever
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default Home;