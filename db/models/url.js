const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema(
    {
    slug:{
        type: String,
        unique: true,
        required: true
    },
    
    longURL:{
        type: String,
        unique: false,
        required: true
    },
    host:{
        type: String,
    },
    webClicks:{
        type:Number,
        required: true,
        default:0
    },
    androidClicks:{
        type:Number,
        required: true,
        default:0
    },
    iosClicks:{
        type:Number,
        required: true,
        default:0
    },
       
        
   
    shortUrl:{
        type: String,
        unique: true,
        required: true
    },
    androidScheme:{
        type: String
        
    },
    iosScheme:{
        type: String
        
    },

    },
    {
      timestamps: true,  
    collection: "urls",
    autoIndex: true
    })

module.exports = mongoose.model('Url', urlSchema);