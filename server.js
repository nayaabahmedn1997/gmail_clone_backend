
//Require imports
const http = require('http');
const app = require('./app');
const { Server } = require('socket.io'); // Import Socket.IO
const cors = require('cors');
const express =require('express');
const server = http.createServer(app);

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
    
  },
});



// Example: Socket.IO connection handling
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("disconnect", () => {
      console.log("User disconnected", socket.id);
  });
});

// Attach Socket.IO to `req` for use in routes
app.set('io', io);

server.listen(PORT,()=>{

    console.log(`Server is running at port ${PORT}`);
})

