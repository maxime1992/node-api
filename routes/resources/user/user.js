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

	userRoutes.route('/signIn')
		.get((req, res) => {
			// TODO : IF PWD + nickname matches ...
			const token = jwt.sign({expiresIn: '3 days'}, 'secretKey');

			User.findOneAndUpdate({'name.nick': 'maxime1992'}, {accessToken: token}, (err, user) => {
				if (err) throw err;

				console.log(user);
				res.json({token});
			});

		});

	return userRoutes;
}
