import { updateRegisteredCommands } from "../utils/utils"

updateRegisteredCommands().then( () => {
    console.log("Commands updated")
}).catch((err) => {
    console.error(err)
})