import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../../components/layout/Navigation';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-indigo-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-300/15 rounded-full blur-xl animate-bounce delay-500"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-purple-300/15 rounded-full blur-xl animate-bounce delay-700"></div>
      </div>

      <div className="relative z-10">
        <Navigation />

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
          <div className="text-center">
            <div className="relative">
              <h1 className="text-5xl tracking-tight font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 sm:text-6xl md:text-7xl animate-fade-in-up">
                <span className="block">Build Interactive</span>
                <span className="block relative">
                  Educational Forms
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full animate-ping"></div>
                </span>
              </h1>

              {/* Floating Icons */}
              <div className="absolute -top-8 left-1/4 w-12 h-12 text-blue-500 animate-float">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full opacity-60">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <div className="absolute -top-4 right-1/4 w-8 h-8 text-purple-500 animate-float-delayed">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full opacity-60">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
            </div>

            <p className="mt-6 max-w-md mx-auto text-xl text-gray-600 sm:text-2xl md:mt-8 md:max-w-3xl leading-relaxed animate-fade-in-up delay-200">
              Create engaging <span className="text-blue-600 font-semibold">categorize</span>, <span className="text-indigo-600 font-semibold">cloze</span>, and <span className="text-purple-600 font-semibold">comprehension</span> questions with our intuitive form builder.
              <br />
              <span className="text-lg text-gray-500 mt-2 block">Perfect for educators, trainers, and content creators.</span>
            </p>

            <div className="mt-10 max-w-md mx-auto sm:flex sm:justify-center md:mt-12 animate-fade-in-up delay-300">
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                <Link
                  to="/forms/new"
                  className="relative w-full flex items-center justify-center px-8 py-3 border border-transparent text-lg font-bold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transform hover:scale-105 transition-all duration-200 shadow-xl hover:shadow-2xl md:text-lg md:px-10"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Get Started
                </Link>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-4">
                <Link
                  to="/demo"
                  className="w-full flex items-center justify-center px-8 py-3 border-2 border-indigo-300 text-lg font-semibold rounded-xl text-indigo-700 bg-white/80 backdrop-blur-sm hover:bg-white hover:border-indigo-400 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl md:text-lg md:px-10"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Try Demo
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16 bg-white/60 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-indigo-600 font-bold tracking-wide uppercase animate-fade-in-up mb-4">
                Features
              </h2>
              <p className="mt-2 text-4xl leading-10 font-black tracking-tight text-gray-900 sm:text-5xl animate-fade-in-up delay-100">
                Everything you need to create
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  interactive forms
                </span>
              </p>
            </div>



            <div className="mt-16">
              <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
                {/* Categorize Feature */}
                <div className="relative group animate-fade-in-up delay-200">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-300 to-indigo-400 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-blue-200 hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-2 shadow-lg hover:shadow-xl">
                    <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7l-7 7-7-7" />
                      </svg>
                    </div>
                    <h3 className="text-xl leading-6 font-bold text-gray-900 mb-4 z-10 relative">Categorize Questions</h3>
                    <p className="text-base text-gray-600 leading-relaxed z-10 relative">
                      Create drag-and-drop categorization with images and multiple categories.
                    </p>
                    <div className="mt-4 flex items-center text-blue-600 font-medium z-10 relative">
                      <span className="text-sm">Learn more</span>
                      <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Cloze Feature */}
                <div className="relative group animate-fade-in-up delay-300">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-300 to-pink-400 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-purple-200 hover:border-purple-300 transition-all duration-300 transform hover:-translate-y-2 shadow-lg hover:shadow-xl">
                    <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600 text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <h3 className="text-xl leading-6 font-bold text-gray-900 mb-4 z-10 relative">Cloze Tests</h3>
                    <p className="text-base text-gray-600 leading-relaxed z-10 relative">
                      Build fill-in-the-blank exercises with customizable hints and inline text inputs.
                    </p>
                    <div className="mt-4 flex items-center text-purple-600 font-medium z-10 relative">
                      <span className="text-sm">Learn more</span>
                      <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Comprehension Feature */}
                <div className="relative group animate-fade-in-up delay-400">
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-300 to-blue-400 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-indigo-200 hover:border-indigo-300 transition-all duration-300 transform hover:-translate-y-2 shadow-lg hover:shadow-xl">
                    <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-600 text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h3 className="text-xl leading-6 font-bold text-gray-900 mb-4 z-10 relative">Reading Comprehension</h3>
                    <p className="text-base text-gray-600 leading-relaxed z-10 relative">
                      Create passage-based multiple choice questions to test reading comprehension.
                    </p>
                    <div className="mt-4 flex items-center text-indigo-600 font-medium z-10 relative">
                      <span className="text-sm">Learn more</span>
                      <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
              <div className="animate-fade-in-up delay-200">
                <h2 className="text-4xl font-black text-gray-900 sm:text-5xl">
                  Ready to get
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    started?
                  </span>
                </h2>
                <p className="mt-6 max-w-3xl text-xl text-gray-600 leading-relaxed">
                  Join thousands of educators and content creators who use FormBuilder to create
                  engaging interactive content. No technical skills required.
                </p>
                <div className="mt-10 sm:flex">
                  <div className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <Link
                      to="/forms/new"
                      className="relative flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-xl"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Create Your First Form
                    </Link>
                  </div>
                  <div className="mt-4 sm:mt-0 sm:ml-4">
                    <Link
                      to="/forms"
                      className="flex items-center justify-center px-8 py-4 border-2 border-indigo-300 text-lg font-semibold rounded-xl text-indigo-700 bg-white/80 backdrop-blur-sm hover:bg-white hover:border-indigo-400 transform hover:scale-105 transition-all duration-200 shadow-lg"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7l-7 7-7-7" />
                      </svg>
                      Browse Forms
                    </Link>
                  </div>
                </div>
              </div>

              <div className="mt-12 lg:mt-0 animate-fade-in-up delay-300">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-300 to-purple-400 rounded-3xl blur opacity-25"></div>
                  <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-blue-200">
                    <div className="flex items-center mb-6">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 ml-4">Quick Stats</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <span className="text-gray-700 font-medium">Question Types</span>
                        <div className="flex items-center">
                          <span className="font-bold text-2xl text-blue-600 mr-2">3</span>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl border border-green-200">
                        <span className="text-gray-700 font-medium">Image Support</span>
                        <div className="flex items-center">
                          <svg className="w-6 h-6 text-green-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                          </svg>
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-purple-50 rounded-xl border border-purple-200">
                        <span className="text-gray-700 font-medium">Drag & Drop</span>
                        <div className="flex items-center">
                          <svg className="w-6 h-6 text-purple-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                          </svg>
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                        <span className="text-gray-700 font-medium">Real-time Preview</span>
                        <div className="flex items-center">
                          <svg className="w-6 h-6 text-indigo-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                          </svg>
                          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              {/* Brand Section */}
              <div className="md:col-span-2">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-black text-gray-900">FormBuilder</h3>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed max-w-md">
                  Create engaging educational forms with our intuitive builder. Perfect for educators, trainers, and content creators worldwide.
                </p>
                <div className="mt-6 flex space-x-4">
                  {/* LinkedIn */}
                  <a
                    href="https://www.linkedin.com/in/santhosh-kumar-81744b2aa/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gray-100 hover:bg-blue-50 rounded-xl flex items-center justify-center border border-gray-200 hover:border-blue-300 transition-all duration-200 cursor-pointer group"
                  >
                    <svg
                      className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors duration-200"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>

                  {/* GitHub */}
                  <a
                    href="https://github.com/santhosh-005"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center border border-gray-200 hover:border-gray-400 transition-all duration-200 cursor-pointer group"
                  >
                    <svg
                      className="w-6 h-6 text-gray-400 group-hover:text-gray-800 transition-colors duration-200"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12 .5C5.649.5.5 5.649.5 12a11.5 11.5 0 0 0 7.84 10.92c.573.105.782-.249.782-.553 0-.273-.01-1.163-.015-2.107-3.19.693-3.865-1.538-3.865-1.538-.521-1.322-1.273-1.674-1.273-1.674-1.04-.711.079-.696.079-.696 1.15.081 1.755 1.18 1.755 1.18 1.022 1.751 2.681 1.246 3.336.953.104-.741.4-1.246.727-1.533-2.547-.29-5.225-1.274-5.225-5.67 0-1.253.448-2.276 1.18-3.076-.119-.29-.511-1.456.112-3.037 0 0 .963-.308 3.157 1.176a11.03 11.03 0 0 1 2.876-.387c.975.004 1.957.131 2.876.387 2.194-1.484 3.156-1.176 3.156-1.176.624 1.581.232 2.747.114 3.037.733.8 1.179 1.823 1.179 3.076 0 4.407-2.681 5.377-5.237 5.664.411.354.777 1.057.777 2.131 0 1.54-.014 2.778-.014 3.155 0 .306.208.662.787.55A11.502 11.502 0 0 0 23.5 12c0-6.351-5.149-11.5-11.5-11.5Z"
                      />
                    </svg>
                  </a>
                </div>

              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-gray-900 font-bold text-lg mb-6">Quick Links</h4>
                <ul className="space-y-4">
                  <li>
                    <Link to="/forms" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center group">
                      <svg className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      Browse Forms
                    </Link>
                  </li>
                  <li>
                    <Link to="/forms/new" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center group">
                      <svg className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      Create Form
                    </Link>
                  </li>
                  <li>
                    <Link to="/demo" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center group">
                      <svg className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      Try Demo
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Features */}
              <div>
                <h4 className="text-gray-900 font-bold text-lg mb-6">Features</h4>
                <ul className="space-y-4">
                  <li className="text-gray-600 flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Categorize Questions
                  </li>
                  <li className="text-gray-600 flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    Cloze Tests
                  </li>
                  <li className="text-gray-600 flex items-center">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                    Reading Comprehension
                  </li>
                  <li className="text-gray-600 flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Drag & Drop Support
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-500 text-center md:text-left">
                &copy; 2025 FormBuilder. Built with React and TypeScript.
              </p>
              <div className="mt-4 md:mt-0 flex items-center space-x-6">
                <span className="text-gray-500 text-sm">Made with ❤️ by Santhosh</span>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Custom CSS for additional animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fade-in-up {
            0% {
              opacity: 0;
              transform: translateY(30px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }
          
          @keyframes tilt {
            0%, 50%, 100% {
              transform: rotate(0deg);
            }
            25% {
              transform: rotate(1deg);
            }
            75% {
              transform: rotate(-1deg);
            }
          }
          
          .animate-fade-in-up {
            animation: fade-in-up 0.6s ease-out forwards;
            opacity: 0;
          }
          
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          
          .animate-float-delayed {
            animation: float 3s ease-in-out infinite 1.5s;
          }
          
          .animate-tilt {
            animation: tilt 10s infinite linear;
          }
          
          .delay-100 { animation-delay: 0.1s; }
          .delay-200 { animation-delay: 0.2s; }
          .delay-300 { animation-delay: 0.3s; }
          .delay-400 { animation-delay: 0.4s; }
          .delay-500 { animation-delay: 0.5s; }
          .delay-700 { animation-delay: 0.7s; }
          .delay-1000 { animation-delay: 1s; }
        `
      }} />
    </div>
  );
};

export default Landing;