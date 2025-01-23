

const express = require('express');
const { createAnEmail, moveEmailFromInboxToTrash, deleteAnEmail, deleteEmails, fetchSingleEmail, fetchAllInboxEmails, fetchAllTrashEmails, fetchSentEmails, createADraftEmail, fetchDraftEmails, sendDraftMail, fetchAllMails } = require('../controllers/emailController');
const emailRouter = express.Router();
const multer = require('multer');
const authMiddleWare = require('../middlewares/authMiddleWare');
// Configure multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads'); // Store files in 'uploads' folder
    },
    filename: (req, file, cb) => {
      cb(null,file.originalname); // Unique filename
      req.file = `./uploads/${file.originalname}`
    }
   
  });
  
  const upload = multer({ storage });

//Route to create an email
emailRouter.post('/create-email', authMiddleWare,upload.single('attachment'),createAnEmail );


//Route to get emails
emailRouter.get("/get-emails",authMiddleWare,fetchAllInboxEmails);


//Route to get emails
emailRouter.get("/get-trash-emails",authMiddleWare,fetchAllTrashEmails);
//Route to get a single email
emailRouter.post("/fetch-an-email", authMiddleWare, fetchSingleEmail);

//Route to move email from inbox to trash
emailRouter.post("/move-to-trash",authMiddleWare,moveEmailFromInboxToTrash)

//Route to delete an email
emailRouter.post('/delete-an-email',authMiddleWare,deleteAnEmail);

//Route to delete emails
emailRouter.post("/delete-emails",authMiddleWare, deleteEmails);

//Route to sent emails
emailRouter.get("/sent-emails", authMiddleWare, fetchSentEmails);

//Route to create a draft email
emailRouter.post('/draft-a-email', authMiddleWare,upload.single('attachment'),createADraftEmail );

//Route to get draft emails
emailRouter.get("/get-draft-emails",authMiddleWare, fetchDraftEmails)

//Route to send draft email
emailRouter.post("/send-draft-mail", authMiddleWare, sendDraftMail);


//Route to fetch all mails
emailRouter.get("/fetch-all-mails", authMiddleWare, fetchAllMails);
module.exports = emailRouter; 