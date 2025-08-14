import React, { useState, useEffect } from 'react';
import type { ComprehensionQuestion, ComprehensionOption } from '../../../types/form';
import ImageUploader from '../../ui/ImageUploader';

interface ComprehensionEditorProps {
  question: ComprehensionQuestion;
  onChange: (question: ComprehensionQuestion) => void;
  onCancel: () => void;
}

const ComprehensionEditor: React.FC<ComprehensionEditorProps> = ({
  question,
  onChange,
  onCancel,
}) => {
  const [passage, setPassage] = useState(question.passage);
  const [questions, setQuestions] = useState<ComprehensionOption[]>(question.questions);
  const [imageUrl, setImageUrl] = useState(question.imageUrl || '');

  useEffect(() => {
    setPassage(question.passage);
    setQuestions(question.questions);
    setImageUrl(question.imageUrl || '');
  }, [question]);

  // Enhanced validation logic
  const isValidQuestion = () => {
    // Must have passage text
    if (!passage.trim()) return false;
    
    // Must have at least one question
    if (questions.length === 0) return false;
    
    // All questions must have valid content
    return questions.every(q => {
      // Question text must not be empty
      if (!q.questionText.trim()) return false;
      
      // Must have at least 2 options
      if (q.options.length < 2) return false;
      
      // All options must be non-empty
      if (q.options.some(opt => !opt.trim())) return false;
      
      // Correct index must be valid
      if (q.correctIndex < 0 || q.correctIndex >= q.options.length) return false;
      
      return true;
    });
  };

  const getValidationMessage = () => {
    if (!passage.trim()) return "Enter the reading passage";
    if (questions.length === 0) return "Add at least one question";
    
    const invalidQuestion = questions.find((q, index) => {
      if (!q.questionText.trim()) return `Question ${index + 1} text is required`;
      if (q.options.length < 2) return `Question ${index + 1} needs at least 2 options`;
      if (q.options.some(opt => !opt.trim())) return `Question ${index + 1} has empty options`;
      if (q.correctIndex < 0 || q.correctIndex >= q.options.length) return `Question ${index + 1} has invalid correct answer`;
      return false;
    });
    
    return invalidQuestion ? "Fix validation errors above" : "";
  };

  // Auto-save whenever local state changes
  useEffect(() => {
    const updatedQuestion: ComprehensionQuestion = {
      type: 'comprehension',
      passage,
      questions,
      imageUrl: imageUrl || undefined,
    };
    
    // Only save if the question is valid and different from the original
    if (isValidQuestion() && JSON.stringify(updatedQuestion) !== JSON.stringify(question)) {
      onChange(updatedQuestion);
    }
  }, [passage, questions, imageUrl, onChange, question]);

  const handlePassageChange = (text: string) => {
    setPassage(text);
  };

  const handleAddQuestion = () => {
    const newQuestion: ComprehensionOption = {
      id: Date.now().toString(),
      questionText: '',
      options: ['', '', '', ''],
      correctIndex: 0,
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleQuestionTextChange = (index: number, text: string) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], questionText: text };
    setQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, text: string) => {
    const newQuestions = [...questions];
    const newOptions = [...newQuestions[questionIndex].options];
    newOptions[optionIndex] = text;
    newQuestions[questionIndex] = { ...newQuestions[questionIndex], options: newOptions };
    setQuestions(newQuestions);
  };

  const handleCorrectAnswerChange = (questionIndex: number, correctIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex] = { ...newQuestions[questionIndex], correctIndex };
    setQuestions(newQuestions);
  };

  const handleAddOption = (questionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.push('');
    setQuestions(newQuestions);
  };

  const handleRemoveOption = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...questions];
    if (newQuestions[questionIndex].options.length > 2) {
      newQuestions[questionIndex].options = newQuestions[questionIndex].options.filter((_, i) => i !== optionIndex);
      
      // Adjust correct index if necessary
      if (newQuestions[questionIndex].correctIndex >= optionIndex) {
        newQuestions[questionIndex].correctIndex = Math.max(0, newQuestions[questionIndex].correctIndex - 1);
      }
      
      setQuestions(newQuestions);
    }
  };

  const handleImageUpload = (url: string) => {
    setImageUrl(url || '');
  };

  const handleSaveAndClose = () => {
    // Force a final save regardless of validation state
    const updatedQuestion: ComprehensionQuestion = {
      type: 'comprehension',
      passage,
      questions,
      imageUrl: imageUrl || undefined,
    };
    onChange(updatedQuestion);
    // Navigate back to overview
    onCancel();
  };

  return (
    <div className="space-y-6">
      {/* Passage Section */}
      <div>
        <label className="block text-sm font-medium mb-2">Reading Passage</label>
        <textarea
          value={passage}
          onChange={(e) => handlePassageChange(e.target.value)}
          rows={8}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter the reading passage here..."
        />
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium mb-2">Passage Image (optional)</label>
        <ImageUploader
          onUpload={handleImageUpload}
          initialUrl={imageUrl}
        />
      </div>

      {/* Questions Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-medium">Comprehension Questions</h4>
          <button
            onClick={handleAddQuestion}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Question
          </button>
        </div>

        <div className="space-y-6">
          {questions.map((mcq, questionIndex) => (
            <div key={mcq.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-medium">Question {questionIndex + 1}</h5>
                <button
                  onClick={() => handleRemoveQuestion(questionIndex)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>

              <div className="space-y-4">
                {/* Question Text */}
                <div>
                  <label className="block text-sm font-medium mb-2">Question Text</label>
                  <input
                    type="text"
                    value={mcq.questionText}
                    onChange={(e) => handleQuestionTextChange(questionIndex, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter the question..."
                  />
                </div>

                {/* Options */}
                <div>
                  <label className="block text-sm font-medium mb-2">Answer Options</label>
                  <div className="space-y-2">
                    {mcq.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correct-${questionIndex}`}
                          checked={mcq.correctIndex === optionIndex}
                          onChange={() => handleCorrectAnswerChange(questionIndex, optionIndex)}
                          className="mt-1"
                        />
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={`Option ${optionIndex + 1}`}
                        />
                        {mcq.options.length > 2 && (
                          <button
                            onClick={() => handleRemoveOption(questionIndex, optionIndex)}
                            className="text-red-600 hover:text-red-800 px-2"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => handleAddOption(questionIndex)}
                    className="mt-2 px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
                  >
                    + Add Option
                  </button>
                </div>

                {/* Correct Answer Indicator */}
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Correct Answer:</span> Option {mcq.correctIndex + 1}
                  {mcq.options[mcq.correctIndex] && ` (${mcq.options[mcq.correctIndex]})`}
                </div>
              </div>
            </div>
          ))}
        </div>

        {questions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No questions yet. Click "Add Question" to get started.
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-4 border-t">
        <div className="flex-1"></div>
        <button
          onClick={handleSaveAndClose}
          disabled={!isValidQuestion()}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save & Close
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        {!isValidQuestion() && (
          <div className="text-sm text-red-600 ml-2">
            {getValidationMessage()}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComprehensionEditor;
