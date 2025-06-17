const express = require('express');
const cors = require('cors'); // ✅ Import CORS
const drappoinmentRoutes = require('./server/bookingsystem/bookingsystem');
const datetimesystemRoutes = require('./server/datetimesystem/datetimesystem');
const mysql = require('mysql2');

const app = express();

// ✅ Use CORS before routes
app.use(cors());

// ✅ Use JSON middleware
app.use(express.json());

// Create and export MySQL connection
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
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

// ✅ Define routes
app.use('/api/appointment', drappoinmentRoutes);
app.use('/api/slots', datetimesystemRoutes);

// ✅ Start server
const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
