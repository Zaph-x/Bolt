const Discord = require("discord.js");
const client = require("../app.js");
const fs = require("fs");
let data = fs.readFileSync("serversettings.json");
let settings = JSON.parse(data.toString());

let red = [242, 56, 79];
let green = [120, 193, 82];



module.exports.run = async message => {
	if (message.member.hasPermission("ADMINISTRATOR") || message.author.id === client.config.ownerID) {
		let args = message.content.split(" ");
		let name = client.user.username;
		let image = client.user.displayAvatarURL;
		let succEmbed = new Discord.RichEmbed()
			.setTitle("<:settings:469471662715437056> Guild settings")
			.setColor(green)
			.addField("The settings were saved!", "The settings were successfully stored in the configuration file!", true)
			.setTimestamp()

		if (args.length === 1) {
			let settEmbed = new Discord.RichEmbed()
				.setColor(red)
				.setTitle("<:settings:469471662715437056> Guild settings")
				.setDescription("You did not provide a setting to change or did not change a setting! \nHere are your options:")
				.addField("prefix", "This will set the prefix of the bot!")
				.addField("greeting", "This setting determines whether or not the bot will greet new users!")
				.addField("farewell", "This setting determines whether the bot should notify when a user leaves!")
				.addField("join-channel", "This will set the channel where new users will be greeted!")
				.addField("leave-channel", "This will set the channel where leaves are noted!")
				.addField("join-message", "This is the message that will greet new users! To mention the user, type `<@>`")
				.addField("leave-message", "This is the message that will be sent when a user leaves! To mention the user, type `<@>`")
				.addField("log-channel", "This will set the channel where message deletes, edits and such, are logged!")
				.addField("muted-role", `This is the role that will be applied to a user when doing \`${settings[message.guild.id].prefix}mute @user\``);
			return message.channel.send(settEmbed).then().catch(console.error);

		} else if (args.length === 2) {
			checkAndSendOption(message, args[1]);
		} else if (args.length >= 3) {
			switch (args[1]) {
				case "join-channel":
					if (args.length !== 3) return;
					if (args[2] === "this") {
						let chanID = message.channel.id;
						settings[message.guild.id].join_chan = chanID;
						saveSettings(settings);
						message.channel.send(succEmbed).then().catch(console.error);
					} else if (/\d{18}/.test(args[2])) {
						if (args[2] === undefined) {
							message.channel.send(new Discord.RichEmbed()
								.setColor(red)
								.setTitle("<:settings:469471662715437056> Guild settings")
								.addField("Oops! Something went wrong...", "The value entered returned as undefined...", true)
								.setTimestamp()).then().catch(console.error);
						}
						let chan = message.guild.channels.find("id", args[2]);
						if (chan) {
							let chanID = chan.id;
							console.log(chanID);
							settings[message.guild.id].join_chan = chanID;
							saveSettings(settings);
							message.channel.send(succEmbed).then().catch(console.error);
						} else {
							let undefEmbed = new Discord.RichEmbed()
								.setColor(red)
								.addField("That's not right..?", "The ID you entered is not a channel in this guild...", true)
								.setTimestamp()
								.setTitle("<:settings:469471662715437056> Guild settings");
							message.channel.send(undefEmbed).then().catch(console.error);
						}
					} else if (message.guild.channels.find("name", args[2])) {
						let chan = message.guild.channels.find("name", args[2]);
						let chanID = chan.id;
						settings[message.guild.id].join_chan = chanID;
						saveSettings(settings);
						message.channel.send(succEmbed);
					} else {
						let undefEmbed = new Discord.RichEmbed()
							.setTitle("<:settings:469471662715437056> Guild settings")
							.setColor(red)
							.addField("Wait a minute...", "That channel is not part of this server...", true)
							.setTimestamp()
						message.channel.send(undefEmbed).then().catch(console.error);
					}
					break;
				case "leave-channel":
					if (args.length !== 3) return;
					if (args[2] === "this") {
						let chanID = message.channel.id;
						settings[message.guild.id].leave_chan = chanID;
						saveSettings(settings);
						message.channel.send(succEmbed).then().catch(console.error);
					} else if (/\d{18}/.test(args[2])) {
						if (args[2] === undefined) {

							let undefEmbed = new Discord.RichEmbed()
								.setTitle("<:settings:469471662715437056> Guild settings")
								.setColor(red)
								.addField("Oops! Something went wrong...", "The value entered returned as undefined...", true)
								.setTimestamp();
							message.channel.send(undefEmbed).then().catch(console.error);
						}
						let chan = message.guild.channels.find("id", args[2]);
						if (chan) {
							let chanID = chan.id;
							console.log(chanID);
							settings[message.guild.id].leave_chan = chanID;
							saveSettings(settings);
							message.channel.send(succEmbed).then().catch(console.error);
						} else {
							let undefEmbed = new Discord.RichEmbed()
								.setTitle("<:settings:469471662715437056> Guild settings")
								.setColor(red)
								.addField("That's not right..?", "The ID you entered is not a channel in this guild...", true)
								.setTimestamp();
							message.channel.send(undefEmbed).then().catch(console.error);
						}
					} else if (message.guild.channels.find("name", args[2])) {
						let chan = message.guild.channels.find("name", args[2]);
						let chanID = chan.id;
						settings[message.guild.id].leave_chan = chanID;
						saveSettings(settings);
						message.channel.send(succEmbed).then().catch(console.error);
					} else {
						let undefEmbed = new Discord.RichEmbed()
							.setTitle("<:settings:469471662715437056> Guild settings")
							.setColor(red)
							.addField("Wait a minute...", "That channel is not part of this server...", true)
							.setTimestamp();
						message.channel.send(undefEmbed).then().catch(console.error);
					}
					break;
				case "greeting":
					if (args.length !== 3) return;
					let currSetting = new Discord.RichEmbed().setColor(red).setAuthor(name, image).setTimestamp().addField("Oh wow!", `That setting is already set to ${args[2]}`).then().catch(console.error);
					if (args[2] === "toggle") {
						settings[message.guild.id].join = !settings[message.guild.id].join;
						saveSettings(settings);
					} else if (args[2] === "true" || args[2] === "yes") {
						if (settings[message.guild.id].join === true) {
							return message.channel.send(currSetting).then().catch(console.error);
						} else {
							settings[message.guild.id].join = !settings[message.guild.id].join;
							saveSettings(settings);
							message.channel.send(succEmbed).then().catch(console.error);
						}
					} else if (args[2] === "false" || args[2] === "no") {

						if (settings[message.guild.id].join === false) {
							return message.channel.send(currSetting);
						} else {
							settings[message.guild.id].join = !settings[message.guild.id].join;
							saveSettings(settings);
							message.channel.send(succEmbed).then().catch(console.error);
						}
					} else {
						return message.channel.send(new Discord.RichEmbed()
							.setTimestamp()
							.setTitle("<:settings:469471662715437056> Guild settings")
							.setColor(red)
							.addField("How did we end up here?!", `The value ${args[2]} can not be applied to this setting.\nPlease user either \`yes\`, \`no\`, \`true\` or \`false\``)).then().catch(console.error);
					}
					break;
				case "farewell":
					if (args.length !== 3) return;
					let currentSetting = new Discord.RichEmbed()
						.setColor(red)
						.setTitle("<:settings:469471662715437056> Guild settings")
						.setTimestamp()
						.addField("Aww man...", `That setting is already set to ${args[2]}`);
					if (args[2] === "toggle") {
						settings[message.guild.id].leave = !settings[message.guild.id].leave;
						saveSettings(settings);
					} else if (args[2] === "true" || args[2] === "yes") {
						if (settings[message.guild.id].leave === true) {
							return message.channel.send(currentSetting).then().catch(console.error);
						} else {
							settings[message.guild.id].leave = !settings[message.guild.id].leave;
							saveSettings(settings);
							message.channel.send(succEmbed).then().catch(console.error);
						}
					} else if (args[2] === "false" || args[2] === "no") {

						if (settings[message.guild.id].leave === false) {
							return message.channel.send(currentSetting).then().catch(console.error);
						} else {
							settings[message.guild.id].leave = !settings[message.guild.id].leave;
							saveSettings(settings);
							message.channel.send(succEmbed).then().catch(console.error);
						}
					} else {
						return message.channel.send(new Discord.RichEmbed()
							.setTimestamp()
							.setTitle("<:settings:469471662715437056> Guild settings")
							.setColor(red)
							.addField("How did we end up here?!", `The value ${args[2]} can not be applied to this setting.\nPlease user either \`yes\`, \`no\`, \`true\` or \`false\``)).then().catch(console.error);
					}
					break;
				case "log-channel":
					if (args.length !== 3) return;
					if (args[2] === "this") {
						let chanID = message.channel.id;
						settings[message.guild.id].log_chan = chanID;
						saveSettings(settings);
						message.channel.send(succEmbed).then().catch(console.error);
					} else if (/\d{18}/.test(args[2])) {
						if (args[2] === undefined) {
							message.channel.send(new Discord.RichEmbed()
								.setColor(red)
								.addField("Oops! Something went wrong...", "The value entered returned as undefined...", true)
								.setTimestamp()
								.setTitle("<:settings:469471662715437056> Guild settings"));
						}
						let chan = message.guild.channels.find("id", args[2]);
						if (chan) {
							let chanID = chan.id;
							console.log(chanID);
							settings[message.guild.id].log_chan = chanID;
							saveSettings(settings);
							message.channel.send(succEmbed).then().catch(console.error);
						} else {
							let undefEmbed = new Discord.RichEmbed()
								.setColor(red)
								.addField("Eh?", "The ID you entered is not a channel in this guild...", true)
								.setTimestamp()
								.setTitle("<:settings:469471662715437056> Guild settings");
							message.channel.send(undefEmbed).then().catch(console.error);
						}
					} else if (message.guild.channels.find("name", args[2])) {
						let chan = message.guild.channels.find("name", args[2]);
						let chanID = chan.id;
						settings[message.guild.id].log_chan = chanID;
						saveSettings(settings);
						message.channel.send(succEmbed).then().catch(console.error);
					} else {
						let undefEmbed = new Discord.RichEmbed()
							.setColor(red)
							.addField("Nope...", "That channel is not part of this server...", true)
							.setTimestamp()
							.setTitle("<:settings:469471662715437056> Guild settings");
						message.channel.send(undefEmbed).then().catch(console.error);
					}
					break;
				case "muted-role":
					if (args.length !== 3) return;
					if (/<@&\d{18}>/.test(args[2])) {
						let id = args[2].match(/\d{18}/);
						console.log(id[0]);
						let role = message.guild.roles.find("id", id[0]);
						settings[message.guild.id].muted_role = role.id;
						saveSettings(settings);
						message.channel.send(succEmbed).then().catch(console.error);
					}
					break;
				case "join-message":
					let joinMsg = message.content.split(" ").slice(2).join(" ");
					settings[message.guild.id].join_text = joinMsg;
					saveSettings(settings);
					message.channel.send(succEmbed).then().catch(console.error);
					break;
				case "leave-message":
					let leaveMsg = message.content.split(" ").slice(2).join(" ");
					settings[message.guild.id].leave_text = leaveMsg;
					saveSettings(settings);
					message.channel.send(succEmbed).then().catch(console.error);
					break;
				case "prefix":
					if (args.length !== 3) return;
					settings[message.guild.id].prefix = args[2];
					saveSettings(settings);
					message.channel.send(succEmbed).then().catch(console.error);
					break;
				default:
					return message.channel.send(new Discord.RichEmbed()
						.setColor(red)
						.setTitle("<:settings:469471662715437056> Guild settings")
						.setTimestamp()
						.addField("Oh noes!", `The property ${args[1]} is not a setting!`)).then().catch(console.error);
			}
		}
	}
};

