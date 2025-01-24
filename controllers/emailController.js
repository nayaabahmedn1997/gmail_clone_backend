const { default: mongoose } = require("mongoose");
const emailModel = require("../models/emailModel");
const userModel = require("../models/userModel");
const io = require("../server");






const createAnEmail = async (req, res) => {

    try {
        const { to:recipient, subject, body,email} = req.body;
    const attachmentPath = req.file ? req.file.path : null; // If attachment is uploaded, store its path
    const sendUser = await userModel.findOne({email:req.email});
    const recipientUser = await userModel.findOne({email:recipient});
    if(!recipientUser)
    {
        return res.status(404).json({
            "message":"Recipient not found"
        })
    }
    const emailData = {
        sender:sendUser._id,
        recipient,
      subject,
      body,
      folder:'inbox',
      attachment: attachmentPath
    };
    const newEmail = new emailModel(emailData);
    // Handle email sending logic (e.g., save to database, send email, etc.)
    await newEmail.save();
     // Emit a "sent" event to the sender
     const io = req.app.get('io');
     io.to(sendUser._id).emit('emailSent', {
       message: 'Your email has been sent successfully.',

     });
 
     // Emit a "received" event to the recipient
     io.to(recipient).emit('newEmail', {
       message: 'You have a new email!',
       email,
     });
 
    res.status(201).json({
        "message":"Email sent successfully"
    });
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            "message":"Internal server error"
        })
    }
    
  }; 


  const fetchSingleEmail = async (req, res)=>{
    try {
        const {email_id} = req.body;
        
        const emailData = await emailModel.findById(email_id).populate('sender', "name email")
        res.status(200).json({
            "message":"Emails successfully fetched",
            emailData
        })
    } catch (error) {
        return res.status(200).json({
            "message":"Internal server error"
        })
    }
  }

const fetchAllInboxEmails = async (req, res)=>{
    try {
        const {email} = req.body;
        const user = await userModel.findOne({email});
        
        const emails = await emailModel.find({recipient:email, folder:'inbox'}).populate('sender', "name email").sort({ timestamp: -1 });
       
        res.status(200).json({
            "message":"Emails successfully fetched",
            emails
        })
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            "message":"Internal server error"
        })
    }
}

const fetchAllTrashEmails = async (req, res)=>{
    try {
        const {email} = req.body;
        const user = await userModel.findOne({email});
        const emails = await emailModel.find({recipient:user.email, folder:'trash'}).populate('sender', "name email").sort({  timestamp: -1  });
       
        res.status(200).json({
            "message":"Emails successfully fetched",
            emails
        })
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            "message":"Internal server error"
        })
    }
}

const moveEmailFromInboxToTrash = async (req, res)=>{
    try {
        const {email_id} = req.body;
        await emailModel.findByIdAndUpdate(email_id,{
            folder:"trash"
        });

        return res.status(200).json({
            "message":"Email moved to trash successfully"
        })
       

    } catch (error) {
        return res.status(200).json({
            "message":"Internal server error"
        })
    }
}

const deleteAnEmail = async (req, res)=>{
    try {
        const {email_id} = req.body;
        
        await emailModel.findByIdAndDelete(email_id);
        return res.status(200).json({
            "message":"Email deleted successfully",
        })
    } catch (error) {
        return res.status(200).json({
            "message":"Internal server error"
        })
    }
}

const deleteEmails = async(req, res)=>{
    try {
        const {emailIDArray} = req.body;
        emailIDArray.forEach(async (email)=>{
            await emailModel.findByIdAndDelete(email.id);
        })  
        return res.status(200).json({
            "message":"Emails deleted successfully"
        })

    } catch (error) {
        return res.status(200).json({
            "message":"Internal server error"
        })
    }
}

const fetchSentEmails = async( req, res)=>{
    try {
        const {email} = req.body;
        const user  = await userModel.findOne({email});
        const emails = await emailModel.find({sender:new mongoose.Types.ObjectId(user._id)}).sort({  timestamp: -1  });
        return res.status(200).json({
            "message":"Sent emails fetched successfully",
            emails
        })
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            "message":"Internal server error"
        })
    }
}

const fetchDraftEmails = async( req, res)=>{
    try {
        const {email} = req.body;
        const user  = await userModel.findOne({email});
        const emails = await emailModel.find({sender:new mongoose.Types.ObjectId(user._id), folder:'drafts'}).sort({  timestamp: -1  });
        return res.status(200).json({
            "message":"Draft emails fetched successfully",
            emails
        })
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            "message":"Internal server error"
        })
    }
}


const createADraftEmail = async (req, res) => {
    try {
        const { to:recipient, subject, body,email} = req.body;
        const attachmentPath = req.file ? req.file.path : null; // If attachment is uploaded, store its path
        const sendUser = await userModel.findOne({email:req.email});
        const recipientUser = await userModel.findOne({email:recipient});
        if(!recipientUser)
        {
            return res.status(404).json({
                "message":"Recipient not found"
            })
        }
        const emailData = {
            sender:sendUser._id,
            recipient,
          subject,
          body,
          folder:'drafts',
          attachment: attachmentPath
        };
        const newEmail = new emailModel(emailData);
        // Handle email sending logic (e.g., save to database, send email, etc.)
        await newEmail.save();
        res.status(201).json({
            "message":"Email moved to draft"
        });
    } catch (error) {
        return res.status(200).json({
            "message":"Internal server error"
        })
    }
   
  }; 


  const sendDraftMail = async (req, res)=>
  {
    try {
        const {email_id} = req.body;
        await emailModel.findByIdAndUpdate(email_id,{
            folder:"inbox",
            createdAt: new Date() 
        });

        return res.status(200).json({
            "message":"Email Sent successfully"
        })
    } catch (error) {
        return res.status(200).json({
            "message":"Internal server error"
        })
    }
  }


  const fetchAllMails = async (req, res)=>{
    try {
        const {email} = req.body;
        const user = await userModel.findOne({email});
        const emails = await emailModel.find(
            {sender:new mongoose.Types.ObjectId(user._id),
            recipient: email
            }).populate('sender', "name email")
        return res.status(200).json({
            "message":"Emails fetched successfully",
            emails
        })
    } catch (error) {
        return res.status(200).json({
            "message":"Internal server error"
        })
    }
  }

module.exports = 
{createAnEmail, fetchAllInboxEmails, 
moveEmailFromInboxToTrash, deleteAnEmail, 
deleteEmails, fetchSingleEmail , 
fetchAllTrashEmails, fetchSentEmails, 
fetchDraftEmails, createADraftEmail,
sendDraftMail, fetchAllMails
};