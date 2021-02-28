const express = require('express');
const requestCountry = require('request-country');
const router = express.Router();

var app = express();
const Url = require('../db/models/url');

// @route     GET /:code
// @desc      Redirect to long/original URL
router.get('/:code', async (req, res) => {
  console.log("Here is the IP of the request");
  console.log(requestCountry(req));

  
  try {
    const url = await Url.findOne({ slug: req.params.code });
   
    if (url) {
      if(req.useragent.isiPhone || req.useragent.isiPod || req.useragent.isSafari){
        url.iosClicks++;
        url.save();
        if(url.iosScheme.length >2)
        return res.redirect(url.iosScheme);
        else return res.redirect(url.longURL);
      }
      else if(req.useragent.isAndroid || req.useragent.isMobile){
        url.androidClicks++;
        url.save();
        if(url.androidScheme.length >2)
        return res.redirect(url.androidScheme);
        else return res.redirect(url.longURL);
      }
      else{
        url.webClicks++;
        url.save();
        return res.redirect(url.longURL);
      }
      
     
    } 
    else {
      return res.redirect("https://main.d378z6kep2qz7.amplifyapp.com/e/error/");
    }
  } 
    catch (err) {
      console.error(err);
      res.status(500).json('Server error');
    }
});

module.exports = router;