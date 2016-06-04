// import mongoose to store data
import mongoose from 'mongoose';

// get the mongoose schema
let Schema = mongoose.Schema;

// define a schema
const userSchema = new Schema({
	name: {
		first: {type: String, required: true},
		last: {type: String, required: true},
		nick: {type: String, required: true, unique: true},
	},
	password: {type: String, required: true},
	admin: {type: Boolean, required: true},
	createdAt: {type: Date, required: true},
	updatedAt: {type: Date, required: true}
});

// create the model from the schema
const User = mongoose.model('User', userSchema);

export default User;
