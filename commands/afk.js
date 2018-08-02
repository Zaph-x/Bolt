const client = require("../app");
const fs = require("fs");
const _ = require("lodash");
const Discord = require("discord.js");

let green = [120, 193, 82];
let red = [242, 56, 79];

module.exports.run = async (message) => {
    
    let data = fs.readFileSync("./messageEvents/files/afk.json");
    let users = JSON.parse(data.toString());

    if (!users.users.includes(message.member.id)) {
        users.users.push(message.member.id);
        message.channel.send(new Discord.RichEmbed().setTimestamp().setColor(green).setTitle("You are marked as AFK").setDescription("Whenever someone mentions you, they will be notified of your absense! Whenever you send a message again, you will no longer be marked as AFK."))
    } else {
        _.pull(users.users, message.member.id)
        message.channel.send(new Discord.RichEmbed().setTimestamp().setColor(green).setTitle("You are no longer AFK").setDescription("People will no longer be notified if you are absent."))
    }
    saveUser(users);





}

function saveUser(dataset) {
    fs.writeFile("./messageEvents/files/afk.json", JSON.stringify(dataset, null, 2), function (err) {
        if (err) {
			let undefEmbed = new Discord.RichEmbed()
				.setColor(red)
				.addField("Oops! Something went wrong...", "An error occoured while trying to modify the configuration file...", true)
				.setTimestamp()
				.setAuthor(client.user.username, client.user.avatarURL);
			message.channel.send(undefEmbed).then().catch(console.error);
			console.log(err);
		}
    })
}