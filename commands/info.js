const client = require("../app.js");
const Discord = require("discord.js");
const config = require("../config.json");
const settings = require("../serversettings.json");



let red = [242, 56, 79];
let green = [120, 193, 82];


module.exports.run = async (message) => {
	let deleteEmoji = client.guilds.find("id", "403264935745814560").emojis.find("name", "delete");
	let m;
	let application;
	await client.fetchApplication().then(id => application = id).catch(err => console.log(err));
	let name = client.user.username;
	let image = client.user.displayAvatarURL;
	if (message.content.split(" ").length < 2) {
		return message.channel.send(new Discord.RichEmbed()
			.setAuthor(name, image)
			.addField("I think we lost someone along the way!", "You didn't provide enough arguments to the command!")
			.setColor(red)
			.addField("Possible arguments", "*-* guild\n*-* self\n*-* bolt")
		).then().catch(err => {
			console.log(err);
			message.channel.send("Oops! Seems like you triggered an error! It has been reported to my creator.");
			application.owner.createDM().then(channel => channel.sendCode("js", err)).catch(err => console.log(err));
		})

	}
	let args = message.content.split(" ").slice(1);
	let embed = new Discord.RichEmbed().setColor(green);
	switch (args[0]) {
		case "guild":
		case "server":
			let userCounter = 0;
			let botCounter = 0;
			message.guild.members.filter(member => !member.user.bot).forEach((m) => userCounter++);
			message.guild.members.filter(member => member.user.bot).forEach((m) => botCounter++);
			embed.addField("Guild owner", message.guild.owner, false);
			embed.addField("Non-bot users", userCounter, true);
			embed.addField("Bot users", botCounter, true);
			embed.setTimestamp();
			embed.addField("Total users", message.guild.members.size, true);
			embed.addField("Roles available", `${message.guild.roles.size} roles are available!`, true);
			embed.addField("Guild icon", message.guild.iconURL, false);
			embed.setImage(message.guild.iconURL)
			m = await message.channel.send(embed);
			return m.react(deleteEmoji);
		case "me":
		case "self":
		case "i":
			embed.addField("Name", message.author.username, true);
			embed.addField("ID", message.author.id, true);
			embed.addField("Is bot?", message.author.bot, true);
			embed.setTimestamp();
			embed.addField("Account created", message.author.createdAt.toUTCString(), true);
			embed.addField("Guild joined", message.member.joinedAt.toUTCString(), true);
			embed.addField("Roles", message.member.roles.map(r => r.toString()), false)
			embed.addField("Avatar display URL", message.author.displayAvatarURL, false);
			embed.setImage(message.author.displayAvatarURL);
			m = await message.channel.send(embed);
			return m.react(deleteEmoji);
		case "bot":
		case "you":
		case "bolt":
		case "u":
			embed.addField("Creator", application.owner.tag, true);
			embed.setTimestamp();
			embed.addField("Connections", `I am connected to ${client.guilds.size} guilds, with ${client.users.size} users`, true)
			embed.addField("<:nodejs:469471630767423489> I am written in", "Node.js, using the `discord.js` library!", true)
			embed.addField("<:github:474547211288444938> I am open source", "You can find my cogs and bolts [here](https://github.com/zaph-x/bolt/)", );
			embed.addField("<:discord:469471604561412096> Invite me", "[Click here](https://discordapp.com/oauth2/authorize?client_id=473864695997136906&scope=bot&permissions=268443712) to invite me to your server!", );
			embed.setTitle("I am me!");
			embed.setDescription(`Hello! I am Bolt. A server moderation bot!\nTo get a list of all of the publically available commands, do \`${settings[message.guild.id].prefix}help\`!\nHere is some more information about me as well as some usefull links!`);
			m = await message.channel.send(embed);
			return m.react(deleteEmoji);
	}
};