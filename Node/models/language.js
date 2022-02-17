const { Schema, model } = require('mongoose')

const reqString = {
	type: String,
	required: true
}

const langSchema = new Schema({
	user: reqString,
	lang: reqString
})

module.exports = model('language', langSchema)