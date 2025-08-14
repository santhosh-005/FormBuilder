import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getForm, getFormSubmissions } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import Navigation from '../../components/layout/Navigation';
import type { Form, Submission } from '../../types/form';
import { 
  ArrowLeft, 
  FileText, 
  Calendar, 
  User,
  CheckCircle,
  XCircle
} from 'lucide-react';

const SubmissionDetail: React.FC = () => {
  const { formId, submissionId } = useParams<{ formId: string; submissionId: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  
  const [form, setForm] = useState<Form | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (formId && submissionId && user && !authLoading) {
      loadSubmissionDetails();
    }
  }, [formId, submissionId, user, authLoading]);

  const loadSubmissionDetails = async () => {
    if (!formId || !submissionId) return;

    try {
      setLoading(true);
      setError(null);
      
      // Load form details and submissions
      const [formData, submissionsData] = await Promise.all([
        getForm(formId),
        getFormSubmissions(formId)
      ]);
      
      setForm(formData);
      
      // Find the specific submission
      const targetSubmission = submissionsData.data.find(
        (sub: Submission) => sub._id === submissionId
      );
      
      if (!targetSubmission) {
        setError('Submission not found');
        return;
      }
      
      setSubmission(targetSubmission);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load submission details');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToSubmissions = () => {
    navigate(`/dashboard/form/${formId}/submissions`);
  };

  // Build a map of answers by questionId for reliable lookup
  const answerMap = React.useMemo(() => {
    if (!submission) return {};
    const map: Record<string, any> = {};
    for (const ans of submission.answers) {
      if (ans && ans.questionId !== undefined) {
        map[ans.questionId] = ans.answer;
      }
    }
    return map;
  }, [submission]);

  const renderAnswer = (question: any, questionIndex: number) => {
    const answer = answerMap[question.id ?? question.questionId ?? String(questionIndex)] as any;
    if (!answer) {
      return <p className="text-gray-500 italic">No answer provided</p>;
    }

    switch (question.type) {
      case 'categorize':
        return (
          <div className="space-y-2">
            {question.items.map((item: any) => {
              const userCategory = answer[item.id] as string;
              const isCorrect = userCategory === item.correctCategory;
              
              return (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{item.text}</span>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-sm ${
                      isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {userCategory || 'Not answered'}
                    </span>
                    {item.correctCategory && (
                      <>
                        {isCorrect ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        );
        
      case 'cloze':
        return (
          <div className="space-y-2">
            {question.blanks.map((blank: any) => {
              const userAnswer = answer[blank.id] as string;
              
              return (
                <div key={blank.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">
                    Blank {question.blanks.indexOf(blank) + 1}
                    {blank.answerHint && (
                      <span className="text-gray-500 ml-2">({blank.answerHint})</span>
                    )}
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                    {userAnswer || 'Not answered'}
                  </span>
                </div>
              );
            })}
          </div>
        );
        
      case 'comprehension':
        return (
          <div className="space-y-4">
            {question.questions.map((compQuestion: any, idx: number) => {
              const userAnswerIndex = answer[idx] as number;
              const isCorrect = userAnswerIndex === compQuestion.correctIndex;
              
              return (
                <div key={idx} className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium mb-3">{compQuestion.questionText}</h4>
                  <div className="space-y-2">
                    {compQuestion.options.map((option: string, optionIdx: number) => {
                      const isSelected = userAnswerIndex === optionIdx;
                      const isCorrectOption = optionIdx === compQuestion.correctIndex;
                      
                      return (
                        <div key={optionIdx} className={`p-2 rounded ${
                          isSelected 
                            ? isCorrect 
                              ? 'bg-green-100 text-green-800 border border-green-300' 
                              : 'bg-red-100 text-red-800 border border-red-300'
                            : isCorrectOption 
                              ? 'bg-green-50 text-green-700 border border-green-200' 
                              : 'bg-gray-50'
                        }`}>
                          <div className="flex items-center gap-2">
                            <span>{option}</span>
                            {isSelected && (
                              isCorrect ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-600" />
                              )
                            )}
                            {!isSelected && isCorrectOption && (
                              <span className="text-xs text-green-600">(Correct)</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        );
        
      default:
        return <p className="text-gray-500">Unknown question type</p>;
    }
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <div className="text-lg text-gray-700">Loading submission details...</div>
        </div>
      </>
    );
  }

  if (error || !form || !submission) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <div className="text-red-600 text-lg mb-4">{error || 'Submission not found'}</div>
              <button
                onClick={handleBackToSubmissions}
                className="text-indigo-600 hover:text-indigo-800 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-all duration-200"
              >
                Back to Submissions
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
            <button
              onClick={handleBackToSubmissions}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-4 px-3 py-2 rounded-lg hover:bg-indigo-50 transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Submissions
            </button>
            
            <h1 className="flex items-center gap-3 text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-600 bg-clip-text text-transparent">
              <FileText className="w-8 h-8 text-indigo-600" />
              Submission Details
            </h1>
            
            <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1 px-3 py-1 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200">
                <Calendar className="w-4 h-4 text-indigo-500" />
                {new Date(submission.createdAt).toLocaleDateString()}{' '}
                {new Date(submission.createdAt).toLocaleTimeString()}
              </div>
              <div className="flex items-center gap-1 px-3 py-1 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200">
                <User className="w-4 h-4 text-indigo-500" />
                Submission ID: {submission._id.slice(-8)}
              </div>
            </div>
          </div>

          {/* Form Title */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-6 mb-6">
            <h2 className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-2">
              {form.title}
            </h2>
            {form.description && (
              <p className="text-gray-600">{form.description}</p>
            )}
          </div>

          {/* Questions and Answers */}
          <div className="space-y-6">
            {form.questions.map((question, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-6">
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                      Question {index + 1}
                    </span>
                    <span className="bg-gradient-to-r from-gray-100 to-blue-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                      {question.type.charAt(0).toUpperCase() + question.type.slice(1)}
                    </span>
                  </div>
                  
                  {question.type === 'categorize' && (
                    <h3 className="text-lg font-medium text-gray-900">
                      Categorize the following items
                    </h3>
                  )}
                  {question.type === 'cloze' && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Fill in the blanks
                      </h3>
                      <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-xl border border-gray-200">
                        <p className="text-gray-700">{question.text}</p>
                      </div>
                    </div>
                  )}
                  {question.type === 'comprehension' && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Reading Comprehension
                      </h3>
                      <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-xl border border-gray-200 mb-4">
                        <p className="text-gray-700">{question.passage}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">User's Answer:</h4>
                  {renderAnswer(question, index)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SubmissionDetail;
