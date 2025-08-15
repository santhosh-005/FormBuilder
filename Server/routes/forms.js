const express = require('express');
const router = express.Router();
const {
  createForm,
  getAllForms,
  getMyForms,
  getFormById,
  updateForm,
  deleteForm,
  submitForm,
  getFormSubmissions
} = require('../controllers/formController.js');
const firebaseAuth = require('../middleware/firebaseAuth.js');

// GET /api/forms - Get all forms with pagination and search (public)
router.get('/', getAllForms);

// GET /api/forms/my - Get my forms (requires auth)
router.get('/my', firebaseAuth, getMyForms);

// POST /api/forms - Create a new form (requires auth)
router.post('/', firebaseAuth, createForm);

// GET /api/forms/:id - Get a specific form by ID (public)
router.get('/:id', getFormById);

// PUT /api/forms/:id - Update a form (requires auth + ownership)
router.put('/:id', firebaseAuth, updateForm);

// DELETE /api/forms/:id - Delete a form (requires auth + ownership)
router.delete('/:id', firebaseAuth, deleteForm);

// POST /api/forms/:id/submissions - Submit a form (public - no auth required)
router.post('/:id/submissions', submitForm);

// GET /api/forms/:id/submissions - Get submissions for a form (requires auth)
router.get('/:id/submissions', firebaseAuth, getFormSubmissions);

module.exports = router;
