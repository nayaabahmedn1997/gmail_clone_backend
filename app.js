//Require Modules
const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const userRouter = require('./routes/userRoutes');
const cors = require('cors');
const emailRouter = require('./routes/emailRoutes');
const path = require('path');



const app = express();
connectDB();




//Middlewares
 app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
 app.use(express.json());

app.use("/api/users", userRouter);
app.use('/api/email', emailRouter);
// Serve static files (attachments) from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


module.exports = app;


