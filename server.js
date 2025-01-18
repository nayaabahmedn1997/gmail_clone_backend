
//Require imports
const http = require('http');
const app = require('./app');


const server = http.createServer(app);

const PORT  = 6002;


server.listen(PORT,()=>{

    console.log(`Server is running at port ${PORT}`);
})