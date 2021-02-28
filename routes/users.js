const router = require("express").Router()
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const Url = require('../db/models/url');
const bcrypt= require('bcrypt')

const User = require('../db/models/user');
const validate=require('../db/models/user');
const auth = require('../middlewares/auth');
// const isAdmin = require('../middlewares/admin');

// @route     POST /signup
// @desc      Send User Information

router.post('/signup', async (req, res, next) => {
    if(!req.body.email || !req.body.name || !req.body.password){
		return next(new Error("Missing parameter"))
	}
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email:req.body.email});
    if (user) return res.status(400).send('User already registered');


    try{
        user= new User(
            
            _.pick(req.body,['password','name','email','youtubeChannel'])
        );
        const salt = await bcrypt.genSalt(10);
        user.password= await bcrypt.hash(user.password,salt);
        
        user=await user.save();
        const token = user.generateAuthToken();
        
        
        res.header('Authorization', token).send(_.pick(user, ['_id', 'name', 'email']));
    }
    catch(err){
        console.error(err);
        res.status(500).json('Server error');
    }


});


// @route     GET /link/:slug
// @desc      Statastics of Link
router.get('/link/:slug', auth, async (req, res, next) => {
    try{
        const url=await Url.findOne({ slug: req.params.slug });
        console.log(url)
        if(!url)  next(new Error("Link Details not found"))
        else res.send(url);
    }
    catch{
        next();
    }
    
});

// @route     GET /:userID
// @desc      List of all Links
router.get('/:userID',  auth,async (req, res, next) => {
    
    if(req.params.userID == req.user._id){

        try{
            console.log(req.user._id)
            const userss=await User.findById(req.user._id).populate('urls').select('email urls');
            res.send(userss);
    
        }
        catch{
            console.log("WTF")
            next();
        }
    }
    else{
        res.status(401).send("Not allowed to access others information")
    }
});

module.exports = router;




