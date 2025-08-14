const mongoose = require('mongoose');

// Answer schema for different question types
const answerSchema = new mongoose.Schema({
  questionId: {
    type: String,
    required: [true, 'Question ID is required']
  },
  answer: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, 'Answer is required']
  }
}, { _id: false });

// Main Submission Schema
const submissionSchema = new mongoose.Schema({
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form',
    required: [true, 'Form ID is required'],
    index: true
  },
  userId: {
    type: String,
    default: null,
    index: true
  },
  answers: {
    type: [answerSchema],
    required: [true, 'Answers are required'],
    validate: {
      validator: function(answers) {
        return answers.length > 0;
      },
      message: 'At least one answer is required'
    }
  },
  submittedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  ipAddress: {
    type: String,
    default: null
  },
  userAgent: {
    type: String,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
submissionSchema.index({ formId: 1, submittedAt: -1 });
submissionSchema.index({ userId: 1, submittedAt: -1 });

// Virtual for answer count
submissionSchema.virtual('answerCount').get(function() {
  return this.answers.length;
});

// Pre-save middleware
submissionSchema.pre('save', function(next) {
  // Set IP address and user agent if available in context
  if (this.isNew && this.constructor.requestContext) {
    const { req } = this.constructor.requestContext;
    if (req) {
      this.ipAddress = req.ip || req.connection.remoteAddress;
      this.userAgent = req.get('User-Agent');
    }
  }
  next();
});

// Static method to set request context
submissionSchema.statics.setRequestContext = function(req) {
  this.requestContext = { req };
};

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;
