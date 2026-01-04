const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Ticket = require('../models/Ticket');

// @desc    Get user tickets
// @route   GET /api/tickets
// @access  Private
const getTickets = asyncHandler(async (req, res) => {
    // If admin is calling this specific route, maybe return all?
    // But requirement says "View own tickets" for User Dashboard, "View all user tickets" for Admin Dashboard.
    // I will keep this for logged in user's tickets. Admin has separate route or logic.
    const tickets = await Ticket.find({ user: req.user.id });
    res.status(200).json(tickets);
});

// @desc    Get all tickets (Admin)
// @route   GET /api/tickets/all
// @access  Private/Admin
const getAllTickets = asyncHandler(async (req, res) => {
    // Bonus: Filtering
    // URL props? status, priority
    const { status, priority } = req.query;
    let query = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const tickets = await Ticket.find(query).populate('user', 'name email');
    res.status(200).json(tickets);
});

// @desc    Create new ticket
// @route   POST /api/tickets
// @access  Private
const createTicket = asyncHandler(async (req, res) => {
    const { title, description, priority } = req.body;

    if (!title || !description) {
        res.status(400);
        throw new Error('Please add a title and description');
    }

    const ticket = await Ticket.create({
        title,
        description,
        priority: priority || 'Low',
        user: req.user.id,
        status: 'Open'
    });

    res.status(201).json(ticket);
});

// @desc    Get single ticket
// @route   GET /api/tickets/:id
// @access  Private
const getTicket = asyncHandler(async (req, res) => {
    // Populate user info so admin/user sees who submitted
    const ticket = await Ticket.findById(req.params.id).populate('user', 'name email');

    if (!ticket) {
        res.status(404);
        throw new Error('Ticket not found');
    }

    // Access check: User owns it OR user is admin
    if (ticket.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('Not authorized');
    }

    res.status(200).json(ticket);
});

// @desc    Delete ticket
// @route   DELETE /api/tickets/:id
// @access  Private/Admin
const deleteTicket = asyncHandler(async (req, res) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
        res.status(404);
        throw new Error('Ticket not found');
    }

    // Access check: User owns it OR user is admin
    if (ticket.user.toString() !== req.user.id && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('Not authorized');
    }

    await ticket.deleteOne();

    res.status(200).json({ success: true, id: req.params.id });
});

// @desc    Update ticket
// @route   PUT /api/tickets/:id
// @access  Private
const updateTicket = asyncHandler(async (req, res) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
        res.status(404);
        throw new Error('Ticket not found');
    }

    // Check auth
    if (ticket.user.toString() !== req.user.id && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('Not authorized');
    }

    let updatedData = {};

    if (req.user.role === 'admin') {
        // Admin can update everything or specific admin fields
        updatedData = req.body;
    } else {
        // User can only update their own content
        // Restrict to title, description, and priority
        const { title, description, priority } = req.body;
        if (title) updatedData.title = title;
        if (description) updatedData.description = description;
        if (priority) updatedData.priority = priority;

        // If user is trying to close the ticket via status update, we can allow it if that's the logic
        if (req.body.status === 'Closed') {
            updatedData.status = 'Closed';
        }
    }

    const updatedTicket = await Ticket.findByIdAndUpdate(req.params.id, updatedData, {
        new: true,
    });

    res.status(200).json(updatedTicket);
});

module.exports = {
    getTickets,
    getAllTickets,
    createTicket,
    getTicket,
    deleteTicket,
    updateTicket,
};
