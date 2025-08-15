import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { ClozeQuestion } from '../../../types/form';

interface ClozeRendererProps {
  question: ClozeQuestion;
  onAnswer: (answer: { [blankId: string]: string }) => void;
  initialAnswer?: { [blankId: string]: string };
}

interface DraggableOptionProps {
  option: string;
  isUsed: boolean;
  onDragStart: (option: string) => void;
  isDragging: boolean;
}

interface DroppableBlankProps {
  blankId: string;
  value: string;
  placeholder: string;
  onDrop: (blankId: string, option: string) => void;
  onClear: (blankId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  isOver: boolean;
}

const DraggableOption: React.FC<DraggableOptionProps> = ({ option, isUsed, onDragStart, isDragging }) => {
  const handleDragStart = (e: React.DragEvent) => {
    if (isUsed) {
      e.preventDefault();
      return;
    }

    // Create a custom drag image that's positioned correctly
    const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
    dragImage.style.transform = 'rotate(2deg)';
    dragImage.style.opacity = '0.8';
    dragImage.style.width = '120px'; // Fixed width
    dragImage.style.minWidth = '120px';
    dragImage.style.maxWidth = '120px';
    dragImage.style.whiteSpace = 'nowrap';
    dragImage.style.overflow = 'hidden';
    dragImage.style.textOverflow = 'ellipsis';
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px'; // Hide it off-screen
    dragImage.style.left = '-1000px';
    dragImage.style.zIndex = '9999';
    document.body.appendChild(dragImage);
    
    // Set the drag image with offset to cursor position
    e.dataTransfer.setDragImage(dragImage, 60, 15); // Center horizontally (120/2)
    
    // Clean up the temporary element after a brief delay
    setTimeout(() => {
      if (document.body.contains(dragImage)) {
        document.body.removeChild(dragImage);
      }
    }, 0);

    // Set the data for the drag operation
    e.dataTransfer.setData('text/plain', option);
    onDragStart(option);
  };

  return (
    <div
      draggable={!isUsed}
      onDragStart={handleDragStart}
      className={`
        px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all duration-200
        select-none
        ${isUsed 
          ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-50' 
          : isDragging
            ? 'opacity-50 scale-95'
            : 'bg-white border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-200 hover:shadow-md cursor-grab hover:scale-105'
        }
      `}
      style={{ userSelect: 'none' }}
    >
      {option}
    </div>
  );
};

const DroppableBlank: React.FC<DroppableBlankProps> = ({ 
  blankId, 
  value, 
  placeholder, 
  onDrop,
  onClear,
  onDragOver,
  isOver
}) => {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const option = e.dataTransfer.getData('text/plain');
    if (option) {
      onDrop(blankId, option);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    onDragOver(e);
  };

  return (
    <span
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={(e) => e.preventDefault()}
      className={`
        inline-flex items-center min-w-20 px-2 py-1 mx-1 border-2 border-dashed rounded
        transition-all duration-200 cursor-pointer
        ${isOver 
          ? 'border-blue-400 bg-blue-50 scale-105' 
          : value 
            ? 'border-green-300 bg-green-50' 
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
        }
      `}
      onClick={() => value && onClear(blankId)}
      title={value ? 'Click to remove' : 'Drop an answer here'}
    >
      {value ? (
        <span className="text-green-700 font-medium">{value}</span>
      ) : (
        <span className="text-gray-400 text-xs">{placeholder}</span>
      )}
    </span>
  );
};

const ClozeRenderer: React.FC<ClozeRendererProps> = ({
  question,
  onAnswer,
  initialAnswer = {},
}) => {
  const [answers, setAnswers] = useState<{ [blankId: string]: string }>(() => initialAnswer);
  const [draggingOption, setDraggingOption] = useState<string | null>(null);
  const [dragOverBlank, setDragOverBlank] = useState<string | null>(null);

  // Memoize initial answer to prevent unnecessary updates, but handle empty objects correctly
  const memoizedInitialAnswer = useMemo(() => {
    // Always create a new reference for reset detection
    return { ...initialAnswer };
  }, [JSON.stringify(initialAnswer)]);

  useEffect(() => {
    // Update answers when initialAnswer changes (including reset to empty object)
    setAnswers(memoizedInitialAnswer);
    // Do NOT call onAnswer here to avoid infinite parent updates
  }, [memoizedInitialAnswer]);

  const updateAnswers = useCallback((newAnswers: { [blankId: string]: string }) => {
    setAnswers(newAnswers);
    onAnswer(newAnswers);
  }, [onAnswer]);

  const handleDragStart = (option: string) => {
    setDraggingOption(option);
  };

  const handleDragEnd = () => {
    setDraggingOption(null);
    setDragOverBlank(null);
  };

  const handleDrop = (blankId: string, option: string) => {
    const newAnswers = { ...answers };
    
    // Remove the option from any existing blank
    Object.keys(newAnswers).forEach(id => {
      if (newAnswers[id] === option) {
        delete newAnswers[id];
      }
    });
    
    // Add to the new blank
    newAnswers[blankId] = option;
    updateAnswers(newAnswers);
    
    setDraggingOption(null);
    setDragOverBlank(null);
  };

  const handleDragOver = (blankId: string) => {
    setDragOverBlank(blankId);
  };

  const handleClearBlank = useCallback((blankId: string) => {
    const newAnswers = { ...answers };
    delete newAnswers[blankId];
    updateAnswers(newAnswers);
  }, [answers, updateAnswers]);

  // Get used options to disable them
  const usedOptions = Object.values(answers);

  const renderTextWithBlanks = () => {
    let text = question.text;
    const elements: React.ReactNode[] = [];
    let lastIndex = 0;

    // Find all blank placeholders in the text
    const blankPattern = /\[([^\]]+)\]/g;
    let match;

    while ((match = blankPattern.exec(question.text)) !== null) {
      const blankId = match[1];
      const blank = question.blanks.find(b => b.id === blankId);
      
      if (blank) {
        // Add text before the blank
        if (match.index > lastIndex) {
          elements.push(
            <span key={`text-${lastIndex}`}>
              {text.substring(lastIndex, match.index)}
            </span>
          );
        }

        // Add the droppable blank
        elements.push(
          <DroppableBlank
            key={blankId}
            blankId={blankId}
            value={answers[blankId] || ''}
            placeholder={blank.answerHint || 'drop here'}
            onDrop={handleDrop}
            onClear={handleClearBlank}
            onDragOver={(e) => handleDragOver(blankId)}
            isOver={dragOverBlank === blankId}
          />
        );

        lastIndex = match.index + match[0].length;
      }
    }

    // Add remaining text after the last blank
    if (lastIndex < text.length) {
      elements.push(
        <span key={`text-${lastIndex}`}>
          {text.substring(lastIndex)}
        </span>
      );
    }

    return elements;
  };

