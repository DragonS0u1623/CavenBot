const { Schema, model } = require('mongoose')

const reqString = {
	type: String,
	required: true
}

const reqBool = {
	type: Boolean,
	required: true
}

const reactSchema = new Schema({
	guildId: reqString,
	channelId: reqString,
	messageId: reqString,
	toggle: reqBool,
	roles: {
		type: Map,
		of: String
	}
})

module.exports = model('reactroles', reactSchema)