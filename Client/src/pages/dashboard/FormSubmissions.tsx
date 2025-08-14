import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getFormSubmissions, deleteForm } from '../../lib/api';
import Navigation from '../../components/layout/Navigation';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import type { Submission } from '../../types/form';
import { Eye, Edit, Trash2, Users, ArrowLeft, FileText } from 'lucide-react';

const FormSubmissions: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (formId) {
      loadSubmissions();
    }
    // eslint-disable-next-line
  }, [formId]);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getFormSubmissions(formId!);
      setSubmissions(response.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleViewSubmissionDetail = (submissionId: string) => {
    navigate(`/forms/${formId}/submissions/${submissionId}`);
  };

  const handleDeleteForm = async () => {
    if (!formId) return;
    
    try {
      setDeleting(true);
      await deleteForm(formId);
      setShowDeleteModal(false);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete form');
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-4 px-3 py-2 rounded-lg hover:bg-indigo-50 transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to My Forms
              </button>
              <h1 className="flex items-center gap-3 text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-600 bg-clip-text text-transparent">
                <FileText className="w-8 h-8 text-indigo-600" />
                Form Submissions
              </h1>
            </div>
            <div className="flex items-center gap-3 self-end">
              <input
                type="text"
                readOnly
                value={window.location.origin + '/form/' + formId}
                className="w-56 px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white/80 backdrop-blur-sm text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                style={{ minWidth: '180px' }}
                onFocus={e => e.target.select()}
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.origin + '/form/' + formId);
                }}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 text-sm shadow-md hover:shadow-lg transition-all duration-200"
                title="Copy form link"
              >
                Copy Link
              </button>
              <button
                onClick={() => navigate(`/builder/${formId}`)}
                className="p-2 rounded-xl hover:bg-white/80 backdrop-blur-sm border border-gray-200 transition-all duration-200"
                title="Edit form"
              >
                <Edit className="w-5 h-5 text-indigo-600" />
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="p-2 rounded-xl hover:bg-white/80 backdrop-blur-sm border border-gray-200 transition-all duration-200"
                title="Delete form"
              >
                <Trash2 className="w-5 h-5 text-red-600" />
              </button>
            </div>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-lg text-gray-700">Loading submissions...</div>
            </div>
          ) : error ? (
            <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl">
              <p className="text-red-600">{error}</p>
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border border-white/20">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                  Submissions ({submissions.length})
                </h3>
                <p className="text-sm text-gray-500">
                  {submissions.length === 0
                    ? 'No submissions received yet.'
                    : `${submissions.length} response${submissions.length !== 1 ? 's' : ''} received`
                  }
                </p>
              </div>
              {submissions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Submission ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Answers
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white/50 backdrop-blur-sm divide-y divide-gray-200">
                      {submissions.map((submission) => (
                        <tr
                          key={submission._id}
                          className="hover:bg-indigo-50/50 cursor-pointer transition-all duration-200"
                          onClick={() => handleViewSubmissionDetail(submission._id)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {submission._id.slice(-8)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(submission.createdAt).toLocaleDateString()} {new Date(submission.createdAt).toLocaleTimeString()}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            <div className="max-w-xs truncate">
                              {Object.keys(submission.answers).length} answer{Object.keys(submission.answers).length !== 1 ? 's' : ''} provided
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-indigo-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No submissions yet</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Share your form to start receiving responses.
                  </p>
                  <div className="mt-6">
                    <Link
                      to={`/form/${formId}`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
                    >
                      <Eye className="w-4 h-4" />
                      Preview Form
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteForm}
        title="Delete Form"
        message="Are you sure you want to delete this form? This action cannot be undone and you will lose all submission history!"
        confirmText="Delete Form"
        cancelText="Cancel"
        isLoading={deleting}
      />
    </>
  );
};

export default FormSubmissions;
