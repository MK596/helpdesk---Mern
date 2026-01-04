const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Connect to database
connectDB();

const app = express();

app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP for simplicity if needed, or configure properly
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/users', require('./routes/authRoutes'));
app.use('/api/tickets', require('./routes/ticketRoutes'));

// Serve frontend
if (process.env.NODE_ENV === 'production') {
    // Set build folder
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    app.get('*', (req, res) =>
        res.sendFile(path.resolve(__dirname, '../', 'frontend', 'dist', 'index.html'))
    );
} else {
    // Default Route
    app.get('/', (req, res) => {
        res.status(200).json({ message: 'Welcome to the Helpdesk API' });
    });
}

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
