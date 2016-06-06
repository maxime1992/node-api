process.env.NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
process.env.PORT = process.env.PORT ? process.env.PORT : 9090;

const config = {
	ENV: process.env.NODE_ENV,
	PORT: process.env.PORT,
	IP: '127.0.0.1',
	// allow calling the API from another server ?
	CORS: true,
	// how long a token is valid ? (string or int in seconds)
	tokenTimeout: '3 days',
	tokenSecretKey: 'secretKey'
};

export default config;
