const Event = require('../../structures/Event')

module.exports = class extends Event {
	constructor(client, name='error') {
		super(client, name, {
			emitter: client.player
		})
	}

	async run(error, queue) {
		const { message } = queue.data
        console.log(`Error in ${queue.guild.name}: ${error}`)
        message.channel.send(`An error has occurred please try again`)
	}
}