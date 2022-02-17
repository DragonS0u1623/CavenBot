const Event = require('../../structures/Event.js')

module.exports = class extends Event {
	constructor(client, name='songAdd') {
		super(client, name, {
			emitter: client.player
		})
	}

	async run(queue, song) {
		const { message } = queue.data
        const { requestedBy } = song
        message.channel.send(`${song} added to the queue by ${requestedBy}`)
	}
}