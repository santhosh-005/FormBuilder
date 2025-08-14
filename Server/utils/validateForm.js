const validateFormPayload = (payload) => {
  const errors = [];

  // Validate required fields
  if (!payload.title || typeof payload.title !== 'string' || payload.title.trim() === '') {
    errors.push('Title is required and must be a non-empty string');
  }

  // Validate description if provided
  if (payload.description !== undefined && payload.description !== null && typeof payload.description !== 'string') {
    errors.push('Description must be a string');
  }

  // Validate headerImageUrl if provided
  if (payload.headerImageUrl !== null && payload.headerImageUrl !== undefined && typeof payload.headerImageUrl !== 'string') {
    errors.push('Header image URL must be a string or null');
  }

  // Validate questions array
  if (!Array.isArray(payload.questions)) {
    errors.push('Questions must be an array');
    return { valid: false, errors };
  }

  // Validate each question
  payload.questions.forEach((question, index) => {
    const questionPrefix = `Question ${index + 1}`;

    if (!question || typeof question !== 'object') {
      errors.push(`${questionPrefix}: Must be an object`);
      return;
    }

    if (!question.type || !['categorize', 'cloze', 'comprehension'].includes(question.type)) {
      errors.push(`${questionPrefix}: Type must be 'categorize', 'cloze', or 'comprehension'`);
      return;
    }

    switch (question.type) {
      case 'categorize':
        validateCategorizeQuestion(question, questionPrefix, errors);
        break;
      case 'cloze':
        validateClozeQuestion(question, questionPrefix, errors);
        break;
      case 'comprehension':
        validateComprehensionQuestion(question, questionPrefix, errors);
        break;
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
};

const validateCategorizeQuestion = (question, prefix, errors) => {
  // Validate categories
  if (!Array.isArray(question.categories)) {
    errors.push(`${prefix}: Categories must be an array`);
  } else {
    if (question.categories.length === 0) {
      errors.push(`${prefix}: Must have at least one category`);
    }
    question.categories.forEach((category, index) => {
      if (typeof category !== 'string' || category.trim() === '') {
        errors.push(`${prefix}: Category ${index + 1} must be a non-empty string`);
      }
    });
  }

  // Validate items
  if (!Array.isArray(question.items)) {
    errors.push(`${prefix}: Items must be an array`);
  } else {
    question.items.forEach((item, index) => {
      const itemPrefix = `${prefix}, Item ${index + 1}`;
      
      if (!item || typeof item !== 'object') {
        errors.push(`${itemPrefix}: Must be an object`);
        return;
      }

      if (!item.id || typeof item.id !== 'string') {
        errors.push(`${itemPrefix}: ID is required and must be a string`);
      }

      if (!item.text || typeof item.text !== 'string' || item.text.trim() === '') {
        errors.push(`${itemPrefix}: Text is required and must be a non-empty string`);
      }

      if (item.correctCategory !== undefined) {
        if (typeof item.correctCategory !== 'string') {
          errors.push(`${itemPrefix}: Correct category must be a string if provided`);
        } else if (question.categories && !question.categories.includes(item.correctCategory)) {
          errors.push(`${itemPrefix}: Correct category must be one of the defined categories`);
        }
      }
    });
  }

  // Validate imageUrl
  if (question.imageUrl !== undefined && typeof question.imageUrl !== 'string') {
    errors.push(`${prefix}: Image URL must be a string if provided`);
  }
};

const validateClozeQuestion = (question, prefix, errors) => {
  // Validate text
  if (!question.text || typeof question.text !== 'string' || question.text.trim() === '') {
    errors.push(`${prefix}: Text is required and must be a non-empty string`);
  }

  // Validate imageUrl
  if (question.imageUrl !== undefined && typeof question.imageUrl !== 'string') {
    errors.push(`${prefix}: Image URL must be a string if provided`);
  }

  // Validate blanks
  if (!Array.isArray(question.blanks)) {
    errors.push(`${prefix}: Blanks must be an array`);
  } else {
    question.blanks.forEach((blank, index) => {
      const blankPrefix = `${prefix}, Blank ${index + 1}`;
      
      if (!blank || typeof blank !== 'object') {
        errors.push(`${blankPrefix}: Must be an object`);
        return;
      }

      if (!blank.id || typeof blank.id !== 'string') {
        errors.push(`${blankPrefix}: ID is required and must be a string`);
      }

      if (blank.answerHint !== undefined && typeof blank.answerHint !== 'string') {
        errors.push(`${blankPrefix}: Answer hint must be a string if provided`);
      }
    });

    // Validate that all blank IDs in text exist in blanks array
    if (question.text && question.blanks) {
      const blankPattern = /\[([^\]]+)\]/g;
      const textBlankIds = [];
      let match;
      
      while ((match = blankPattern.exec(question.text)) !== null) {
        textBlankIds.push(match[1]);
      }

      const blankIds = question.blanks.map(blank => blank.id);
      textBlankIds.forEach(textBlankId => {
        if (!blankIds.includes(textBlankId)) {
          errors.push(`${prefix}: Blank ID '${textBlankId}' in text not found in blanks array`);
        }
      });
    }
  }
};

const validateComprehensionQuestion = (question, prefix, errors) => {
  // Validate passage
  if (!question.passage || typeof question.passage !== 'string' || question.passage.trim() === '') {
    errors.push(`${prefix}: Passage is required and must be a non-empty string`);
  }

  // Validate questions
  if (!Array.isArray(question.questions)) {
    errors.push(`${prefix}: Questions must be an array`);
  } else {
    if (question.questions.length === 0) {
      errors.push(`${prefix}: Must have at least one question`);
    }

    question.questions.forEach((mcq, index) => {
      const mcqPrefix = `${prefix}, MCQ ${index + 1}`;
      
      if (!mcq || typeof mcq !== 'object') {
        errors.push(`${mcqPrefix}: Must be an object`);
        return;
      }

      if (!mcq.id || typeof mcq.id !== 'string') {
        errors.push(`${mcqPrefix}: ID is required and must be a string`);
      }

      if (!mcq.questionText || typeof mcq.questionText !== 'string' || mcq.questionText.trim() === '') {
        errors.push(`${mcqPrefix}: Question text is required and must be a non-empty string`);
      }

      if (!Array.isArray(mcq.options)) {
        errors.push(`${mcqPrefix}: Options must be an array`);
      } else {
        if (mcq.options.length < 2) {
          errors.push(`${mcqPrefix}: Must have at least 2 options`);
        }

        mcq.options.forEach((option, optionIndex) => {
          if (typeof option !== 'string' || option.trim() === '') {
            errors.push(`${mcqPrefix}, Option ${optionIndex + 1}: Must be a non-empty string`);
          }
        });

        // Validate correct index
        if (typeof mcq.correctIndex !== 'number' || !Number.isInteger(mcq.correctIndex)) {
          errors.push(`${mcqPrefix}: Correct index must be an integer`);
        } else if (mcq.correctIndex < 0 || mcq.correctIndex >= mcq.options.length) {
          errors.push(`${mcqPrefix}: Correct index must be between 0 and ${mcq.options.length - 1}`);
        }
      }
    });
  }

  // Validate imageUrl
  if (question.imageUrl !== undefined && typeof question.imageUrl !== 'string') {
    errors.push(`${prefix}: Image URL must be a string if provided`);
  }
};

module.exports = {
  validateFormPayload
};
