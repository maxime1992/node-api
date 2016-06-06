// import mongoose to store data
import mongoose from 'mongoose';

// use brypt to hash passwords
import bcrypt from 'bcrypt-nodejs';

// get the mongoose schema
const Schema = mongoose.Schema;

// define a schema
const userSchema = new Schema({
	email: {type: String, required: true, unique: true},
	name: {
		first: {type: String, required: true},
		last: {type: String, required: true},
		nick: {type: String, required: true, unique: true},
	},
	password: {type: String, required: true},
	admin: {type: Boolean, required: true},
	createdAt: {type: Date, required: true},
	updatedAt: {type: Date, required: true},
	accessToken: {type: String}
});

// generating a hash
userSchema.methods.generateHash = (password) => {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.password);
};

// create the model from the schema
const User = mongoose.model('User', userSchema);

export default User;
