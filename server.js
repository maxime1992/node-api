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

// import mongoose to store data
import mongoose from 'mongoose';

// import passport to manage login
import passport from 'passport';

// the bearer strategy is auth by token
// (no session, no crlf, etc ...)
// NEEDS SSL !!!
import BearerStrategy from 'passport-http-bearer';

// control CORS
import cors from 'cors';

// use morgan to log
import morgan from 'morgan';

// bodyparser to parse forms
import bodyParser from 'body-parser';

// express validator allows us the control the data
import validator from 'express-validator';

// compress to serve content gzipped if possible
import compress from 'compression';

// --------------------------------------------------------

// ---------------------------------
// ----------- DATABASE ------------
// ---------------------------------

mongoose.connect('mongodb://localhost/databasetest1');

// --------------------------------------------------------

// ---------------------------------
// -------------- ÂUTH -------------
// ---------------------------------

// import models of the app
import {User} from './routes/resources/user/user.model';

passport.use(
	new BearerStrategy(
		(token, done) => {
			User.findOne({accessToken: token},
				(err, user) => {
					if (err) {
						return done(err);
					}

					if (!user) {
						return done(null, false);
					}

					return done(null, user, {scope: 'all'});
				}
			);
		}
	)
);

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
app.use(validator());

// --------------------------------------------------------

// ---------------------------------
// -------- DECLARE ROUTES ---------
// ---------------------------------

import apiRoutesImport from './routes/api';
const apiRoutes = apiRoutesImport(app, express);

import authRoutesImport from './routes/auth';
const authRoutes = authRoutesImport(app, express);

import userRoutesImport from './routes/resources/user/user';
const userRoutes = userRoutesImport(app, express);

import socketRoutes from './routes/socket';

// --------------------------------------------------------

// ---------------------------------
// ---------- USE ROUTES -----------
// ---------------------------------

// basic API info
app.use('/api', apiRoutes);

// auth to get a token
app.use('/api/auth', authRoutes);

// following routes are protected (connection required)
// following routes will have access to req.user
// which contains the current user
app.use(passport.authenticate('bearer', {session: false}));

app.use('/api/users', userRoutes);

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
