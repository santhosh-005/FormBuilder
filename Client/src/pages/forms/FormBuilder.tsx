import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getForm, updateForm } from '../../lib/api';
import Navigation from '../../components/layout/Navigation';
import QuestionList from '../../components/forms/editors/QuestionList';
import CategorizeEditor from '../../components/forms/editors/CategorizeEditor';
import ClozeEditor from '../../components/forms/editors/ClozeEditor';
import ComprehensionEditor from '../../components/forms/editors/ComprehensionEditor';
import ImageUploader from '../../components/ui/ImageUploader';
import type { Form, CreateFormData, CategorizeQuestion, ClozeQuestion, ComprehensionQuestion } from '../../types/form';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Plus, 
  Layers, 
  FileText, 
  BookOpen, 
  Image,
  Settings
} from 'lucide-react';

const FormBuilder: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);

  // Redirect to login if not authenticated
  if (!authLoading && !user) {
    return <Navigate to="/login" replace />;
  }

  // Show loading while auth is being determined
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  useEffect(() => {
    if (formId && user) {
      loadForm();
    }
  }, [formId, user]);

  const loadForm = async () => {
    if (!formId) return;

    try {
      setLoading(true);
      setError(null);
      const formData = await getForm(formId);
      setForm(formData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load form');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!form || !formId) return;

    try {
      setSaving(true);
      setError(null);
      
      const updateData: Partial<CreateFormData> = {
        title: form.title,
        description: form.description,
        headerImageUrl: form.headerImageUrl,
        questions: form.questions
      };

      const updatedForm = await updateForm(formId, updateData);
      setForm(updatedForm);
      
      // Show success message briefly
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save form');
    } finally {
      setSaving(false);
    }
  };

  // Validation functions for each question type
  const isQuestionValid = (question: CategorizeQuestion | ClozeQuestion | ComprehensionQuestion): boolean => {
    switch (question.type) {
      case 'categorize':
        // Valid if has categories with content OR items with content
        const hasValidCategories = question.categories.some(cat => cat.trim() !== '');
        const hasValidItems = question.items.some(item => item.text.trim() !== '');
        return hasValidCategories || hasValidItems;
      case 'cloze':
        // Valid if has text content OR configured blanks
        return question.text.trim() !== '' || question.blanks.length > 0;
      case 'comprehension':
        // Valid if has passage content OR has questions
        return question.passage.trim() !== '' || question.questions.length > 0;
      default:
        return false;
    }
  };

  const removeInvalidQuestions = () => {
    if (!form) return;
    
    const validQuestions = form.questions.filter(isQuestionValid);
    
    if (validQuestions.length !== form.questions.length) {
      setForm({
        ...form,
        questions: validQuestions
      });
      
      // Update active question if the current one was removed
      if (activeQuestion !== null && activeQuestion >= validQuestions.length) {
        setActiveQuestion(null);
      }
    }
  };

  const addQuestion = (type: 'categorize' | 'cloze' | 'comprehension') => {
    if (!form) return;

    let newQuestion: CategorizeQuestion | ClozeQuestion | ComprehensionQuestion;

    switch (type) {
      case 'categorize':
        newQuestion = {
          type: 'categorize',
          categories: [],
          items: []
        };
        break;
      case 'cloze':
        newQuestion = {
          type: 'cloze',
          text: '',
          blanks: []
        };
        break;
      case 'comprehension':
        newQuestion = {
          type: 'comprehension',
          passage: '',
          questions: []
        };
        break;
    }

    setForm({
      ...form,
      questions: [...form.questions, newQuestion]
    });
    
    setActiveQuestion(form.questions.length);
  };

  const updateQuestion = (index: number, updatedQuestion: any) => {
    if (!form) return;

    const newQuestions = [...form.questions];
    newQuestions[index] = updatedQuestion;
    
    setForm({
      ...form,
      questions: newQuestions
    });
  };

  const deleteQuestion = (index: number) => {
    if (!form) return;

    const newQuestions = form.questions.filter((_, i) => i !== index);
    
    setForm({
      ...form,
      questions: newQuestions
    });
    
    // If we're deleting the currently active question, go back to overview
    if (activeQuestion === index) {
      setActiveQuestion(null);
    } else if (activeQuestion !== null && activeQuestion > index) {
      // If we're deleting a question before the active one, adjust the index
      setActiveQuestion(activeQuestion - 1);
    }
  };

  const handleMoveQuestion = (index: number, direction: 'up' | 'down') => {
    if (!form) return;

    const newQuestions = [...form.questions];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    // Check bounds
    if (targetIndex < 0 || targetIndex >= newQuestions.length) {
      return;
    }

    // Swap questions
    [newQuestions[index], newQuestions[targetIndex]] = [newQuestions[targetIndex], newQuestions[index]];

    setForm({
      ...form,
      questions: newQuestions
    });

    // Update active question index if needed
    if (activeQuestion === index) {
      setActiveQuestion(targetIndex);
    } else if (activeQuestion === targetIndex) {
      setActiveQuestion(index);
    }
  };

  const handleImageUpload = (url: string) => {
    if (!form) return;
    
    setForm({
      ...form,
      headerImageUrl: url || null
    });
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <div className="text-lg text-gray-700">Loading form...</div>
        </div>
      </>
    );
  }

  if (error && !form) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <div className="text-red-600 text-lg mb-4">{error}</div>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!form) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <div className="text-gray-600 text-lg mb-4">Form not found</div>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-600 bg-clip-text text-transparent">
                  Form Builder
                </h1>
                <p className="text-gray-600 mt-2">Edit and customize your form</p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate(`/form/${formId}`)}
                  className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-md transition-all duration-200"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl disabled:opacity-50 transition-all duration-200"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-md transition-all duration-200"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Settings */}
            <div className="lg:col-span-1">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-6">
                <h3 className="flex items-center gap-2 text-lg font-medium bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-4">
                  <Settings className="w-5 h-5 text-blue-600" />
                  Form Settings
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                      <Image className="w-4 h-4" />
                      Header Image
                    </label>
                    <ImageUploader 
                      onUpload={handleImageUpload} 
                      initialUrl={form.headerImageUrl || undefined}
                    />
                  </div>
                </div>

                {/* Add Question Buttons */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-3">
                    <Plus className="w-4 h-4" />
                    Add Question
                  </h4>
                  <div className="space-y-3">
                    <button
                      onClick={() => addQuestion('categorize')}
                      className="flex items-center gap-2 w-full px-4 py-3 text-sm bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-xl hover:from-blue-100 hover:to-indigo-100 border border-blue-200/50 transition-all duration-200"
                    >
                      <Layers className="w-4 h-4" />
                      Categorize Question
                    </button>
                    <button
                      onClick={() => addQuestion('cloze')}
                      className="flex items-center gap-2 w-full px-4 py-3 text-sm bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-xl hover:from-green-100 hover:to-emerald-100 border border-green-200/50 transition-all duration-200"
                    >
                      <FileText className="w-4 h-4" />
                      Cloze Question
                    </button>
                    <button
                      onClick={() => addQuestion('comprehension')}
                      className="flex items-center gap-2 w-full px-4 py-3 text-sm bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 rounded-xl hover:from-purple-100 hover:to-pink-100 border border-purple-200/50 transition-all duration-200"
                    >
                      <BookOpen className="w-4 h-4" />
                      Comprehension Question
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Questions List & Editor */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border border-white/20">
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex">
                    <button
                      onClick={() => {
                        removeInvalidQuestions();
                        setActiveQuestion(null);
                      }}
                      className={`py-4 px-6 text-sm font-medium rounded-t-xl transition-all duration-200 ${
                        activeQuestion === null
                          ? 'border-b-2 border-indigo-500 text-indigo-600 bg-indigo-50/50'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
                      }`}
                    >
                      Questions Overview
                    </button>
                    {activeQuestion !== null && (
                      <button className="py-4 px-6 text-sm font-medium border-b-2 border-indigo-500 text-indigo-600 bg-indigo-50/50 rounded-t-xl">
                        Edit Question {activeQuestion + 1}
                      </button>
                    )}
                  </nav>
                </div>

                <div className="p-6">
                  {activeQuestion === null ? (
                    <QuestionList
                      questions={form.questions}
                      onEdit={setActiveQuestion}
                      onDelete={deleteQuestion}
                      onMove={handleMoveQuestion}
                    />
                  ) : (
                    <div>
                      {form.questions[activeQuestion]?.type === 'categorize' && (
                        <CategorizeEditor
                          question={form.questions[activeQuestion] as CategorizeQuestion}
                          onChange={(updatedQuestion) => updateQuestion(activeQuestion, updatedQuestion)}
                          onCancel={() => setActiveQuestion(null)}
                        />
                      )}
                      {form.questions[activeQuestion]?.type === 'cloze' && (
                        <ClozeEditor
                          question={form.questions[activeQuestion] as ClozeQuestion}
                          onChange={(updatedQuestion) => updateQuestion(activeQuestion, updatedQuestion)}
                          onCancel={() => setActiveQuestion(null)}
                        />
                      )}
                      {form.questions[activeQuestion]?.type === 'comprehension' && (
                        <ComprehensionEditor
                          question={form.questions[activeQuestion] as ComprehensionQuestion}
                          onChange={(updatedQuestion) => updateQuestion(activeQuestion, updatedQuestion)}
                          onCancel={() => setActiveQuestion(null)}
                        />
                      )}
                      
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => {
                            removeInvalidQuestions();
                            setActiveQuestion(null);
                          }}
                          className="px-4 py-2 text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-lg transition-all duration-200"
                        >
                          ← Back to Questions Overview
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FormBuilder;
