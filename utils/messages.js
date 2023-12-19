const moment = require('moment')

function formatMessages(username, text) {
    // formats the message in object form with username , and time 
    return {
        username,
        text,
        time : moment().format('h:mm a')
    }
}

module.exports = formatMessages;
