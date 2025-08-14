import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createForm } from '../../lib/api';
import Navigation from '../../components/layout/Navigation';
import type { CreateFormData } from '../../types/form';
import ImageUploader from '../../components/ui/ImageUploader';

const CreateForm: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateFormData>({
    title: '',
    description: '', // Initialize as empty string
    headerImageUrl: null,
    questions: []
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const createdForm = await createForm(formData);
      
      // Redirect to the form builder to add questions
      navigate(`/builder/${createdForm._id}`);
    } catch (err) {
      setError('Failed to create form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (url: string) => {
    setFormData(prev => ({
      ...prev,
      headerImageUrl: url || null
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navigation />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-600 bg-clip-text text-transparent">
            Create New Form
          </h1>
          <p className="mt-2 text-gray-600">
            Start by adding basic information about your form
          </p>
        </div>

        {/* Form */}
        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-xl border border-white/20">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Form Title *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                placeholder="Enter a descriptive title for your form"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                id="description"
                rows={4}
                value={formData.description || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                placeholder="Provide a brief description of what this form is about (optional)"
              />
            </div>

            {/* Header Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Header Image (Optional)
              </label>
              <p className="text-sm text-gray-500 mb-3">
                Upload an image to display at the top of your form
              </p>
              <ImageUploader
                onUpload={handleImageUpload}
                initialUrl={formData.headerImageUrl || undefined}
              />
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <Link
                to="/forms"
                className="px-6 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-md transition-all duration-200"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading || !formData.title.trim()}
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? 'Creating...' : 'Create Form & Add Questions'}
              </button>
            </div>
          </form>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-xl p-6 backdrop-blur-sm">
          <h3 className="text-lg font-medium bg-gradient-to-r from-blue-900 to-indigo-800 bg-clip-text text-transparent mb-2">
            What's Next?
          </h3>
          <p className="text-blue-700 mb-4">
            After creating your form, you'll be taken to the form builder where you can add different types of questions:
          </p>
          <ul className="space-y-3 text-blue-700">
            <li className="flex items-start">
              <span className="flex-shrink-0 h-5 w-5 text-blue-500 mr-3 mt-0.5">•</span>
              <span><strong>Categorize Questions:</strong> Drag-and-drop exercises with images and categories</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 h-5 w-5 text-blue-500 mr-3 mt-0.5">•</span>
              <span><strong>Cloze Tests:</strong> Fill-in-the-blank exercises with hints</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 h-5 w-5 text-blue-500 mr-3 mt-0.5">•</span>
              <span><strong>Reading Comprehension:</strong> Passage-based multiple choice questions</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateForm;
