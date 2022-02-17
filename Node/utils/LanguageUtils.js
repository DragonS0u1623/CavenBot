const fs = require('fs')
const langSchema = require('../models/language')
const adminSchema = require('../models/admin')

let languages = []

module.exports = class LanguageUtils {
	constructor() {
		languages = fs.readFileSync(require.resolve('../resources/languages/list.txt')).toString('utf-8').split('\n')
	}

	getGuildLanguage(guild) {
		const doc = adminSchema.findOne({ guildid: guild.id }, 'language')
		return doc.lang || 'en_US'
	}

	getUserLanguage(user) {
		const doc = langSchema.findOne({ user: user.id }, 'lang')
		return doc.lang || null
	}

	getGuildOrUserLanguage(user, guild) {
		let lang = this.getUserLanguage(user)
		if (!lang) lang = this.getGuildLanguage(guild)
		return lang
	}

	getLanguage(user, guild) {
		return this.getLanguageFile(this.getGuildLanguage(user, guild))
	}

	// eslint-disable-next-line no-dupe-class-members
	getLanguage(guild) {
		return this.getLanguageFile(this.getGuildLanguage(guild))
	}

	getLanguageFile(lang) {
		const file = require(`../resources/languages/${lang}.json`)
		return file
	}

	getLanguages() {
		const langs = `${languages.join(', ')}`.substring(0, langs.lastIndexOf(',')).trim()
		return langs
	}

	isValidLang(lang) {
		return languages.includes(lang)
	}
}