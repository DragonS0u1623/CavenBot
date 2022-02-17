const Command = require('../../structures/Command')

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			name: 'help',
			category: 'Misc',
			description: 'Sends the commands page',
            guildOnly: false
		})
	}

	async run(message, _args) {
        const invite = 'https://cavenbot-website.herokuapp.com/commands'
		await message.channel.send(invite)
	}
}