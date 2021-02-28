const router = require("express").Router()
const _ = require('lodash');
const Joi = require('joi');
const bcrypt= require('bcrypt')
const User = require('../db/models/user');
const auth = require('../middlewares/auth');

// @route     POST /api/auth/login
// @desc      Send the JWT Token
router.post('/login', async (req, res, next) => {
    if(!req.body.email  || !req.body.password){
		return next(new Error("Missing parameter"))
	}
   

let user = await User.findOne({email:req.body.email});
if (!user) return res.status(400).send('Invalid email or password');

const validPassword= await bcrypt.compare(req.body.password,user.password);
if(!validPassword) return res.status(400).send('Invalid email or password');

const token = user.generateAuthToken();
res.status(200).send(
  {
    token:token
  });
});



function validate(req) {
    const schema = Joi.object({
      email: Joi.string().min(5).max(255).required().email(),
      password: Joi.string().min(5).max(255).required()
    });
  
    const validation = schema.validate(req)
    return validation;
  }



// @route     GET /api/auth/
// @desc      Send User Information required for frontend
router.get("/", auth, async (req, res) => {
  

    try{
        
        const user=await User.findById(req.user._id).populate('urls').select('email urls name');
        res.status(200).send({
          success: true,
          auth: true,
          user
        })

    }
    catch{
        console.log("WTF")
        next();
    }


});

module.exports = router;