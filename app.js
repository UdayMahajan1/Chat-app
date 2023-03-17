const express = require('express');
const http = require('http');
const app = express();
const ejs = require('ejs');
const cors = require('cors');
const server = http.createServer(app);
const webSocketServer = require('./routes/websockets');
const io = webSocketServer(server);
const router = require('./routes/index');
const logger = require('morgan');

app.use(cors());

app.use(logger('dev'));

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use('/', router);

server.listen(3000, () => console.log('Server running on port 3000.')); 
