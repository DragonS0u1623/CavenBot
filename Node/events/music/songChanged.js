const Event = require('../../structures/Event.js')

module.exports = class extends Event {
	constructor(client, name='songChanged') {
		super(client, name, {
			emitter: client.player
		})
	}

	async run(queue, newSong, oldSong) {
		const { message } = queue.data
        message.channel.send(`Song ended. New song ${newSong}`)
	}
}