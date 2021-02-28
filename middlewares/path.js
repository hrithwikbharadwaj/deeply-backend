function setPath(req, res, next) {
	res.set("request-path", req.originalUrl)
	next()
}

module.exports = setPath