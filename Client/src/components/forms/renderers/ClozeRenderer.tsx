import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { ClozeQuestion } from '../../../types/form';

interface ClozeRendererProps {
  question: ClozeQuestion;
  onAnswer: (answer: { [blankId: string]: string }) => void;
  initialAnswer?: { [blankId: string]: string };
}

interface DraggableOptionProps {
  option: string;
  isUsed: boolean;
}

interface DroppableBlankProps {
  blankId: string;
  value: string;
  placeholder: string;
  onDrop: (blankId: string, value: string) => void;
  onClear: (blankId: string) => void;
}

const DraggableOption: React.FC<DraggableOptionProps> = ({ option, isUsed }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: option,
    disabled: isUsed,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        px-3 py-2 rounded-lg border-2 text-sm font-medium cursor-pointer
        select-none transition-all duration-200
        ${isUsed 
          ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-50' 
          : isDragging
            ? 'bg-blue-100 border-blue-300 text-blue-700 shadow-lg scale-105'
            : 'bg-white border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-200 hover:shadow-md'
        }
      `}
    >
      {option}
    </div>
  );
};

const DroppableBlank: React.FC<DroppableBlankProps> = ({ 
  blankId, 
  value, 
  placeholder, 
  onClear 
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id: blankId,
  });

  return (
    <span
      ref={setNodeRef}
      className={`
        inline-flex items-center min-w-20 px-2 py-1 mx-1 border-2 border-dashed rounded
        transition-all duration-200 cursor-pointer
        ${isOver 
          ? 'border-blue-400 bg-blue-50' 
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
  const [activeId, setActiveId] = useState<string | null>(null);

  // Memoize initial answer to prevent unnecessary updates, but handle empty objects correctly
  const memoizedInitialAnswer = useMemo(() => {
    // Always create a new reference for reset detection
    return { ...initialAnswer };
  }, [JSON.stringify(initialAnswer)]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    // Update answers when initialAnswer changes (including reset to empty object)
    setAnswers(memoizedInitialAnswer);
    // Do NOT call onAnswer here to avoid infinite parent updates
  }, [memoizedInitialAnswer]);

  const updateAnswers = useCallback((newAnswers: { [blankId: string]: string }) => {
    setAnswers(newAnswers);
    onAnswer(newAnswers);
  }, [onAnswer]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const draggedOption = active.id as string;
      const targetBlankId = over.id as string;

      // Check if the target is a valid blank
      const isValidBlank = question.blanks.some(blank => blank.id === targetBlankId);
      
      if (isValidBlank) {
        const newAnswers = { ...answers };
        
        // Remove the option from any existing blank
        Object.keys(newAnswers).forEach(blankId => {
          if (newAnswers[blankId] === draggedOption) {
            delete newAnswers[blankId];
          }
        });
        
        // Add to the new blank
        newAnswers[targetBlankId] = draggedOption;
        updateAnswers(newAnswers);
      }
    }
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
            onDrop={() => {}} // Handled by DndContext
            onClear={handleClearBlank}
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
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-6">
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

      {/* Drag Overlay */}
      <DragOverlay>
        {activeId ? (
          <div className="px-3 py-2 rounded-lg border-2 border-blue-400 bg-blue-100 text-blue-700 text-sm font-medium shadow-lg">
            {activeId}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default ClozeRenderer;
