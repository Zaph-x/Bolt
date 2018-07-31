const client = require("../app");
const Discord = require("discord.js");
const config = require("../config.json");

const exec = require("child_process").exec;

let green = [120, 193, 82];

module.exports.run = async (message) => {

	if (config.ownerID === message.author.id) {

		let embed = new Discord.RichEmbed().setColor(green).setDescription("Bot restarting...");
		console.log("\n \n \n \n\t\t\t\t\t\tBOT RESTARTING\n \n \n ")
		await message.channel.send(embed);
		client.destroy();
		process.exit(0);
		


	}


}