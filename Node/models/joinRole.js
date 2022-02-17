const { Schema, model } = require('mongoose')

const reqString = {
	type: String,
	required: true
}

const joinRoleSchema = new Schema({
	guildId: reqString,
	role: reqString
})

module.exports = model('joinrole', joinRoleSchema)