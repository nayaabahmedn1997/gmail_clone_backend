const jwt = require('jsonwebtoken');
// const dotenv =require('dotenv');
// dotenv.config();
const authMiddleWare = async (req, res, next)=>{
    try {
    
        const bearerToken = req.headers.authorization;
        const token = bearerToken.split(' ')[1];
        if(!token)
        {
            return res.status(400).json({
                "error":"Token not found"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.body.email = decoded.email;
       req.email = decoded.email
        
        next();
    

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            "message":"Internal sever error"
        })
    }
}

module.exports = authMiddleWare;