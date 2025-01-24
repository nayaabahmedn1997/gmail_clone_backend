
//Require imports
const http = require('http');
const app = require('./app');
const { Server } = require('socket.io'); // Import Socket.IO
const cors = require('cors');
const express =require('express');
const server = http.createServer(app);
const dotenv  =require('dotenv');
const jwt = require('jsonwebtoken')

dotenv.config();
const PORT  = 6002;
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*' );
  next();
});
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(express.json());
const io = new Server(server, {
  cors: {
      origin: "http://localhost:3000", // Frontend URL
      // allowedHeaders: ["my-custom-header"],
      methods: ["GET", "POST"],
      credentials: true
    
  },
});

io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error: No token provided'));
  }

  try {
    const decoded =  await jwt.verify(token, process.env.JWT_SECRET);
     // Validate token
     console.log(decoded)
    socket.userId = decoded.email; // Attach user ID to the socket
    console.log(1)
    next();
  } catch (err) {
    next(new Error('Authentication error: Invalid token'));
    console.log(err)
  }
});

// Example: Socket.IO connection handling
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  // Add user to a personal room based on their user ID
  socket.join(socket.userId);
  socket.on("disconnect", () => {
      console.log("User disconnected", socket.id);
  });
});

// Attach Socket.IO to `req` for use in routes
app.set('io', io);

server.listen(PORT,()=>{

    console.log(`Server is running at port ${PORT}`);
})

