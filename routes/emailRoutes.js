

const express = require('express');
const { createAnEmail, fetchAllEmails, moveEmailFromInboxToTrash, deleteAnEmail, deleteEmails } = require('../controllers/emailController');
const emailRouter = express.Router();
const multer = require('multer');
const authMiddleWare = require('../middlewares/authMiddleWare');
const path = require('path');
// Configure multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads'); // Store files in 'uploads' folder
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
  });
  
  const upload = multer({ storage });

//Route to create an email
emailRouter.post('/create-email', authMiddleWare,upload.single('attachment'),createAnEmail );


//Route to get emails
emailRouter.get("/get-emails",authMiddleWare,fetchAllEmails);

//Route to move email from inbox to trash
emailRouter.post("/move-to-trash",authMiddleWare,moveEmailFromInboxToTrash)

//Route to delete an email
emailRouter.post('/delete-an-email',authMiddleWare,deleteAnEmail);

//Route to delete emails
emailRouter.post("/delete-emails",authMiddleWare, deleteEmails);

module.exports = emailRouter; 