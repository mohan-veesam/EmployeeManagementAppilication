const express = require('express');
const cors = require('cors');
const employeeRoutes = require('./routes/employee');
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');

const app = express();

app.use(cors());
app.use(express.json());

// Route for employees
app.use('/api/employee', employeeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
