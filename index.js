const http = require('http');
const app = require('./app');

const server_port = 9098;
const server_host = '127.0.0.1';


const server = http.createServer(app);
server.listen(server_port, server_host);