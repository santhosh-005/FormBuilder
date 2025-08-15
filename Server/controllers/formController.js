const Form = require('../models/Form.js');
const Submission = require('../models/Submission.js');
const { validateFormPayload } = require('../utils/validateForm.js');

// Helper function to clean legacy per-item imageUrl data
const cleanupLegacyItemImages = (formData) => {
  if (!formData.questions) return formData;
  
  return {
    ...formData,
    questions: formData.questions.map((question) => {
      if (question.type === 'categorize' && question.items) {
        return {
          ...question,
          items: question.items.map((item) => {
            const { imageUrl, ...cleanItem } = item;
            return cleanItem;
          })
        };
      }
      return question;
    })
  };
};

// Create a new form
const createForm = async (req, res) => {
  try {
    if (!req.user?.uid) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Validate the form payload
    const validation = validateFormPayload(req.body);
    if (!validation.valid) {
      res.status(400).json({
        message: 'Invalid form data',
        errors: validation.errors
      });
      return;
    }

    const { title, description, headerImageUrl, questions } = req.body;

    // Clean up any legacy per-item imageUrl data
    const cleanedData = cleanupLegacyItemImages(req.body);

    const form = new Form({
      title: title.trim(),
      description: description?.trim() || '',
      headerImageUrl: headerImageUrl || null,
      ownerId: req.user.uid,
      questions: cleanedData.questions || []
    });

    const savedForm = await form.save();
    
    res.status(201).json({
      message: 'Form created successfully',
      data: savedForm
    });
  } catch (error) {
    console.error('Create form error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation failed',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    
    res.status(500).json({
      message: 'Failed to create form',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get all forms
const getAllForms = async (req, res) => {
  try {
    const { page = '1', limit = '10', search } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    let query = {};
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const forms = await Form.find(query)
      .select('title description headerImageUrl questionCount ownerId createdAt updatedAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Form.countDocuments(query);

    res.json({
      message: 'Forms retrieved successfully',
      data: forms,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalItems: total,
        itemsPerPage: limitNum
      }
    });
  } catch (error) {
    console.error('Get forms error:', error);
    res.status(500).json({
      message: 'Failed to retrieve forms',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get forms owned by the authenticated user
const getMyForms = async (req, res) => {
  try {
    if (!req.user?.uid) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { page = '1', limit = '10', search } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    let query = { ownerId: req.user.uid };
    if (search) {
      query = {
        ...query,
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const forms = await Form.find(query)
      .select('title description headerImageUrl questionCount ownerId createdAt updatedAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Form.countDocuments(query);

    res.json({
      message: 'Forms retrieved successfully',
      data: forms,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalItems: total,
        itemsPerPage: limitNum
      }
    });
  } catch (error) {
    console.error('Get my forms error:', error);
    res.status(500).json({
      message: 'Failed to retrieve forms',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get a specific form by ID
const getFormById = async (req, res) => {
  try {
    const { id } = req.params;

    const form = await Form.findById(id);
    
    if (!form) {
      res.status(404).json({
        message: 'Form not found'
      });
      return;
    }

    // Clean up legacy per-item imageUrl data
    const cleanedForm = {
      ...form.toObject(),
      questions: form.questions.map((question) => {
        if (question.type === 'categorize' && question.items) {
          return {
            ...question,
            items: question.items.map((item) => {
              const { imageUrl, ...cleanItem } = item;
              return cleanItem;
            })
          };
        }
        return question;
      })
    };

    res.json({
      message: 'Form retrieved successfully',
      data: cleanedForm
    });
  } catch (error) {
    console.error('Get form by ID error:', error);
    
    if (error.name === 'CastError') {
      res.status(400).json({
        message: 'Invalid form ID format'
      });
      return;
    }
    
    res.status(500).json({
      message: 'Failed to retrieve form',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Update a form
const updateForm = async (req, res) => {
  try {
    if (!req.user?.uid) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    
    // First check if form exists and user owns it
    const existingForm = await Form.findById(id);
    if (!existingForm) {
      res.status(404).json({
        message: 'Form not found'
      });
      return;
    }

    if (existingForm.ownerId !== req.user.uid) {
      res.status(403).json({
        message: 'Forbidden: You can only update your own forms'
      });
      return;
    }
    
    // Validate the form payload
    const validation = validateFormPayload(req.body);
    if (!validation.valid) {
      res.status(400).json({
        message: 'Invalid form data',
        errors: validation.errors
      });
      return;
    }

    const updateData = { ...req.body };
    if (updateData.title) updateData.title = updateData.title.trim();
    if (updateData.description) updateData.description = updateData.description.trim();
    
    // Clean up any legacy per-item imageUrl data
    const cleanedData = cleanupLegacyItemImages(updateData);

    const form = await Form.findByIdAndUpdate(
      id,
      cleanedData,
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Form updated successfully',
      data: form
    });
  } catch (error) {
    console.error('Update form error:', error);
    
    if (error.name === 'CastError') {
      res.status(400).json({
        message: 'Invalid form ID format'
      });
      return;
    }
    
    if (error.name === 'ValidationError') {
      res.status(400).json({
        message: 'Validation failed',
        errors: Object.values(error.errors).map((e) => e.message)
      });
      return;
    }
    
    res.status(500).json({
      message: 'Failed to update form',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Delete a form
const deleteForm = async (req, res) => {
  try {
    if (!req.user?.uid) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;

    // First check if form exists and user owns it
    const existingForm = await Form.findById(id);
    if (!existingForm) {
      res.status(404).json({
        message: 'Form not found'
      });
      return;
    }

    if (existingForm.ownerId !== req.user.uid) {
      res.status(403).json({
        message: 'Forbidden: You can only delete your own forms'
      });
      return;
    }

    await Form.findByIdAndDelete(id);
    
    // Also delete all submissions for this form
    await Submission.deleteMany({ formId: id });

    res.json({
      message: 'Form and associated submissions deleted successfully',
      data: { deletedFormId: id }
    });
  } catch (error) {
    console.error('Delete form error:', error);
    
    if (error.name === 'CastError') {
      res.status(400).json({
        message: 'Invalid form ID format'
      });
      return;
    }
    
    res.status(500).json({
      message: 'Failed to delete form',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Submit form (create submission)
const submitForm = async (req, res) => {
  try {

    const { id } = req.params;
    const { answers } = req.body;

    // Validate that the form exists
    const form = await Form.findById(id);
    if (!form) {
      res.status(404).json({
        message: 'Form not found'
      });
      return;
    }

    // Validate answers
    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      res.status(400).json({
        message: 'Answers are required and must be a non-empty array'
      });
      return;
    }

    // Set request context for IP and user agent tracking
    Submission.setRequestContext(req);

    const submission = new Submission({
      formId: id,
      userId: "",
      answers
    });

    const savedSubmission = await submission.save();

    res.status(201).json({
      message: 'Form submitted successfully',
      data: savedSubmission
    });
  } catch (error) {
    console.error('Submit form error:', error);
    
    if (error.name === 'CastError') {
      res.status(400).json({
        message: 'Invalid form ID format'
      });
      return;
    }
    
    if (error.name === 'ValidationError') {
      res.status(400).json({
        message: 'Validation failed',
        errors: Object.values(error.errors).map((e) => e.message)
      });
      return;
    }
    
    res.status(500).json({
      message: 'Failed to submit form',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get form submissions
const getFormSubmissions = async (req, res) => {
  try {
    if (!req.user?.uid) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const { page = '1', limit = '10' } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Validate that the form exists
    const form = await Form.findById(id);
    if (!form) {
      res.status(404).json({
        message: 'Form not found'
      });
      return;
    }

    let submissionQuery = { formId: id };
    let isOwner = form.ownerId === req.user.uid;

    // If user is not the form owner, only show their own submissions
    if (!isOwner) {
      submissionQuery.userId = req.user.uid;
    }

    const submissions = await Submission.find(submissionQuery)
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Submission.countDocuments(submissionQuery);

    res.json({
      message: 'Submissions retrieved successfully',
      data: submissions,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalItems: total,
        itemsPerPage: limitNum
      }
    });
  } catch (error) {
    console.error('Get submissions error:', error);
    
    if (error.name === 'CastError') {
      res.status(400).json({
        message: 'Invalid form ID format'
      });
      return;
    }
    
    res.status(500).json({
      message: 'Failed to retrieve submissions',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  createForm,
  getAllForms,
  getMyForms,
  getFormById,
  updateForm,
  deleteForm,
  submitForm,
  getFormSubmissions
};
