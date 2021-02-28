const mongoose = require("mongoose")

let InitDB = async()=>{
	if(!process.env.MONGO_URI){
		console.error(new Error("MongoDB uri missing."))
        
		return
	}
	try{
        
		mongoose.set("useCreateIndex", true)
		await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		})
        console.log("Connected to Mongo")
	}catch(err) {
		console.log(err)
	}
}

module.exports = InitDB