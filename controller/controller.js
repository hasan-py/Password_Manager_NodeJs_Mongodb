const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const userModel = require('../models/user')
const categoryModel = require('../models/category')
const passwordModel = require('../models/password')


let allCategory = categoryModel.find({}).sort({cat_name:"1"})
let allPassword = passwordModel.find({}).sort({cat_name:"1"})

/*
For local Storage
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}
Get From Local storage
let loggedInUser = localStorage.getItem('userName')
*/

// Get from session
let loggedInUser = null




// Dashboard Controller
exports.dashboard = (req,res,next)=> {
	loggedInUser = req.session.userName
	if(loggedInUser){
    	res.render('dashboard', { title: 'Dashboard PMS', loggedInUser:loggedInUser});
	}else{
		res.redirect('/')
	}
	
};

exports.logout = (req,res,next)=> {
	/*
	Local storage uses
	localStorage.removeItem('userName')
	localStorage.removeItem('userToken')
	*/
	delete req.session.userName
	delete req.session.userToken
	let loggedInUser = null

    res.redirect('/');
};





// Login Controller
exports.getLogin = (req,res,next)=> {
    res.render('index', { title: 'PMS Login',msg:"" });
};

exports.postLogin = (req,res,next)=>{
	let	email =  req.body.email
	let	password =  req.body.password
	let user = userModel.findOne({email:email})
	user.exec((err,data)=>{
		if(err) throw err;
		if(data){
			let userPassword = data.password
			let userId = data.__id
			let username = data.name
			if(bcrypt.compareSync(password,userPassword)){
				let token = jwt.sign({userId:userId},'loginToken') // Here loginToken name set for verify token next 
				/*
				localStorage.setItem('userToken',token);
				localStorage.setItem('userName',username);
				*/
				req.session.userToken = token
				req.session.userName = username

				res.redirect('/dashboard');
			}else{
				res.render('index', { title: 'PMS Login',msg:"Invalid username or password" });
			}
		}else{
			res.render('index', { title: 'PMS Login',msg:"Invalid username or password" });
		}
	})
};





// Signup Controller
exports.getSignup = (req,res,next)=> {
    res.render('signup', { title: 'PMS Signup', msg:"" });
};

exports.postSignup = (req,res,next)=> {
	let	name =  req.body.name
	let	email =  req.body.email
	let	password =  req.body.password
	let	confirmPassword =  req.body.confirmPassword
	
	if(password.length<8 && confirmPassword.length<8){
		res.render('signup', { title: 'PMS Login', msg:"Password must be 8 char" });
	}

	if(password!=confirmPassword){
		res.render('signup', { title: 'PMS Login', msg:"Password doesn't match" });
	}else{
		password = bcrypt.hashSync(password,10)
		let user = new userModel ({
			name: name,
			email: email,
			password: password
		})
		user.save((err,doc)=>{
			if(err) throw err;
			console.log(user)
			res.render('signup', { title: 'PMS Login', msg:"User Created succesfully" });
		});
	}
};





// Category Controller
exports.getAllCategory = (req,res,next)=>{

	allCategory.exec((err,data)=>{
		if(err) throw err;
		res.render('all-category', { title: 'All Category',loggedInUser:loggedInUser,data:data });
	})
}

exports.getAddCategory = (req,res,next)=>{
  	res.render('add-category', { title: 'Add Password Category',loggedInUser:loggedInUser,msg:"" });
}

exports.postAddCategory = (req,res,next)=>{
	let cat_name = req.body.cat_name
	let category = new categoryModel({
		cat_name:cat_name
	})
	category.save((err,doc)=>{
		if (err) throw err;
		res.render('add-category', { title: 'Add Password Category',loggedInUser:loggedInUser,msg:"Category Added succesfully" });
	})
}

exports.getDeleteCategory = (req,res,next)=>{
	let id = req.params.id
	let del = categoryModel.findByIdAndDelete(id)
	del.exec((err)=>{
		if(err) throw err;
		allCategory.exec((err,data)=>{
			if(err) throw err;
				res.render('all-category', { title: 'All Category',loggedInUser:loggedInUser,data:data });
			})
	})
}

exports.getEditCategory = (req,res,next)=>{
	let edit = categoryModel.findById(req.params.id)
	edit.exec((err,data)=>{
		if(err) throw err;
		res.render('edit-category', { title: 'Edit Category',loggedInUser:loggedInUser,data:data });
	})
}

exports.postEditCategory = (req,res,next)=>{
	let cat_name = req.body.cat_name
	let id = req.body._id
	let edit = categoryModel.findByIdAndUpdate(id,{
		cat_name:cat_name
	})
	edit.exec((err,doc)=>{
		if(err) throw err;
		res.redirect('/all-category');
	})
}





// Password Controller 
exports.getAllPassword = (req,res,next)=>{
	allPassword
	.populate("cat_name")
	.exec((err,data)=>{
		if(err) throw err;
		console.log(data)
		res.render('all-password', { title: 'View All Password',loggedInUser:loggedInUser,data:data });
	})
}

exports.getAddPassword = (req,res,next)=>{
	
	allCategory
	.select("cat_name")
	.exec((err,data)=>{
		if(err) throw err;
		console.log(data)
		res.render('add-password', { title: 'Add Password',loggedInUser:loggedInUser,data:data,msg:""});
	})

}

exports.postAddPassword = (req,res,next)=>{
	let passwordCategory = req.body.passwordCategory
	let editor1 = req.body.editor1
	let project = req.body.project
	
	if(!editor1.length > 0 || !project.length > 0){
		allCategory.exec((err,data)=>{
			if(err) throw err;
			res.render('add-password', { title: 'Add Password',loggedInUser:loggedInUser,data:data,msg:"Filled must not be empty."});
		})
	}else{

		let password = new passwordModel({
			cat_name:passwordCategory,
			project:project,
			password:editor1
		})
		password.save((err,doc)=>{
			if(err) throw err;
			allCategory.exec((err,data)=>{
				if(err) throw err;
				res.render('add-password', { title: 'Add Password',loggedInUser:loggedInUser,data:data,msg:"Password added successfully"});
			})
		})

	}
}

exports.getEditPassword = (req,res,next)=>{
	let edit = passwordModel.findById(req.params.id)
	edit
	.populate('cat_name')
	.exec((err,data)=>{
		if(err) throw err;

		allCategory.exec((err,data1)=>{
			res.render('edit-password', { title: 'Add Password',loggedInUser:loggedInUser,data:data,edit:data1,msg:""});
		})
	})
}

exports.postEditPassword = (req,res,next)=>{
	let cat_name = req.body.passwordCategory
	let project = req.body.project
	let id = req.body._id
	let password = req.body.editor1

	let edit = passwordModel.findByIdAndUpdate(id,{
		cat_name:cat_name,
		project:project,
		password:password
	})
	edit.exec((err,doc)=>{
		if(err) throw err;
		res.redirect('/all-password')
	})
}

exports.getDeletePassword = (req,res,next)=>{
	let id = req.params.id
	let del = passwordModel.findByIdAndDelete(id)
	del.exec((err)=>{
		if(err) throw err;
		allPassword.exec((err,data)=>{
			if(err) throw err;
				res.render('all-password', { title: 'All Password',loggedInUser:loggedInUser,data:data });
			})
	})
}