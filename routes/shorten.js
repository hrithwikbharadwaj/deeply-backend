const router = require("express").Router()
const validUrl = require('valid-url');
const shortid = require('shortid');
const User = require('../db/models/user');
const auth = require('../middlewares/auth');
var tools = require('./functions/main');
const Url = require('../db/models/url');


// @route     POST /api/url/shorten
// @desc      Create short URL
router.post('/shorten',auth, async (req, res, next) => {
 
  if(!req.body.longURL){
		return next(new Error("Missing parameter"))
	}
  let { longURL,slug} = req.body;
  
  const baseUrl = process.env.baseURL

  

  // Check base url
  if (!validUrl.isUri(baseUrl)) {
      console.log(baseUrl)
    return res.status(401).json('Invalid base url');
  }
 
  
  if(slug!=null){
    let whiteSpace=tools.stringHasTheWhiteSpaceOrNot(slug);
    if(slug.match('/') ) return res.status(400).json(`Slug Can't have BackSlash `);
    if( whiteSpace==true)  return res.status(400).json(`Slug Can't have Whitespace`);
  }
  
  // Check long url
  if (validUrl.isUri(longURL)) {
    try {
      
      
    // let url = await Url.findOne({ longURL });
      // if (url) {
      //   res.json(url); // {Depreciated! - Stoped on public demand } Sending the short link if it's already created.
      // } 
      
        if(!slug){
          slug = shortid.generate();
        }
        else {
          const existing = await Url.findOne({ slug });
          if (existing){
            res.status(500);
            return next(new Error("Slug already in use"))
          }
        }
       
        
       
        const shortUrl = baseUrl + '/' + slug;
        const deeplinkdetails=  await tools.DeepLink(longURL);
        
        

        const{ androidScheme, iosScheme, host} = deeplinkdetails;
      
       
        url = new Url({
          longURL,
          shortUrl,
          slug,
          androidScheme,
          iosScheme,
          host,
          date: new Date()
        });

        await url.save();
         // add url to user model
         let user = await User.findById(req.user._id);
        if(user!=null){
          console.log("user null?")
          await user.urls.push(url);
          await user.save();
        }
        
        
         
         
        

        res.json(url);
      
    } catch (err) {
      console.error(err);
      res.status(500).json('Server error');
    }
  } else {
     
    res.status(401).json('Invalid long url');
  }
});

module.exports = router;