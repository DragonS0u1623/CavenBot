const mongoose = require('mongoose')

const reqString = {
	type: String,
	required: true
}

const reqBool = {
	type: Boolean,
	required: true
}

const serverSchema = new mongoose.Schema({
	guildId: reqString,
	prefix: reqString,
	welcome: reqBool,
	audits: reqBool,
	roledm: reqBool,
	joinrole: reqBool
})

module.exports = mongoose.model('serversettings', serverSchema)