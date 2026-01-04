const express = require('express');
const router = express.Router();
const {
    getTickets,
    getAllTickets,
    createTicket,
    getTicket,
    deleteTicket,
    updateTicket
} = require('../controllers/ticketController');
const { protect, admin } = require('../middleware/authMiddleware');

// /api/tickets
router.route('/').get(protect, getTickets).post(protect, createTicket);

// Admin route for all tickets
router.route('/all').get(protect, admin, getAllTickets);

// /api/tickets/:id
router.route('/:id')
    .get(protect, getTicket)
    .delete(protect, deleteTicket)
    .put(protect, updateTicket);

module.exports = router;
