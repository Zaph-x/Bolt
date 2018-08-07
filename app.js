// Load libraries //////////////
const discord = require("discord.js");
const fs = require("fs");

// Set up discord client //////
const client = new discord.Client();
module.exports = client;

// Load json //////////////////
const config = require("./config.json");

// Load server settings ///////
let data = fs.readFileSync("./serversettings.json");
let settings = JSON.parse(data.toString());


// Load commands //////////////
const cmdDir = require("./commands/commands.json");
const cmd = cmdDir.commands;
let commandArr = [];
let commands = [];

for (var i = 0; i < cmd.length; i++) {
	commandArr[i] = require(`./commands/${cmd[i].name}.js`);
	commands[i] = `${cmd[i].name}`;
	console.log(`Command ${cmd[i].name} loaded!`);
}

// Load events ////////////////

const eventDir = require("./messageEvents/events.json");
const eventName = eventDir.events;
let events = [];
for (let i = 0; i < eventName.length; i++) {
	events[i] = require(`./messageEvents/${eventName[i].name}.js`);
	console.log(`Event ${eventName[i].name} loaded!`);
}


// Initialise colours /////////

let red = [242, 56, 79];
let green = [120, 193, 82];

// Set Constants //////////////

let deleteEmoji;


client.on("ready", () => {
	// Let console know we are ready and running
	console.log(`Client has started with ${client.users.size} users, in ${client.guilds.size} guilds`);
	client.user.setPresence({ game: { name: "over you!", type: 3 } });
	deleteEmoji = client.guilds.find("id", "403264935745814560").emojis.find("name", "delete");
});

client.on("guildCreate", async (guild) => {
	let id = guild.id;
	// Check if guild is in the settings file
	if (settings[guild.id] !== undefined) {
		// Do nothing
		console.log(`Guild ${guild.name} is already present in settings. Defualting to saved settings.`);
	} else {
		// Create config entry for the bot
		console.log(`Guild not existing in settings. Creating an entry for ${guild.name}`);

		// create muted
		let muted;
		if (guild.roles.find("name", "muted" || "Muted")) {
			// Assign muted to role if existing
			muted = guild.roles.find("name", "muted" || "Muted").id;
		} else {
			// Else assign 0 value
			muted = "0";
		}

		// create log
		let log;
		if (guild.channels.find("name", "log")) {
			// Assign log to channel if existing
			muted = guild.channels.find("name", "log").id;
		} else {
			// Else assign 0 value
			muted = "0";
		}

		// Create channel
		let chan;
		if (guild.defaultChannel === undefined) {
			// If channel is undefined assing a 0 value to it
			chan = "0";
		} else {
			// Else
			chan = guild.defaultChannel.id;
		}

		// Save all new settings for the joined guild.
		settings[id] = {};
		settings[id].prefix = "$";
		settings[id].join = false;
		settings[id].leave = false;
		settings[id].join_chan = chan;
		settings[id].leave_chan = chan;
		settings[id].join_text = `Welcome <@> to ${guild.name}`;
		settings[id].leave_text = `<@> has left the guild!`;
		settings[id].log_chan = log;
		settings[id].muted_role = muted;
		saveSettings(settings);
	}
});

client.on("guildMemberAdd", async (member) => {
	if (settings[member.guild.id].join) {
		if (settings[member.guild.id].join_chan !== "0") {
			member.guild.channels.get(settings[member.guild.id].join_chan).send(settings[member.guild.id].join_text.replace(/<@>/, `<@${member.id}>`)).then().catch(console.error);
		}
	}
});

client.on("guildMemberRemove", async member => {
	if (settings[member.guild.id].leave) {
		if (settings[member.guild.id].leave_chan !== "0") {
			member.guild.channels.get(settings[member.guild.id].leave_chan).send(settings[member.guild.id].leave_text.replace(/<@>/, `<@${member.id}>`)).then().catch(console.error);
		}
	}
});

