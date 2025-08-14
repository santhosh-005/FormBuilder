import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { ComprehensionQuestion } from '../../../types/form';

interface ComprehensionRendererProps {
  question: ComprehensionQuestion;
  onAnswer: (answer: number[]) => void;
  initialAnswer?: number[];
}

const ComprehensionRenderer: React.FC<ComprehensionRendererProps> = ({
  question,
  onAnswer,
  initialAnswer = [],
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(() => 
    initialAnswer.length > 0 ? initialAnswer : []
  );

  // Memoize initial answer to prevent unnecessary updates
  const memoizedInitialAnswer = useMemo(() => initialAnswer, [JSON.stringify(initialAnswer)]);

  useEffect(() => {
    // Only update if we have a meaningful initial answer and it's different from current state
    if (memoizedInitialAnswer.length > 0) {
      setSelectedAnswers(prevAnswers => {
        if (prevAnswers.length !== memoizedInitialAnswer.length || 
            prevAnswers.some((val, index) => val !== memoizedInitialAnswer[index])) {
          return memoizedInitialAnswer;
        }
        return prevAnswers;
      });
      // Do NOT call onAnswer here to avoid infinite parent updates
    }
  }, [memoizedInitialAnswer]);

  const handleAnswerChange = useCallback((questionIndex: number, optionIndex: number) => {
    // Only update if the answer actually changed
    if (selectedAnswers[questionIndex] !== optionIndex) {
      const newAnswers = [...selectedAnswers];
      newAnswers[questionIndex] = optionIndex;
      setSelectedAnswers(newAnswers);
    }
  }, [selectedAnswers]);

  // Call onAnswer directly when user interacts
  const handleAnswerChangeWithInteraction = useCallback((questionIndex: number, optionIndex: number) => {
    handleAnswerChange(questionIndex, optionIndex);
    // Call onAnswer immediately after updating selectedAnswers
    const newAnswers = [...selectedAnswers];
    newAnswers[questionIndex] = optionIndex;
    onAnswer(newAnswers);
  }, [handleAnswerChange, onAnswer, selectedAnswers]);

  return (
    <div className="space-y-6">
      {/* Question Image */}
      {question.imageUrl && (
        <div className="text-center">
          <img
            src={question.imageUrl}
            alt="Passage illustration"
            className="max-w-full h-auto max-h-64 mx-auto rounded-lg shadow-sm"
          />
        </div>
      )}

      {/* Reading Passage */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Reading Passage</h3>
        <div className="prose max-w-none">
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {question.passage}
          </p>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-800">Questions</h3>
        
        {question.questions.map((mcq, questionIndex) => (
          <div key={mcq.id} className="border border-gray-200 rounded-lg p-4">
            <div className="mb-4">
              <h4 className="font-medium text-gray-800 mb-3">
                {questionIndex + 1}. {mcq.questionText}
              </h4>
            </div>

            <div className="space-y-3">
              {mcq.options.map((option, optionIndex) => {
                const isSelected = selectedAnswers[questionIndex] === optionIndex;
                return (
                  <label
                    key={optionIndex}
                    className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-blue-50 border-2 border-blue-200'
                        : 'bg-white border-2 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${questionIndex}`}
                      value={optionIndex}
                      checked={isSelected}
                      onChange={() => handleAnswerChangeWithInteraction(questionIndex, optionIndex)}
                      className="mt-1 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700 leading-relaxed">
                      <span className="font-medium text-gray-600 mr-2">
                        {String.fromCharCode(65 + optionIndex)}.
                      </span>
                      {option}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}

        {question.questions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No questions available for this passage.
          </div>
        )}
      </div>

      {/* Answer Summary */}
      {question.questions.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Your Answers:</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {question.questions.map((_, questionIndex) => (
              <div key={questionIndex} className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">
                  Q{questionIndex + 1}:
                </span>
                <span className="font-medium">
                  {selectedAnswers[questionIndex] !== undefined
                    ? String.fromCharCode(65 + selectedAnswers[questionIndex])
                    : '—'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComprehensionRenderer;