function checkAndSendOption(message, option) {
	let map = new Map();
	map.set('prefix', settings[message.guild.id].prefix);
	map.set('greeting', settings[message.guild.id].join);
	map.set('farewell', settings[message.guild.id].leave);
	map.set('join-channel', settings[message.guild.id].join_chan);
	map.set('leave-channel', settings[message.guild.id].leave_chan);
	map.set('join-message', settings[message.guild.id].join_text);
	map.set('leave-message', settings[message.guild.id].leave_text);
	map.set('log-channel', settings[message.guild.id].log_chan);
	map.set('muted-role', settings[message.guild.id].muted_role);

	if (map.get(option) !== undefined) {
		let goodSett = new Discord.RichEmbed()
			.setColor(green)
			.setTitle("<:settings:469471662715437056> Guild settings")
			.setTimestamp()
			.addField(`${option} has the following value:`, `\`${map.get(option)}\``);
		return message.channel.send(goodSett).then().catch(console.error);
	} else {
		return message.channel.send(new Discord.RichEmbed()
			.setColor(red)
			.setTimestamp()
			.setTitle("<:settings:469471662715437056> Guild settings")
			.addField(`${option} did not have a value...`, "Make sure you have typed the name correct!")
		).then().catch(console.error);
	}
}

function saveSettings(dataset) {
	fs.writeFile("serversettings.json", JSON.stringify(dataset, null, 2), function (err) {
		if (err) {
			let undefEmbed = new Discord.RichEmbed()
				.setColor(red)
				.addField("Oops! Something went wrong...", "An error occoured while trying to modify the configuration file...", true)
				.setTimestamp()
				.setTitle("<:settings:469471662715437056> Guild settings");
			message.channel.send(undefEmbed).then().catch(console.error);
			console.log(err);
		}
	});
}