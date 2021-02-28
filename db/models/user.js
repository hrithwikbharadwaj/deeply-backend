const mongoose = require("mongoose")
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const UserSchema = new mongoose.Schema(
	{
		name:{
			type: String,
			required: true,
			minlength: 5,
			maxlength:50
		},
		
		email: {
			unique: true,
			trim: true,
			type: String,
			required: true,
			minlength: 10,
			maxlength:255
		},
		youtubeChannel:{
			required:false,
			type:String,
			minlength: 5,
			maxlength:200
		},
		
		password:{
			type: String,
			required: true,
			minlength: 5,
			maxlength:1024
		},
		isAdmin:{
			type:Boolean,
			default: false
		} ,
	
		urls: [{
			type: mongoose.Schema.ObjectId,
			ref: "Url",
			required: false,
		}],

		
		
	},
	{
		timestamps: true,
		collection: "users",
		autoIndex: true
	}
)
UserSchema.methods.generateAuthToken = function() { 
	const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin,email:this.email }, process.env.PRIVATE_KEY);
	return token;
  }
// UserSchema.plugin(notFound)

UserSchema.path("email").validate(function (email) {
	var emailRegex = /^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/
	return emailRegex.test(email) // Assuming email has a text attribute
}, "The e-mail field cannot be empty.")

UserSchema.method("transform", function () {
	var obj = this.toObject()

	//Rename fields
	obj.id = obj._id
	delete obj._id
	delete obj.__v
	delete obj.createdAt
	delete obj.updatedAt

	return obj
})
function validateUser(req) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    });
  
    const validation = schema.validate(req)
    return validation;
  }
module.exports = mongoose.model("User", UserSchema)
exports.validate = validateUser;
