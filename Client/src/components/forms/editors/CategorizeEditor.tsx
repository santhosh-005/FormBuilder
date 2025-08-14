import React, { useState, useEffect } from 'react';
import type { CategorizeQuestion, CategorizeItem } from '../../../types/form';
import ImageUploader from '../../ui/ImageUploader';
import { 
  Plus, 
  Trash2, 
  Save, 
  X,
  AlertCircle 
} from 'lucide-react';

interface CategorizeEditorProps {
  question: CategorizeQuestion;
  onChange: (question: CategorizeQuestion) => void;
  onCancel: () => void;
}

const CategorizeEditor: React.FC<CategorizeEditorProps> = ({
  question,
  onChange,
  onCancel,
}) => {
  const [categories, setCategories] = useState<string[]>(question.categories);
  const [items, setItems] = useState<CategorizeItem[]>(question.items);
  const [newCategory, setNewCategory] = useState('');
  const [newItemText, setNewItemText] = useState('');
  const [imageUrl, setImageUrl] = useState(question.imageUrl || '');

  useEffect(() => {
    setCategories(question.categories);
    setItems(question.items);
    setImageUrl(question.imageUrl || '');
  }, [question]);

  // Validation logic
  const isValidQuestion = () => {
    // Must have at least one category
    if (categories.length === 0) return false;
    
    // Must have at least one item
    if (items.length === 0) return false;
    
    // All categories must be non-empty
    if (categories.some(cat => !cat.trim())) return false;
    
    // All items must have non-empty text
    if (items.some(item => !item.text.trim())) return false;
    
    return true;
  };

  const getValidationMessage = () => {
    if (categories.length === 0) return "Add at least one category";
    if (items.length === 0) return "Add at least one item";
    if (categories.some(cat => !cat.trim())) return "All categories must have text";
    if (items.some(item => !item.text.trim())) return "All items must have text";
    return "";
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
    }
  };

  const handleRemoveCategory = (index: number) => {
    const newCategories = categories.filter((_, i) => i !== index);
    setCategories(newCategories);
    
    // Update items to remove references to deleted category
    const deletedCategory = categories[index];
    const updatedItems = items.map(item => ({
      ...item,
      correctCategory: item.correctCategory === deletedCategory ? undefined : item.correctCategory
    }));
    setItems(updatedItems);
  };

  const handleCategoryChange = (index: number, value: string) => {
    const oldCategory = categories[index];
    const newCategories = [...categories];
    newCategories[index] = value;
    setCategories(newCategories);
    
    // Update items that reference the old category
    const updatedItems = items.map(item => ({
      ...item,
      correctCategory: item.correctCategory === oldCategory ? value : item.correctCategory
    }));
    setItems(updatedItems);
  };

  const handleAddItem = () => {
    if (newItemText.trim()) {
      const newItem: CategorizeItem = {
        id: Date.now().toString(),
        text: newItemText.trim(),
      };
      setItems([...items, newItem]);
      setNewItemText('');
    }
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemTextChange = (index: number, text: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], text };
    setItems(newItems);
  };

  const handleItemCategoryChange = (index: number, category: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], correctCategory: category || undefined };
    setItems(newItems);
  };

  const handleImageUpload = (url: string) => {
    setImageUrl(url || '');
  };

  const handleSaveAndClose = () => {
    const updatedQuestion: CategorizeQuestion = {
      type: 'categorize',
      categories,
      items,
      imageUrl: imageUrl || undefined,
    };
    onChange(updatedQuestion);
    onCancel();
  };

  return (
    <div className="space-y-6">
      {/* Categories Section */}
      <div>
        <h4 className="text-lg font-medium mb-3">Categories</h4>
        <div className="space-y-2">
          {categories.map((category, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={category}
                onChange={(e) => handleCategoryChange(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Category name"
              />
              <button
                onClick={() => handleRemoveCategory(index)}
                className="flex items-center gap-1 px-3 py-2 text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </button>
            </div>
          ))}
          
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add new category"
            />
            <button
              onClick={handleAddCategory}
              className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Items Section */}
      <div>
        <h4 className="text-lg font-medium mb-3">Items to Categorize</h4>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={item.id} className="border border-gray-200 rounded-lg p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item.text}
                    onChange={(e) => handleItemTextChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Item text"
                  />
                  <button
                    onClick={() => handleRemoveItem(index)}
                    className="flex items-center gap-1 px-3 py-2 text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Correct Category</label>
                    <select
                      value={item.correctCategory || ''}
                      onChange={(e) => handleItemCategoryChange(index, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add new item"
            />
            <button
              onClick={handleAddItem}
              className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add Item
            </button>
          </div>
        </div>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium mb-2">Question Image (optional)</label>
        <ImageUploader
          onUpload={handleImageUpload}
          initialUrl={imageUrl}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-4 border-t">
        <div className="flex-1"></div>
        <button
          onClick={handleSaveAndClose}
          disabled={!isValidQuestion()}
          className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          Save & Close
        </button>
        <button
          onClick={onCancel}
          className="flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
        {!isValidQuestion() && (
          <div className="flex items-center gap-2 text-sm text-red-600 ml-2">
            <AlertCircle className="w-4 h-4" />
            {getValidationMessage()}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategorizeEditor;
