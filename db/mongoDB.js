const connectToDB = async () => {
	const mongoose = require("mongoose");
	const { dbName, user, password } = require("../config/db.js");

	const dbURI = `mongodb+srv://${user}:${password}@cluster0.fbyam.mongodb.net/${dbName}?retryWrites=true&w=majority`;
	const connectionOptions = {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	};
	try {
		await mongoose.connect(process.env.MONGODB_URI, connectionOptions, () => {
			console.log("Connected to MongoDB with mongoose !");
		});
	} catch (err) {
		console.log(err);
	}
};

module.exports = connectToDB;
