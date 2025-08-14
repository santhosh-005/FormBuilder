const mongoose = require('mongoose');

// Schema definitions for different question types
const categorizeItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  text: { type: String, required: true },
  correctCategory: { type: String }
}, { _id: false });

const categorizeQuestionSchema = new mongoose.Schema({
  type: { type: String, enum: ['categorize'], required: true },
  categories: { type: [String], required: true },
  items: { type: [categorizeItemSchema], required: true },
  imageUrl: { type: String }
}, { _id: false });

const clozeBlankSchema = new mongoose.Schema({
  id: { type: String, required: true },
  answerHint: { type: String }
}, { _id: false });

const clozeQuestionSchema = new mongoose.Schema({
  type: { type: String, enum: ['cloze'], required: true },
  text: { type: String, required: true },
  blanks: { type: [clozeBlankSchema], required: true },
  imageUrl: { type: String }
}, { _id: false });

const comprehensionOptionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  questionText: { type: String, required: true },
  options: { type: [String], required: true },
  correctIndex: { type: Number, required: true }
}, { _id: false });

const comprehensionQuestionSchema = new mongoose.Schema({
  type: { type: String, enum: ['comprehension'], required: true },
  passage: { type: String, required: true },
  questions: { type: [comprehensionOptionSchema], required: true },
  imageUrl: { type: String }
}, { _id: false });

// Main Form Schema
const formSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: false, // Made optional
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
    default: '' // Default to empty string
  },
  headerImageUrl: {
    type: String,
    default: null
  },
  ownerId: {
    type: String,
    required: [true, 'Owner ID is required'],
    index: true
  },
  questions: {
    type: [mongoose.Schema.Types.Mixed],
    default: [],
    validate: {
      validator: function(questions) {
        return questions.every(question => {
          return question.type && ['categorize', 'cloze', 'comprehension'].includes(question.type);
        });
      },
      message: 'All questions must have a valid type (categorize, cloze, or comprehension)'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
formSchema.index({ title: 'text', description: 'text' });
formSchema.index({ createdAt: -1 });
formSchema.index({ ownerId: 1, createdAt: -1 });

// Virtual for question count
formSchema.virtual('questionCount').get(function() {
  return this.questions?.length || 0;
});

// Pre-save middleware for validation
formSchema.pre('save', function(next) {
  // Validate question types and structures
  const errors = [];
  
  this.questions.forEach((question, index) => {
    if (!question.type) {
      errors.push(`Question ${index + 1}: Type is required`);
      return;
    }
    
    switch (question.type) {
      case 'categorize':
        if (!question.categories || !Array.isArray(question.categories) || question.categories.length === 0) {
          errors.push(`Question ${index + 1}: Categories are required`);
        }
        if (!question.items || !Array.isArray(question.items)) {
          errors.push(`Question ${index + 1}: Items are required`);
        }
        break;
      case 'cloze':
        if (!question.text || typeof question.text !== 'string') {
          errors.push(`Question ${index + 1}: Text is required`);
        }
        if (!question.blanks || !Array.isArray(question.blanks)) {
          errors.push(`Question ${index + 1}: Blanks are required`);
        }
        break;
      case 'comprehension':
        if (!question.passage || typeof question.passage !== 'string') {
          errors.push(`Question ${index + 1}: Passage is required`);
        }
        if (!question.questions || !Array.isArray(question.questions) || question.questions.length === 0) {
          errors.push(`Question ${index + 1}: Questions are required`);
        }
        break;
    }
  });
  
  if (errors.length > 0) {
    return next(new Error(errors.join('; ')));
  }
  
  next();
});

const Form = mongoose.model('Form', formSchema);

module.exports = Form;
