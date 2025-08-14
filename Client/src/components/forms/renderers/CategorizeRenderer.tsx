import React, { useState, useEffect, useRef } from 'react';
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
import { CSS } from '@dnd-kit/utilities';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import type { CategorizeQuestion, CategorizeItem } from '../../../types/form';

interface CategorizeRendererProps {
  question: CategorizeQuestion;
  onAnswer: (answer: { [itemId: string]: string }) => void;
  initialAnswer?: { [itemId: string]: string };
}

interface DraggableItemProps {
  item: CategorizeItem;
  isDragging?: boolean;
}

interface DroppableCategoryProps {
  category: string;
  items: CategorizeItem[];
  onRemoveItem: (itemId: string) => void;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ item, isDragging = false }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: item.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="p-3 bg-blue-100 border border-blue-200 rounded-lg cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow"
    >
      <span className="text-sm font-medium text-blue-900">{item.text}</span>
    </div>
  );
};

const DroppableCategory: React.FC<DroppableCategoryProps> = ({ 
  category, 
  items, 
  onRemoveItem 
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id: category,
  });

  return (
    <div
      ref={setNodeRef}
      className={`p-4 border-2 border-dashed rounded-lg min-h-32 transition-colors ${
        isOver 
          ? 'border-blue-400 bg-blue-50' 
          : 'border-gray-300 bg-gray-50'
      }`}
    >
      <h3 className="font-medium text-gray-700 mb-3">{category}</h3>
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-2 bg-white border border-gray-200 rounded flex items-center justify-between"
          >
            <span className="text-sm">{item.text}</span>
            <button
              onClick={() => onRemoveItem(item.id)}
              className="text-gray-400 hover:text-red-600 text-sm"
            >
              ×
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-4">
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
  const [activeId, setActiveId] = useState<string | null>(null);
  const prevInitialAnswerRef = useRef<{ [itemId: string]: string }>(initialAnswer);

  // Update itemPlacements when initialAnswer changes (for reset functionality)
  useEffect(() => {
    if (JSON.stringify(initialAnswer) !== JSON.stringify(prevInitialAnswerRef.current)) {
      setItemPlacements(initialAnswer);
      prevInitialAnswerRef.current = initialAnswer;
      // Do NOT call onAnswer here to avoid infinite parent updates
    }
  }, [initialAnswer]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const itemId = active.id as string;
      const categoryId = over.id as string;
      
      const newPlacements = { ...itemPlacements };
      
      // If item was in a category, remove it
      Object.keys(newPlacements).forEach(key => {
        if (newPlacements[key] === categoryId && key !== itemId) {
          // Keep existing items in the category
        }
      });
      
      newPlacements[itemId] = categoryId;
      setItemPlacements(newPlacements);
      onAnswer(newPlacements);
    }
    
    setActiveId(null);
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

  const activeItem = activeId ? question.items.find(item => item.id === activeId) : null;

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
              <DraggableItem key={item.id} item={item} />
            ))}
          </div>
          {getUnplacedItems().length === 0 && (
            <p className="text-gray-400 text-sm text-center py-4 border-2 border-dashed border-gray-200 rounded-lg">
              All items have been categorized
            </p>
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
              />
            ))}
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeItem ? <DraggableItem item={activeItem} isDragging /> : null}
      </DragOverlay>
    </DndContext>
  );
};

export default CategorizeRenderer;