  return (
    <div 
      className="space-y-6"
      onDragEnd={handleDragEnd}
    >
      {/* Question Image */}
      {question.imageUrl && (
        <div className="flex justify-center">
          <img
            src={question.imageUrl}
            alt="Question illustration"
            className="max-w-md rounded-lg shadow-sm"
          />
        </div>
      )}

      {/* Answer Options */}
      {question.options && question.options.length > 0 && (
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-3">
            Drag the correct answers to fill in the blanks:
          </h4>
          <div className="flex flex-wrap gap-2">
            {question.options.map((option) => (
              <DraggableOption
                key={option}
                option={option}
                isUsed={usedOptions.includes(option)}
                onDragStart={handleDragStart}
                isDragging={draggingOption === option}
              />
            ))}
          </div>
        </div>
      )}

      {/* Question Text with Droppable Blanks */}
      <div className="text-base leading-relaxed p-4 bg-white rounded-lg border">
        <div className="whitespace-pre-wrap">
          {renderTextWithBlanks()}
        </div>
      </div>

      {/* Answer Summary */}
      {question.blanks.length > 0 && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Your Answers:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {question.blanks.map((blank, index) => (
              <div key={blank.id} className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">
                  Blank {index + 1}:
                </span>
                <span className={`font-medium ${answers[blank.id] ? 'text-green-600' : 'text-gray-400'}`}>
                  {answers[blank.id] || '(empty)'}
                </span>
                {blank.answerHint && (
                  <span className="text-gray-500 text-xs">
                    (hint: {blank.answerHint})
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fallback to text inputs if no options provided */}
      {(!question.options || question.options.length === 0) && (
        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h4 className="text-sm font-medium text-yellow-800 mb-2">
            Manual Input Mode:
          </h4>
          <div className="space-y-2">
            {question.blanks.map((blank, index) => (
              <div key={blank.id} className="flex items-center gap-2">
                <label className="text-sm text-yellow-700 min-w-20">
                  Blank {index + 1}:
                </label>
                <input
                  type="text"
                  value={answers[blank.id] || ''}
                  onChange={(e) => {
                    const newAnswers = { ...answers, [blank.id]: e.target.value };
                    updateAnswers(newAnswers);
                  }}
                  className="px-2 py-1 border border-yellow-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder={blank.answerHint || 'Enter answer'}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClozeRenderer;
