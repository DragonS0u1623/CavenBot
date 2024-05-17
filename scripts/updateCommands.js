import { updateRegisteredCommands } from "./../utils/utils.js"

updateRegisteredCommands().then( () => {
    console.log("Commands updated")
}).catch((err) => {
    console.error(err)
})