client.on("messageReactionAdd", async (messageReaction, user) => {
	let message = messageReaction.message;
	if (message.author.id === client.user.id) {
		if (!user.bot) {
			if (messageReaction.emoji === deleteEmoji) {
				message.delete();
			}
		}
	}
});

client.on("message", async message => {
	if (message.channel.type === "text") {
		if (message.content.indexOf(settings[message.guild.id].prefix) === 0) {
			const args = message.content.slice(settings[message.guild.id].prefix.length).trim().split(/ +/g);
			const command = args.shift().toLocaleLowerCase();
			if (message.author.bot) {
				return message.channel.send("Bot users can not use commands!").then().catch(console.error);
			}
			let permissions = ["MANAGE_MESSAGES", "MANAGE_ROLES", "ADD_REACTIONS"];
			if (!message.guild.me.hasPermission(permissions) && !config.testGuilds.includes(message.guild.id)) {
				message.channel.send(new discord.RichEmbed()
					.setColor(red)
					.setAuthor(client.user.username, client.user.displayAvatarURL)
					.setTimestamp()
					.addField("I am missing some permissions!", `I need the following permissions to function correctly \`${permissions[0]}\`, \`${permissions[1]}\` and \`${permissions[2]}\`!`));
			}
			for (var i = 0; i < commands.length; i++) {
				if (command === commands[i]) {
					commandArr[i].run(message);
					break;
				}
			}
			didYouMean(commands, command, message);

		} else {
			for (let i = 0; i < events.length; i++) {
				events[i].trigger(message);
			}
		}
	}
});

client.login(config.token);

function didYouMean(arr, search, message) {
	if (!arr.includes(search)) {
		let score = [];
		let lev = 1000;
		let str = [];
		for (let com of arr) {
			if (levenshtein(search, com) <= lev) {
				lev = levenshtein(search, com);
				str.push(com);
			}
		}
		if (str.length > 1) {
			let arr = []
			for (let string of str) {
				arr.push(string.split(""))
			}
			for (let i = 0; i < arr.length; i++) {
				score[i] = 0;
				for (let j = 0; j < arr[i].length; j++) {
					if (search.split("")[j] === arr[i][j]) {
						score[i]++;
					}
				}
			}
			return message.channel.send(new discord.RichEmbed()
				.setTitle(":x: Invalid command!")
				.addField("Did you mean", `\`${settings[message.guild.id].prefix}${str[score.indexOf(Math.max(...score))]}\``))
				.catch(err => console.log(err));

		} else {
			return message.channel.send(new discord.RichEmbed()
				.setTitle(":x: Invalid command!")
				.addField("Did you mean", `\`${settings[message.guild.id].prefix}${str[0]}\``))
				.catch(err => console.log(err));
		}
	}
}

function saveSettings(dataset) {
	fs.writeFile("serversettings.json", JSON.stringify(dataset, null, 2), function (err) {
		if (err) {
			let undefEmbed = new Discord.RichEmbed()
				.setColor(red)
				.addField("Oops! Something went wrong...", "An error occoured while trying to modify the configuration file...", true)
				.setTimestamp()
				.setAuthor(client.user.username, client.user.avatarURL);
			message.channel.send(undefEmbed).then().catch(console.error);
			console.log(err);
		}
	});
}

function levenshtein(a, b) {
	if (a.length === 0) return b.length
	if (b.length === 0) return a.length
	let tmp, i, j, prev, val, row
	if (a.length > b.length) {
		tmp = a
		a = b
		b = tmp
	}

	row = Array(a.length + 1)
	for (i = 0; i <= a.length; i++) {
		row[i] = i
	}

	for (i = 1; i <= b.length; i++) {
		prev = i
		for (j = 1; j <= a.length; j++) {
			if (b[i - 1] === a[j - 1]) {
				val = row[j - 1]
			} else {
				val = Math.min(row[j - 1] + 1,
					Math.min(prev + 1,
						row[j] + 1))
			}
			row[j - 1] = prev
			prev = val
		}
		row[a.length] = prev
	}
	return row[a.length]
}