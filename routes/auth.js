// import models of the app
import User from './resources/user/user.model';

// import passport to manage login
import passport from 'passport';

// use jsonwebtoken to create token
import jwt from 'jsonwebtoken';

export default (app, express) => {
	const authRoutes = express.Router();

	authRoutes.route('/signUp')
		.post((req, res) => {
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
				password: req.body.password,
				admin: false,
				createdAt: new Date(),
				updatedAt: new Date(),
				accessToken: token
			});

			// save the user
			newUser.save((err) => {
				if (err) throw err;

				console.log('user saved !');
				res.json(newUser);
			});
		});

	authRoutes.route('/logIn')
		.get((req, res) => {
			User.findOne({email: req.query.email, password: req.query.password}, (err, user) => {
				if (err) throw err;

				res.json(user);
			});
		});

	return authRoutes;
}
