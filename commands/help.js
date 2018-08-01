const cmd = require("./commands.json");
const client = require("../app.js");

module.exports.run = async (message) => {
	Discord = require("discord.js");
	const embed = new Discord.RichEmbed();
	embed.setTitle("Help table")
		.setAuthor(message.author.username, message.author.displayAvatarURL)
		.setTimestamp();
	for (var i = 0; i < cmd.commands.length; i++) {
		if (!cmd.commands[i].admin) {
			embed.addField(cmd.commands[i].name, cmd.commands[i].description, false);
		}
	}

	message.channel.send(embed);


};