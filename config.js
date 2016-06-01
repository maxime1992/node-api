process.env.NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
process.env.PORT = process.env.PORT ? process.env.PORT : 9090;

const config = {
	ENV: process.env.NODE_ENV,
	PORT: process.env.PORT,
	IP: '127.0.0.1',
	CORS: true
};

export default config;
