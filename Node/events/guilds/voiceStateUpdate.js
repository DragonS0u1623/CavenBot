const Event = require('../../structures/Event.js')

module.exports = class extends Event {
	async run(oldState, newState) {
        const { member } = oldState
        console.log(member)
		if (member?.user?.bot) return


	}
}