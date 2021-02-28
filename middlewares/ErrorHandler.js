const { AssertionError } = require("assert")
const { MongoError } = require("mongodb")

// eslint-disable-next-line no-unused-vars
function errorHandler (error, req, res, next) {
	console.error(process.env.NODE_ENV === "production" ? error.message : error)
	const stack = process.env.NODE_ENV === "production" ? "🥞" : error.stack
	var body = {
		success: false,
		error: error.message,
		stack
	}
	if (error instanceof AssertionError) {
		body.type = "AssertionError"
	} else if (error instanceof MongoError) {
		res.statusCode = 503
		body.type = "MongoError"
	}
	var status = res.statusCode && typeof res.statusCode === "number" && res.statusCode < 600 && res.statusCode > 400  ? res.statusCode : 400
	if(res.statusCode === 401){
		body.auth = false
	}
	res.status(status).json(body)
}

function notFound(req, res, next) {

	res.status(404)
	const error = new Error(`🔍 - Not Found - ${req.originalUrl}`)
	next(error)
}

module.exports = {
	notFound,
	errorHandler
}
