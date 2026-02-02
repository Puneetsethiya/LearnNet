const express = require('express');
const cors = require('cors');
const path = require('path');

// create app
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// serve frontend
app.use(express.static(path.join(__dirname, "../public")));

// routes
const coursesRouter = require('./routes/courses');
const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin');

app.use('/api', coursesRouter);
app.use('/user', userRouter);
app.use('/admin', adminRouter);

module.exports = app;
