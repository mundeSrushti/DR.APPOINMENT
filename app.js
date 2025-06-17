const express = require('express');
const drappoinmentRoutes = require('./server/bookingsystem/bookingsystem');
const datetimesystemRoutes = require('./server/datetimesystem/datetimesystem');
const mysql = require('mysql2');

const app = express();
app.use(express.json());

// Create and export MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'User@123',
  database: 'drappoinment'
});

connection.connect(err => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to MySQL');
});

// Make connection globally accessible
global.db = connection;

// Routes
app.use('/api/appointment', drappoinmentRoutes);
app.use('/api/slots', datetimesystemRoutes);

const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
