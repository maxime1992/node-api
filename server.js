// ---------------------------------
// ----------- IMPORTS -------------
// ---------------------------------
// import the config
import conf from './config';

// import and create express server
import express from 'express';
const app = express();

// use http to create the express app ...
import http from 'http';
const server = http.createServer(app);

// ... so we can pass the server to io
import socketIo from 'socket.io';
const io = socketIo.listen(server);

// control CORS
import cors from 'cors';

// use morgan to log
import morgan from 'morgan';

// bodyparser to parse forms
import bodyParser from 'body-parser';

// compress to serve content gzipped if possible
import compress from 'compression';

// --------------------------------------------------------

// ---------------------------------
// ---------- MIDDLEWARES ----------
// ---------------------------------

// enable CORS on every route if required
if (conf.CORS) {
	app.use(cors());
}

// use GZIP
app.use(compress());

// log http requests in terminal
app.use(morgan('dev'));

// get informations from html forms
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// --------------------------------------------------------

// ---------------------------------
// -------- DECLARE ROUTES ---------
// ---------------------------------

import apiRoutesImport from './routes/api.js';
const apiRoutes = apiRoutesImport(app, express);

import socketRoutes from './routes/socket.js';

// --------------------------------------------------------

// ---------------------------------
// ---------- USE ROUTES -----------
// ---------------------------------

app.use('/api', apiRoutes);

// socket.io communication
io.sockets.on('connection', socketRoutes);

// redirect all others to the index
app.all('*', (req, res) => {
	res.redirect('/');
});

// --------------------------------------------------------

// ---------------------------------
// ------------ LISTEN -------------
// ---------------------------------

server.listen(conf.PORT, conf.IP);
console.log(`Server started on port ${conf.PORT}`);
