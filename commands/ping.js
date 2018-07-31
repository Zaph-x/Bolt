const client = require("../app.js");
const Discord = require("discord.js");
let red = [242, 56, 79];
let orange = [240, 162, 99];
let yellow = [246, 228, 142];
let green = [120, 193, 82];


module.exports.run = async (message) => {
	if (message.content.split(" ").size > 1) {
		return message.channel.send(new Discord.RichEmbed().setColor(red).setAuthor(client.user.username, client.user.displayAvatarURL).addField("That's a no!", "It seems there were too many arguments present!")).then().catch(console.log);
		
	}
	message.delete(5);
	const m = await message.channel.send("Ping?");
	let lat = m.createdTimestamp - message.createdTimestamp;
	let apiLat = Math.round(client.ping);
	let embed = new Discord.RichEmbed().setAuthor(client.user.username, client.user.displayAvatarURL).addField("Latency", lat, true).addField("API latency", apiLat, true);
	if (lat > 250) embed.setColor(red);
	else if (lat > 128) embed.setColor(orange);
	else if (lat > 60) embed.setColor(yellow);
	else embed.setColor(green);
	m.edit(embed);
};