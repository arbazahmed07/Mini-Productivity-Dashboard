const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const usersRoutes = require('./routes/users');
const tasksRoutes = require('./routes/tasks');
const goalsRoutes = require('./routes/goals');
const { PORT } = require('./config/environment');
// const path = require('path');

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api', authRoutes);
app.use('/api', profileRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/goals', goalsRoutes);



// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
