const Event = require('../../structures/Event.js')

module.exports = class extends Event {
	constructor(client, name='songFirst') {
		super(client, name, {
			emitter: client.player
		})
	}

	async run(queue, song) {
		const { message } = queue.data
        message.channel.send(`${song} is now playing.`)
	}
}