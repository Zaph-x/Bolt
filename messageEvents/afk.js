const afk = require("./files/afk.json");
const Discord = require("discord.js");
const client = require("../app.js");
const fs = require("fs");
const _ = require("lodash")

// E:\Programming\jsBot\messageEvents\files\afk.json


let green = [120, 193, 82];
let red = [242, 56, 79];
let blue = [133, 150, 211];

module.exports.trigger = async (message) => {
    let data = fs.readFileSync("./messageEvents/files/afk.json");
    let users = JSON.parse(data.toString());

    const mentions = message.mentions.users;
    if (users.users.includes(message.author.id)) {
        _.pull(users.users, message.author.id)
        await saveUser(users);
        return message.channel.send(new Discord.RichEmbed()
        .setColor(green)
        .setTitle(`Welcome back, ${message.author.username}!`)
        .setDescription("Your status is no longer set to AFK, due to your latest message!"))
    }
    if (mentions.size > 0) {
        for (let member of mentions) {
            member.filter(obj => {
                if (users.users.includes(obj.id)) {
                    message.channel.send(new Discord.RichEmbed()
                        .setColor(blue)
                        .setTitle("A user is AFK")
                        .setDescription(`User ${obj.username} was AFK when you mentioned them! They have been notified of your message in a DM!`));
                    obj.createDM().then(
                        channel => channel
                            .send(new Discord.RichEmbed()
                                .setColor(blue)
                                .setTitle("You were mentioned!")
                                .setDescription(`While you were away, you were mentioned by ${message.author.username}`)
                                .addField("Message was:", message.content)).catch(err => console.err(err)));
                }
            })
        }
    }
    return;
}

function saveUser(dataset) {
    fs.writeFile(__dirname + "/files/afk.json", JSON.stringify(dataset, null, 2), function (err) {
        if (err) {
			let undefEmbed = new Discord.RichEmbed()
				.setColor(red)
				.addField("Oops! Something went wrong...", "An error occoured while trying to modify the configuration file...", true)
				.setTimestamp()
				.setAuthor(client.user.username, client.user.avatarURL);
			message.channel.send(undefEmbed).then().catch(err => console.error(err));
			console.log(err);
		}
    })
}