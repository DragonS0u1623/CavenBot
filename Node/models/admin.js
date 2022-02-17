const mongoose = require('mongoose')

const reqString = {
	type: String,
	required: true
}

const adminSchema = new mongoose.Schema({
	guildId: reqString,
	audits: reqString,
	welcome: reqString,
	// eslint-disable-next-line camelcase
	welcome_message: reqString,
	language: reqString
})

module.exports = mongoose.model('admin', adminSchema)