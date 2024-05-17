module.exports.isCommand = (command) => {
    return command.data && command.execute
}
module.exports.isEvent = (event) => {
    return event.name && event.once && event.execute
}