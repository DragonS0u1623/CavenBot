const mongoose = require('mongoose')

const reqString = {
	type: String,
	required: true
}

const blacklistSchema = new mongoose.Schema({
	guildId: reqString,
	channels: [String],
	users: [String]
})

module.exports = mongoose.model('blacklist', blacklistSchema)