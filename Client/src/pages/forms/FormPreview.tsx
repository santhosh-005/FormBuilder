import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getForm, submitForm } from '../../lib/api';
import CategorizeRenderer from '../../components/forms/renderers/CategorizeRenderer';
import ClozeRenderer from '../../components/forms/renderers/ClozeRenderer';
import ComprehensionRenderer from '../../components/forms/renderers/ComprehensionRenderer';
import type { Form } from '../../types/form';
import { FormInput, CheckCircle, ArrowRight } from 'lucide-react';

const FormPreview: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<{ [questionIndex: number]: any }>({});

  useEffect(() => {
    if (formId) {
      loadForm();
    }
  }, [formId]);

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

  const handleAnswer = (questionIndex: number, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const handleSubmit = async () => {
    if (!form) return;

    try {
      setSubmitting(true);
      setError(null);

      // Transform answers object to array of { questionId, answer }

      // Use array index as questionId (quick fix)
      const formattedAnswers = form.questions.map((_, idx) => ({
        questionId: String(idx),
        answer: answers[idx]
      }));

      await submitForm(formId!, { answers: formattedAnswers });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit form');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-lg text-gray-700">Loading form...</div>
      </div>
    );
  }

  if (error && !form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-md w-full text-center">
          <div className="text-red-600 text-lg mb-4">{error}</div>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Go to FormBuilder
          </button>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-md w-full text-center">
          <div className="text-gray-600 text-lg mb-4">Form not found</div>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Go to FormBuilder
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-2xl w-full mx-auto p-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-8 text-center">
            <div className="flex justify-center mb-6">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-600 bg-clip-text text-transparent mb-4">
              Thank you!
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Your response has been submitted successfully.
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <FormInput className="w-5 h-5" />
              Create your own form
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-sm text-gray-500 mt-4">
              Build beautiful forms like this one with FormBuilder
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Form Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 mb-6">
          {form.headerImageUrl && (
            <div className="h-48 bg-gray-200 rounded-t-xl overflow-hidden">
              <img
                src={form.headerImageUrl}
                alt={form.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-600 bg-clip-text text-transparent mb-2">
              {form.title}
            </h1>
            {form.description && (
              <p className="text-gray-600 text-lg">{form.description}</p>
            )}
            <div className="mt-4 text-sm text-gray-500">
              {form.questions.length} question{form.questions.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Questions */}
        <div className="space-y-6">
          {form.questions.map((question, index) => (
            <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-6">
              <div className="mb-4">
                <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                  Question {index + 1}
                </span>
                <h3 className="text-lg font-medium text-gray-900 mt-3">
                  {question.type === 'categorize' && 'Categorize the following items'}
                  {question.type === 'cloze' && 'Fill in the blanks'}
                  {question.type === 'comprehension' && 'Reading Comprehension'}
                </h3>
              </div>

              {question.type === 'categorize' && (
                <CategorizeRenderer 
                  question={question} 
                  onAnswer={(answer) => handleAnswer(index, answer)}
                />
              )}
              
              {question.type === 'cloze' && (
                <ClozeRenderer 
                  question={question} 
                  onAnswer={(answer) => handleAnswer(index, answer)}
                />
              )}
              
              {question.type === 'comprehension' && (
                <ComprehensionRenderer 
                  question={question} 
                  onAnswer={(answer) => handleAnswer(index, answer)}
                />
              )}
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-6">
          <div className="text-center">
            <button
              onClick={handleSubmit}
              disabled={submitting || Object.keys(answers).length === 0}
              className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-lg font-medium hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {submitting ? 'Submitting...' : 'Submit Form'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormPreview;
