import React from 'react';
import type { Question } from '../../../types/form';
import { 
  Edit, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Layers,
  FileText,
  BookOpen
} from 'lucide-react';

interface QuestionListProps {
  questions: Question[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
  onMove: (index: number, direction: 'up' | 'down') => void;
}

const QuestionList: React.FC<QuestionListProps> = ({
  questions,
  onEdit,
  onDelete,
  onMove,
}) => {
  const getQuestionIcon = (type: Question['type']) => {
    switch (type) {
      case 'categorize':
        return <Layers className="w-4 h-4" />;
      case 'cloze':
        return <FileText className="w-4 h-4" />;
      case 'comprehension':
        return <BookOpen className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getQuestionPreview = (question: Question): string => {
    switch (question.type) {
      case 'categorize':
        return `Categorize question with ${question.categories.length} categories and ${question.items.length} items`;
      case 'cloze':
        return `Cloze question: ${question.text.substring(0, 60)}${question.text.length > 60 ? '...' : ''}`;
      case 'comprehension':
        return `Comprehension question with ${question.questions.length} sub-questions`;
      default:
        return 'Unknown question type';
    }
  };

  if (questions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No questions yet. Click "Add Question" to get started.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {questions.map((question, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-lg p-4 bg-white"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                  {getQuestionIcon(question.type)}
                  {question.type.charAt(0).toUpperCase() + question.type.slice(1)}
                </span>
                <span className="text-sm text-gray-500">Question {index + 1}</span>
              </div>
              <p className="text-sm text-gray-700">{getQuestionPreview(question)}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => onMove(index, 'up')}
                  disabled={index === 0}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="Move up"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onMove(index, 'down')}
                  disabled={index === questions.length - 1}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="Move down"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              <div className="border-l border-gray-200 h-8 mx-2"></div>
              <button
                onClick={() => onEdit(index)}
                className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => onDelete(index)}
                className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuestionList;
