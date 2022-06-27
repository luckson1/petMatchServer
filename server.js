const http= require ('http');
const App=require('./App');
const dotenv=require ('dotenv');
// creating port
const PORT =process.env.PORT || 5000;

const server= http.createServer(App);

server.listen(PORT, console.log(`server is running on running on port ${5000}`))