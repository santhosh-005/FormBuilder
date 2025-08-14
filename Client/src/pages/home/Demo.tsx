import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../../components/layout/Navigation';
import CategorizeRenderer from '../../components/forms/renderers/CategorizeRenderer';
import ClozeRenderer from '../../components/forms/renderers/ClozeRenderer';
import ComprehensionRenderer from '../../components/forms/renderers/ComprehensionRenderer';
import type { CategorizeQuestion, ClozeQuestion, ComprehensionQuestion } from '../../types/form';

const Demo: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<'categorize' | 'cloze' | 'comprehension'>('categorize');
  const [answers, setAnswers] = useState<{
    categorize?: { [itemId: string]: string };
    cloze?: { [blankId: string]: string };
    comprehension?: number[];
  }>({});
  const [isResetting, setIsResetting] = useState(false);
  const [showResetSuccess, setShowResetSuccess] = useState(false);
  const [resetCounter, setResetCounter] = useState(0);

  // Demo data
  const categorizeDemo: CategorizeQuestion = {
    type: 'categorize',
    categories: ['Fruits', 'Vegetables', 'Grains'],
    items: [
      { id: '1', text: 'Apple', correctCategory: 'Fruits' },
      { id: '2', text: 'Carrot', correctCategory: 'Vegetables' },
      { id: '3', text: 'Rice', correctCategory: 'Grains' },
      { id: '4', text: 'Banana', correctCategory: 'Fruits' },
      { id: '5', text: 'Broccoli', correctCategory: 'Vegetables' },
      { id: '6', text: 'Wheat', correctCategory: 'Grains' }
    ]
  };

  const clozeDemo: ClozeQuestion = {
    type: 'cloze',
    text: 'The [blank_1] is the largest planet in our solar system. It has a [blank_2] that is famous for its beauty. Jupiter has [blank_3] moons, including the four largest ones discovered by Galileo.',
    blanks: [
      { id: 'blank_1', answerHint: 'planet name' },
      { id: 'blank_2', answerHint: 'atmospheric feature' },
      { id: 'blank_3', answerHint: 'number' }
    ],
    options: [
      'Jupiter',
      'Great Red Spot',
      '79',
      'Saturn',
      'rings',
      'many',
      'Mars',
      'atmosphere',
      '12'
    ]
  };

  const comprehensionDemo: ComprehensionQuestion = {
    type: 'comprehension',
    passage: `Climate change refers to long-term shifts in global or regional climate patterns. Since the mid-20th century, scientists have observed unprecedented changes in Earth's climate system, primarily attributed to increased levels of greenhouse gases produced by human activities.

The most significant greenhouse gas is carbon dioxide, which is released through burning fossil fuels, deforestation, and industrial processes. As greenhouse gases accumulate in the atmosphere, they trap heat from the sun, causing global temperatures to rise.

The effects of climate change are already visible worldwide. These include rising sea levels, melting ice caps, more frequent extreme weather events, and shifts in precipitation patterns. Scientists warn that without significant action to reduce greenhouse gas emissions, these effects will become more severe in the coming decades.`,
    questions: [
      {
        id: '1',
        questionText: 'According to the passage, what is the primary cause of recent climate change?',
        options: [
          'Natural climate variations',
          'Increased greenhouse gases from human activities',
          'Solar radiation changes',
          'Volcanic eruptions'
        ],
        correctIndex: 1
      },
      {
        id: '2',
        questionText: 'Which greenhouse gas is mentioned as the most significant?',
        options: [
          'Methane',
          'Nitrous oxide',
          'Carbon dioxide',
          'Water vapor'
        ],
        correctIndex: 2
      },
      {
        id: '3',
        questionText: 'What are some visible effects of climate change mentioned in the passage?',
        options: [
          'Only rising temperatures',
          'Rising sea levels and melting ice caps',
          'Changes in animal behavior',
          'Increased plant growth'
        ],
        correctIndex: 1
      }
    ]
  };

  const handleAnswerChange = useCallback((answer: any) => {
    setAnswers((prev) => ({
      ...prev,
      [activeDemo]: answer
    }));
  }, [activeDemo]);

  const resetDemo = async () => {
    // Set resetting state for visual feedback
    setIsResetting(true);
    
    // Small delay for visual feedback
    await new Promise(resolve => setTimeout(resolve, 150));
    
    // Clear answers for the current demo
    setAnswers((prev) => {
      const newAnswers = { ...prev };
      
      // Clear the specific demo answers with new object references
      if (activeDemo === 'categorize') {
        newAnswers.categorize = {}; // New empty object
      } else if (activeDemo === 'cloze') {
        newAnswers.cloze = {}; // New empty object
      } else if (activeDemo === 'comprehension') {
        newAnswers.comprehension = []; // New empty array
      }
      
      return newAnswers;
    });
    
    // Increment reset counter to force re-render
    setResetCounter(prev => prev + 1);
    
    // Reset the resetting state
    setIsResetting(false);
    
    // Show success message
    setShowResetSuccess(true);
    setTimeout(() => setShowResetSuccess(false), 2000);
  };

  const hasAnswers = () => {
    const currentAnswers = answers[activeDemo];
    if (!currentAnswers) return false;
    
    if (activeDemo === 'categorize' || activeDemo === 'cloze') {
      return Object.keys(currentAnswers as object).length > 0;
    } else if (activeDemo === 'comprehension') {
      return (currentAnswers as number[]).length > 0;
    }
    
    return false;
  };

  // Keyboard shortcut for reset (Ctrl/Cmd + R)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'r' && hasAnswers()) {
        event.preventDefault();
        resetDemo();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [hasAnswers()]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-indigo-200/20 to-pink-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-300/15 rounded-full blur-xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-purple-300/15 rounded-full blur-xl"></div>
      </div>

      <div className="relative z-10">
        <Navigation />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Notification */}
        {showResetSuccess && (
          <div className="fixed top-20 right-4 z-50">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-300 text-green-700 px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 backdrop-blur-sm">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm font-semibold">Demo reset successfully!</span>
            </div>
          </div>
        )}

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 mb-4">
            Interactive Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Experience the power of our form builder by trying out different question types below
          </p>
        </div>

        {/* Demo Type Selector */}
        <div className="flex justify-center mb-12">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-300 to-purple-400 rounded-2xl blur opacity-25"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-200 p-2">
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveDemo('categorize')}
                  className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    activeDemo === 'categorize'
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50/80 border border-transparent hover:border-blue-200'
                  }`}
                >
                  Categorize
                </button>
                <button
                  onClick={() => setActiveDemo('cloze')}
                  className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    activeDemo === 'cloze'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50/80 border border-transparent hover:border-purple-200'
                  }`}
                >
                  Cloze Test
                </button>
                <button
                  onClick={() => setActiveDemo('comprehension')}
                  className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    activeDemo === 'comprehension'
                      ? 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/80 border border-transparent hover:border-indigo-200'
                  }`}
                >
                  Reading Comprehension
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Content */}
        <div className="relative mb-8">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-300 to-purple-400 rounded-3xl blur opacity-25"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-blue-200 overflow-hidden">
            {/* Demo Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-blue-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-gray-900">
                  {activeDemo === 'categorize' && 'Categorize Demo'}
                  {activeDemo === 'cloze' && 'Cloze Test Demo'}
                  {activeDemo === 'comprehension' && 'Reading Comprehension Demo'}
                </h2>
                <div className="flex items-center gap-4">
                  {hasAnswers() && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-xl border border-gray-200 shadow-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold text-gray-700">
                        {activeDemo === 'categorize' && `${Object.keys(answers.categorize || {}).length} items placed`}
                        {activeDemo === 'cloze' && `${Object.keys(answers.cloze || {}).length} blanks filled`}
                        {activeDemo === 'comprehension' && `${(answers.comprehension || []).length} questions answered`}
                      </span>
                    </div>
                  )}
                  <div className="group relative">
                    <div className={`absolute -inset-1 rounded-xl blur transition duration-300 ${
                      hasAnswers() && !isResetting
                        ? 'bg-gradient-to-r from-red-500 to-pink-600 opacity-25 group-hover:opacity-50'
                        : 'bg-gray-300 opacity-10'
                    }`}></div>
                    <button
                      onClick={resetDemo}
                      disabled={!hasAnswers() || isResetting}
                      className={`relative flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-200 transform ${
                        hasAnswers() && !isResetting
                          ? 'text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl hover:scale-105' 
                          : 'text-gray-400 bg-gray-100 cursor-not-allowed border border-gray-200'
                      } ${isResetting ? 'animate-pulse' : ''}`}
                      title={hasAnswers() ? 'Clear all answers for this demo' : 'No answers to reset'}
                    >
                      {isResetting ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                          </svg>
                          Resetting...
                        </span>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Reset
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Demo Content Area */}
            <div className="p-8">

              {activeDemo === 'categorize' && (
                <CategorizeRenderer
                  key={`categorize-${resetCounter}`}
                  question={categorizeDemo}
                  onAnswer={handleAnswerChange}
                  initialAnswer={answers.categorize}
                />
              )}

              {activeDemo === 'cloze' && (
                <ClozeRenderer
                  key={`cloze-${resetCounter}`}
                  question={clozeDemo}
                  onAnswer={handleAnswerChange}
                  initialAnswer={answers.cloze}
                />
              )}

              {activeDemo === 'comprehension' && (
                <ComprehensionRenderer
                  key={`comprehension-${resetCounter}`}
                  question={comprehensionDemo}
                  onAnswer={handleAnswerChange}
                  initialAnswer={answers.comprehension}
                />
              )}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="relative mt-8">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-300 to-indigo-400 rounded-3xl blur opacity-25"></div>
          <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-3xl p-8 shadow-xl backdrop-blur-sm">
            <h3 className="text-2xl font-black text-blue-900 mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              How It Works
            </h3>
            
            {activeDemo === 'categorize' && (
              <div className="text-blue-700 space-y-3 text-lg leading-relaxed">
                <p className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></span>
                  Drag items from the top section into the correct categories below
                </p>
                <p className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></span>
                  Each item can only be placed in one category at a time
                </p>
                <p className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></span>
                  Click the × button on placed items to remove them from categories
                </p>
                <p className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></span>
                  Perfect for sorting exercises, classification tasks, and vocabulary building
                </p>
              </div>
            )}

            {activeDemo === 'cloze' && (
              <div className="text-blue-700 space-y-3 text-lg leading-relaxed">
                <p className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mt-3 flex-shrink-0"></span>
                  Drag answer options from the blue box to fill in the blanks
                </p>
                <p className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mt-3 flex-shrink-0"></span>
                  Click on filled blanks to remove the answer and return it to options
                </p>
                <p className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mt-3 flex-shrink-0"></span>
                  Each answer can only be used once at a time
                </p>
                <p className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mt-3 flex-shrink-0"></span>
                  Great for language learning, vocabulary practice, and comprehension tests
                </p>
              </div>
            )}

            {activeDemo === 'comprehension' && (
              <div className="text-blue-700 space-y-3 text-lg leading-relaxed">
                <p className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mt-3 flex-shrink-0"></span>
                  Read the passage carefully and answer the multiple choice questions
                </p>
                <p className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mt-3 flex-shrink-0"></span>
                  Click on radio buttons to select your answers
                </p>
                <p className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mt-3 flex-shrink-0"></span>
                  Your selections are highlighted and tracked
                </p>
                <p className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mt-3 flex-shrink-0"></span>
                  Ideal for reading comprehension, assessment, and critical thinking exercises
                </p>
              </div>
            )}
          
            {/* General Reset Instructions */}
            <div className="mt-6 pt-6 border-t border-blue-200">
              <div className="bg-blue-100/50 rounded-xl p-4 text-blue-800">
                <p className="font-semibold mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reset Options:
                </p>
                <div className="space-y-2 text-sm">
                  <p className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    Click the "Reset" button to clear all answers for the current demo
                  </p>
                  <p className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    Keyboard shortcut: <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-white border border-gray-300 rounded shadow-sm">Ctrl+R</kbd> (or <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-white border border-gray-300 rounded shadow-sm">⌘+R</kbd> on Mac)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="relative mt-12">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-300 to-purple-400 rounded-3xl blur opacity-25"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-blue-200 text-center">
            <h3 className="text-3xl font-black text-gray-900 mb-4">
              Ready to Create Your Own?
            </h3>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Start building engaging educational content with our intuitive form builder designed for educators and content creators.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                <Link
                  to="/forms/new"
                  className="relative flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-bold text-lg transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Your First Form
                </Link>
              </div>
              <Link
                to="/forms"
                className="flex items-center justify-center gap-3 px-8 py-4 border-2 border-indigo-300 text-indigo-700 bg-white/80 backdrop-blur-sm hover:bg-white hover:border-indigo-400 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7l-7 7-7-7" />
                </svg>
                Browse Existing Forms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default Demo;
