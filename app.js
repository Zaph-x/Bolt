// Load library ///////////////
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

///////////////////////////////


client.on("ready", () => {
	// Let console know we are ready and running
	console.log(`Client has started with ${client.users.size} users, in ${client.guilds.size} guilds`);
	client.user.setPresence({game: {name: "over you!", type: 3}});
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

client.on("guildMemberAdd", (member) => {
	if (settings[member.guild.id].join) {
		if (settings[member.guild.id].join_chan !== "0") {
			member.guild.channels.find("id", settings[member.guild.id].join_chan).send(settings[member.guild.id].join_text.replace(/<@>/, `<@${member.id}>`)).then().catch(console.error);
		}
	}
});

client.on("guildMemberRemove", member => {
	if (settings[member.guild.id].leave) {
		if (settings[member.guild.id].leave_chan !== "0") {
			member.guild.channels.find("id", settings[member.guild.id].leave_chan).send(settings[member.guild.id].leave_text.replace(/<@>/, `<@${member.id}>`)).then().catch(console.error);
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
			message.channel.send(new discord.RichEmbed().setColor(red).setAuthor(client.user.username, client.user.displayAvatarURL).setTimestamp().addField("I am missing some permissions!", `I need the following permissions to function correctly \`${permissions[0]}\`, \`${permissions[1]}\` and \`${permissions[2]}\`!`));
		}


		for (var i = 0; i < commands.length; i++) {
			if (command === commands[i]) {
				commandArr[i].run(message);
				break;
			}
		}
		if (command === "eval") {
			let guild = message.guild, user = message.author, channel = message.channel;


			if (message.author.id !== config.ownerID) return;
			try {
				const code = args.join(" ");
				let evaled = eval(code);

				if (typeof evaled !== "string")
					evaled = require("util").inspect(evaled);
				let evalEmbed = new discord.RichEmbed().setColor(green).setAuthor("Evaluation successful").setTimestamp().addField("With result:", `\`\`\`js\n${clean(evaled)}\`\`\``);
				message.channel.send(evalEmbed).then().catch();
			} catch (err) {
				let errEmbed = new discord.RichEmbed().setColor(red).setAuthor("Evaluation failed").setTimestamp().addField("With error:", `\`\`\`js\n${err}\`\`\``);
				message.channel.send(errEmbed).then().catch();
			}
			return;
		} 
		if (!commands.includes(command)) {
			message.channel.send(":x: Invalid command!").then().catch();
			return;
		}	
	} else {
		for (let i = 0; i < events.length; i++) {
			events[i].trigger(message);
		}
	}
}
});

client.login(config.token);
function clean(text) {
	if (typeof text === "string")
		return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
	else
		return text;
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