// const express = require("express");
// const app = express();

// // load confing from env file
// require('dotenv').config();


// const port = process.env.PORT;

// // middleware to parse json request body
// app.use(express.json());

// // import routes
// const userRoutes = require('./routes/userRoute');
// // mount the routes
// app.use("/api/v1", userRoutes);

// // activate the server
// app.listen(port,()=>{
//     console.log(`server is up and running on the port ${port}`)
// })

// // connect to the database
// const connect = require('./config/database');
// connect();

// // default route
// app.get("/",(req , res)=>{
//     res.send(`<h1>This is default route</h1>`)
// })

// server.js
const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/database');
const attendanceRoutes = require('./routes/attendanceRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(bodyParser.json());


// Apply authentication middleware to attendance routes
app.use('/api/attendance',attendanceRoutes);

// Apply authentication middleware to user routes
app.use('/api/user', userRoutes);

// Apply authentication middleware to the attendance routes
// app.use('/api/attendance', authenticateToken(['coordinator', 'dean', 'director']), attendanceRoutes);

// Apply different authentication middleware to the user routes based on allowed roles
// app.use('/api/user', (req, res, next) => {
//   // Allow access only to coordinators
//   authenticateToken(['coordinator'])(req, res, next);
// }, userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});