const Event = require('../../structures/Event.js')

module.exports = class extends Event {
	constructor(client, name='queueEnd') {
		super(client, name, {
			emitter: client.player
		})
	}

	async run(queue) {
		const { message } = queue.data
        message.channel.send(`Queue ended. You can start another song with \`m?play\` or use \`m?leave\` to make me leave the voice channel`)
	}
}