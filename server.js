const http= require ('http');


const app = require('./App');



const PORT =process.env.PORT || 4000;
const server= http.createServer(app);

server.listen(PORT, console.log(`server running on port: ${PORT}` ))