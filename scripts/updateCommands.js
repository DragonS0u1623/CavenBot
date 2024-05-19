import { updateRegisteredCommands, updateRegisteredTestCommands } from "./../utils/utils.js"

updateRegisteredCommands().then( () => {
    console.log("Commands updated")
}).catch((err) => {
    console.error(err)
})

updateRegisteredTestCommands().then( () => {
    console.log("Test Commands updated")
}).catch((err) => {
    console.error(err)
})