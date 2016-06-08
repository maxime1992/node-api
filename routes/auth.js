// import models of the app
import {
	User,
	USER_EMAIL_LENGTH,
	USER_PASSWORD_LENGTH,
	USER_FIRSTNAME_LENGTH,
	USER_LASTNAME_LENGTH,
	USER_NICKNAME_LENGTH
} from './resources/user/user.model';

// import passport to manage login
import passport from 'passport';

// use jsonwebtoken to create token
import jwt from 'jsonwebtoken';

// express validator allows us the control the data
import validator from 'express-validator';
import jsdom from 'jsdom';
import createDompurify from 'dompurify';
const window = jsdom.jsdom('', {
	features: {
		// disables resource loading over HTTP / filesystem
		FetchExternalResources: false,
		// do not execute JS within script blocks
		ProcessExternalResources: false
	}
}).defaultView;
const dompurify = createDompurify(window);

import util from 'util';

export default (app, express) => {
	const authRoutes = express.Router();

	authRoutes.route('/signUp')
		.post((req, res) => {
			// avoid xss
			req.body.email = dompurify.sanitize(req.body.email);
			req.body.password = dompurify.sanitize(req.body.password);
			req.body.firstName = dompurify.sanitize(req.body.firstName);
			req.body.lastName = dompurify.sanitize(req.body.lastName);
			req.body.nickName = dompurify.sanitize(req.body.nickName);

			// sanitize
			req.sanitizeBody('email').trim();
			req.sanitizeBody('password').trim();
			req.sanitizeBody('firstName').trim();
			req.sanitizeBody('lastName').trim();
			req.sanitizeBody('nickName').trim();

			// check
			req.checkBody('email', 'Invalid email').isLength({min: 4, max: 100}).isEmail();
			req.checkBody('password', 'Invalid password').isLength({min: 6, max: 100});
			req.checkBody('firstName', 'Invalid firstName').isLength({min: 2, max: 50});
			req.checkBody('lastName', 'Invalid lastName').isLength({min: 2, max: 50});
			req.checkBody('nickName', 'Invalid nickName').isLength({min: 2, max: 50});

			const errors = req.validationErrors();

			if (errors) {
				res.status(400).send('There have been validation errors: ' + util.inspect(errors));
				return;
			}

			// generate a token
			const token = jwt.sign({expiresIn: '3 days'}, 'secretKey');

			// build the user object
			const newUser = new User({
				email: req.body.email,
				name: {
					first: req.body.firstName,
					last: req.body.lastName,
					nick: req.body.nickName,
				},
				admin: false,
				createdAt: new Date(),
				updatedAt: new Date(),
				accessToken: token
			});

			// hash the password
			newUser.password = newUser.generateHash(req.body.password);

			// save the user
			newUser.save((err) => {
				if (err) throw err;

				console.log('user saved !');

				res.status(201);
				res.json(newUser);
			});
		});

	authRoutes.route('/logIn')
		.get((req, res) => {
			User.findOne({email: req.query.email}, (err, user) => {
				// avoid xss
				req.body.email = dompurify.sanitize(req.body.email);
				req.body.password = dompurify.sanitize(req.body.password);

				// sanitize
				req.sanitizeBody('email').trim();
				req.sanitizeBody('password').trim();

				// check
				req.checkBody('email', 'Invalid email').isLength({min: 4, max: 100}).isEmail();
				req.checkBody('password', 'Invalid password').isLength({min: 6, max: 100});

				if (err) throw err;

				// user does not exists
				if (!user) {
					// unauthorized
					res.status(401);
					res.json(null);
					return;
				}

				// user exists but wrong password
				if (!user.validPassword(req.query.password)) {
					res.status(401);
					res.json(null);
					return;
				}

				// if everything went fine, return the user
				res.status(200);
				res.json(user);
			});
		});

	return authRoutes;
}
