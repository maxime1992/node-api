// import the config
import conf from '../../../config';

// import models of the app
import User from './user.model';

// import passport to manage login
import passport from 'passport';

// use jsonwebtoken to create token
import jwt from 'jsonwebtoken';

export default (app, express) => {
	const userRoutes = express.Router();

	userRoutes.route('/')
		// DEBUG ONLY : Return all the users !
		.get((req, res) => {
			const users = User.find({}, (err, users) => {
				if (err) throw err;

				res.json({users});
			});
		});

	return userRoutes;
}
