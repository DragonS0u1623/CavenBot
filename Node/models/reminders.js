const { Schema, model } = require('mongoose')

const reqNum = {
	type: Number,
	required: true
}

const reqString = {
	type: String,
	required: true
}

const remindSchema = new Schema({
	guildId: reqString,
	userId: reqString,
	reminders: [
		{
			num: reqNum,
			reminder: reqString
		}
	]
})

module.exports = model('reminders', remindSchema)