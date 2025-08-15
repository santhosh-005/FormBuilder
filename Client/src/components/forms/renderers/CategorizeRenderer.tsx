import React, { useState, useEffect, useRef } from 'react';
import type { CategorizeQuestion, CategorizeItem } from '../../../types/form';

interface CategorizeRendererProps {
  question: CategorizeQuestion;
  onAnswer: (answer: { [itemId: string]: string }) => void;
  initialAnswer?: { [itemId: string]: string };
}

interface DraggableItemProps {
  item: CategorizeItem;
  onDragStart: (item: CategorizeItem, e: React.DragEvent) => void;
  isDragging: boolean;
}

interface DroppableCategoryProps {
  category: string;
  items: CategorizeItem[];
  onRemoveItem: (itemId: string) => void;
  onDrop: (itemId: string, category: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  isOver: boolean;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ item, onDragStart, isDragging }) => {
  const handleDragStart = (e: React.DragEvent) => {
    // Create a custom drag image that's positioned correctly
    const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
    dragImage.style.transform = 'rotate(2deg)';
    dragImage.style.opacity = '0.8';
    dragImage.style.width = '150px'; // Fixed width
    dragImage.style.minWidth = '150px';
    dragImage.style.maxWidth = '150px';
    dragImage.style.whiteSpace = 'nowrap';
    dragImage.style.overflow = 'hidden';
    dragImage.style.textOverflow = 'ellipsis';
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px'; // Hide it off-screen
    dragImage.style.left = '-1000px';
    dragImage.style.zIndex = '9999';
    document.body.appendChild(dragImage);
    
    // Set the drag image with offset to cursor position
    e.dataTransfer.setDragImage(dragImage, 75, 20); // Center horizontally (150/2)
    
    // Clean up the temporary element after a brief delay
    setTimeout(() => {
      if (document.body.contains(dragImage)) {
        document.body.removeChild(dragImage);
      }
    }, 0);

    onDragStart(item, e);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className={`p-3 bg-blue-100 border border-blue-200 rounded-lg cursor-grab shadow-sm hover:shadow-md transition-all duration-200 ${
        isDragging ? 'opacity-50 scale-95' : 'hover:scale-105'
      }`}
      style={{ userSelect: 'none' }}
    >
      <span className="text-sm font-medium text-blue-900">{item.text}</span>
    </div>
  );
};

const DroppableCategory: React.FC<DroppableCategoryProps> = ({ 
  category, 
  items, 
  onRemoveItem,
  onDrop,
  onDragOver,
  isOver
}) => {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('text/plain');
    onDrop(itemId, category);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    onDragOver(e);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={(e) => e.preventDefault()}
      className={`p-4 border-2 border-dashed rounded-lg min-h-32 transition-all duration-200 ${
        isOver 
          ? 'border-blue-400 bg-blue-50 scale-[1.02]' 
          : 'border-gray-300 bg-gray-50'
      }`}
    >
      <h3 className="font-medium text-gray-700 mb-3">{category}</h3>
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-2 bg-white border border-gray-200 rounded flex items-center justify-between shadow-sm"
          >
            <span className="text-sm">{item.text}</span>
            <button
              onClick={() => onRemoveItem(item.id)}
              className="text-gray-400 hover:text-red-600 text-lg font-bold leading-none transition-colors duration-200 hover:scale-110"
              title="Remove item"
            >
              ×
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-6">
            Drop items here
          </p>
        )}
      </div>
    </div>
  );
};

const CategorizeRenderer: React.FC<CategorizeRendererProps> = ({
  question,
  onAnswer,
  initialAnswer = {},
}) => {
  const [itemPlacements, setItemPlacements] = useState<{ [itemId: string]: string }>(initialAnswer);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dragOverCategory, setDragOverCategory] = useState<string | null>(null);
  const prevInitialAnswerRef = useRef<{ [itemId: string]: string }>(initialAnswer);

  // Update itemPlacements when initialAnswer changes (for reset functionality)
  useEffect(() => {
    if (JSON.stringify(initialAnswer) !== JSON.stringify(prevInitialAnswerRef.current)) {
      setItemPlacements(initialAnswer);
      prevInitialAnswerRef.current = initialAnswer;
    }
  }, [initialAnswer]);

  const handleDragStart = (item: CategorizeItem, e: React.DragEvent) => {
    setDraggedItemId(item.id);
    e.dataTransfer.setData('text/plain', item.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedItemId(null);
    setDragOverCategory(null);
  };

  const handleDrop = (itemId: string, category: string) => {
    const newPlacements = { ...itemPlacements };
    newPlacements[itemId] = category;
    setItemPlacements(newPlacements);
    onAnswer(newPlacements);
    setDraggedItemId(null);
    setDragOverCategory(null);
  };

  const handleDragOver = (category: string) => {
    setDragOverCategory(category);
  };

  const handleRemoveItem = (itemId: string) => {
    const newPlacements = { ...itemPlacements };
    delete newPlacements[itemId];
    setItemPlacements(newPlacements);
    onAnswer(newPlacements);
  };

  const getUnplacedItems = () => {
    return question.items.filter(item => !itemPlacements[item.id]);
  };

  const getItemsInCategory = (category: string) => {
    return question.items.filter(item => itemPlacements[item.id] === category);
  };

  return (
    <div className="space-y-6" onDragEnd={handleDragEnd}>
      {/* Question Image */}
      {question.imageUrl && (
        <div className="text-center">
          <img
            src={question.imageUrl}
            alt="Question illustration"
            className="max-w-full h-auto max-h-64 mx-auto rounded-lg shadow-sm"
          />
        </div>
      )}

      {/* Unplaced Items */}
      <div>
        <h3 className="font-medium text-gray-700 mb-3">Items to Categorize</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {getUnplacedItems().map((item) => (
            <DraggableItem 
              key={item.id} 
              item={item} 
              onDragStart={handleDragStart}
              isDragging={draggedItemId === item.id}
            />
          ))}
        </div>
        {getUnplacedItems().length === 0 && (
          <div className="text-gray-400 text-sm text-center py-6 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
            🎉 All items have been categorized
          </div>
        )}
      </div>

      {/* Categories */}
      <div>
        <h3 className="font-medium text-gray-700 mb-3">Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {question.categories.map((category) => (
            <DroppableCategory
              key={category}
              category={category}
              items={getItemsInCategory(category)}
              onRemoveItem={handleRemoveItem}
              onDrop={handleDrop}
              onDragOver={() => handleDragOver(category)}
              isOver={dragOverCategory === category}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorizeRenderer;