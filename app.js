const express = require('express');
const InitDB = require("./db/index")
const morgan = require("morgan")
const helmet = require("helmet");
const cors = require("cors")
const users = require('./routes/users');

const useragent = require('express-useragent');

// Environment Variables 
require("dotenv").config()

// DB initialization

InitDB();

// app init
const app = express()

// Middlewares
const ErrorHandler = require("./middlewares/ErrorHandler")
app.use(helmet());
app.use(morgan("dev"))
app.use(cors())
app.use(express.json()); 
app.use(useragent.express());

//test route
app.get("/", (req, res) => {
	res.json({
		success: true,
		
		message: "You have reached the api🎉"
	})
})
app.use('/api/url',require('./routes/shorten'))
app.use('/api/users',users)
app.use('/',require('./routes/index'))
app.use('/api/auth',require('./routes/auth'))

app.use(ErrorHandler.notFound)
app.use(ErrorHandler.errorHandler)

// app exports
module.exports = app