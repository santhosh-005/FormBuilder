import React, { useState, useEffect } from 'react';
import type { ClozeQuestion, ClozeBlank } from '../../../types/form';
import ImageUploader from '../../ui/ImageUploader';

interface ClozeEditorProps {
  question: ClozeQuestion;
  onChange: (question: ClozeQuestion) => void;
  onCancel: () => void;
}

const ClozeEditor: React.FC<ClozeEditorProps> = ({
  question,
  onChange,
  onCancel,
}) => {
  const [rawText, setRawText] = useState('');
  const [processedText, setProcessedText] = useState(question.text);
  const [blanks, setBlanks] = useState<ClozeBlank[]>(question.blanks);
  const [imageUrl, setImageUrl] = useState(question.imageUrl || '');
  const [options, setOptions] = useState<string[]>(question.options || []);
  const [newOption, setNewOption] = useState('');

  useEffect(() => {
    // Initialize rawText from question.text and blanks
    let text = question.text;
    
    if (question.blanks && question.blanks.length > 0) {
      // Sort blanks by their position in the text
      const sortedBlanks = [...question.blanks].sort((a, b) => 
        question.text.indexOf(`[${a.id}]`) - question.text.indexOf(`[${b.id}]`)
      );
      
      // Replace blank placeholders with double underscores for editing
      sortedBlanks.forEach((blank) => {
        const blankPattern = `[${blank.id}]`;
        const replacement = blank.answerHint ? `__${blank.answerHint}__` : '__blank__';
        text = text.replace(blankPattern, replacement);
      });
    }
    
    setRawText(text);
    setProcessedText(question.text);
    setBlanks(question.blanks);
    setImageUrl(question.imageUrl || '');
    setOptions(question.options || []);
  }, [question]);

  // Validation logic
  const isValidQuestion = () => {
    // Must have text
    if (!processedText.trim()) return false;
    
    // Must have at least one blank
    if (blanks.length === 0) return false;
    
    return true;
  };

  const getValidationMessage = () => {
    if (!processedText.trim()) return "Enter text for the question";
    if (blanks.length === 0) return "Add at least one blank using double underscores (__word__)";
    return "";
  };

  // Auto-save whenever local state changes
  useEffect(() => {
    const updatedQuestion: ClozeQuestion = {
      type: 'cloze',
      text: processedText,
      blanks,
      imageUrl: imageUrl || undefined,
      options: options.length > 0 ? options : undefined,
    };
    
    // Only save if the question is valid and different from the original
    if (isValidQuestion() && JSON.stringify(updatedQuestion) !== JSON.stringify(question)) {
      onChange(updatedQuestion);
    }
  }, [processedText, blanks, imageUrl, options, onChange, question]);

  const processText = (text: string) => {
    // Find all words between double underscores
    const blankPattern = /__([^_]+)__/g;
    const matches = Array.from(text.matchAll(blankPattern));
    
    let processedText = text;
    const newBlanks: ClozeBlank[] = [];
    
    matches.forEach((match, index) => {
      const blankId = `blank_${Date.now()}_${index}`;
      const answerHint = match[1].trim();
      
      // Replace the double underscore pattern with blank placeholder
      processedText = processedText.replace(match[0], `[${blankId}]`);
      
      newBlanks.push({
        id: blankId,
        answerHint: answerHint !== 'blank' ? answerHint : undefined,
      });
    });
    
    setProcessedText(processedText);
    setBlanks(newBlanks);
  };

  const handleTextChange = (text: string) => {
    setRawText(text);
    processText(text);
  };

  const handleBlankHintChange = (blankId: string, hint: string) => {
    const newBlanks = blanks.map(blank =>
      blank.id === blankId
        ? { ...blank, answerHint: hint.trim() || undefined }
        : blank
    );
    setBlanks(newBlanks);
  };

  const getPreviewText = () => {
    // If we have rawText with __ patterns, show that with visual blanks
    if (rawText && rawText.includes('__')) {
      return rawText.replace(/__([^_]+)__/g, '___________');
    }
    
    // Otherwise, use the processed text with blanks
    let preview = processedText;
    blanks.forEach((blank) => {
      const blankPattern = `[${blank.id}]`;
      const displayText = '___________'; // Visual blank placeholder
      preview = preview.replace(blankPattern, displayText);
    });
    return preview;
  };

  const handleSaveAndClose = () => {
    // Force a final save regardless of validation state
    const updatedQuestion: ClozeQuestion = {
      type: 'cloze',
      text: processedText,
      blanks,
      imageUrl: imageUrl || undefined,
      options: options.length > 0 ? options : undefined,
    };
    onChange(updatedQuestion);
    // Navigate back to overview
    onCancel();
  };

  const addOption = () => {
    if (newOption.trim() && !options.includes(newOption.trim())) {
      setOptions([...options, newOption.trim()]);
      setNewOption('');
    }
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addOption();
    }
  };

  const handleImageUpload = (url: string) => {
    setImageUrl(url);
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">How to create blanks:</h4>
        <p className="text-blue-800 text-sm">
          Type your text and surround words you want to be blanks with double underscores.
          Example: "The capital of France is __Paris__" will create a blank for "Paris".
        </p>
      </div>

      {/* Text Input */}
      <div>
        <label className="block text-sm font-medium mb-2">Question Text</label>
        <textarea
          value={rawText}
          onChange={(e) => handleTextChange(e.target.value)}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your text here. Use __word__ to create blanks."
        />
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium mb-2">Image (optional)</label>
        <ImageUploader
          onUpload={handleImageUpload}
          initialUrl={imageUrl}
        />
      </div>

      {/* Answer Options for Drag & Drop */}
      <div>
        <label className="block text-sm font-medium mb-2">Answer Options (for drag & drop)</label>
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add answer option (e.g., Jupiter, Mars, 79)"
            />
            <button
              type="button"
              onClick={addOption}
              disabled={!newOption.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              Add
            </button>
          </div>
          
          {options.length > 0 && (
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-gray-700">Available Options:</h5>
              <div className="flex flex-wrap gap-2">
                {options.map((option, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    <span>{option}</span>
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="text-blue-600 hover:text-blue-800 font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-600">
                Tip: Include correct answers and some distractors. Users will drag these to fill blanks.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Preview */}
      {processedText && (
        <div>
          <h4 className="text-sm font-medium mb-2">Preview</h4>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="whitespace-pre-wrap">{getPreviewText()}</p>
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Question image"
                className="mt-3 max-w-xs rounded-lg"
              />
            )}
          </div>
        </div>
      )}

      {/* Blank Settings */}
      {blanks.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-3">Blank Placeholders</h4>
          <div className="space-y-3">
            {blanks.map((blank, index) => (
              <div key={blank.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">
                  Blank {index + 1}:
                </span>
                <div className="flex-1">
                  <input
                    type="text"
                    value={blank.answerHint || ''}
                    onChange={(e) => handleBlankHintChange(blank.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Answer hint (optional)"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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

export default ClozeEditor;
