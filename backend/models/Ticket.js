const mongoose = require('mongoose');

const ticketSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: [true, 'Please select a ticket issue'],
    },
    description: {
        type: String,
        required: [true, 'Please enter a description of the issue'],
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Low',
    },
    status: {
        type: String,
        enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
        default: 'Open',
    },
    adminReply: {
        type: String, // Field for admin to leave a reply/note
        default: ''
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Ticket', ticketSchema);
