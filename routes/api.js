export default (app, express) => {
	const apiRoutes = express.Router();

	apiRoutes.route('/')
		.get((req, res) => {
			res.json({
				'version': 1
			});
		});

	apiRoutes.route('/time')
		.get((req, res) => {
			res.json({
				'time': (new Date()).toString()
			});
		});

	return apiRoutes;
}
