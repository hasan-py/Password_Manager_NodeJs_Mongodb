const mongoose = require('mongoose')
const db = require('./db')

const passwordSchema = new mongoose.Schema({
	cat_name:{
		type:mongoose.Schema.Types.ObjectId,
		ref:"categories",
		required:true,
	},
	project:{
		type:String,
		required:true
	},
	password:{
		type:String,
		required:true
	},
	date:{
		type:Date,
		default:Date.now()
	}
})

const passwordModel = mongoose.model('passwords',passwordSchema)
module.exports = passwordModel

