const Discord = require("discord.js");
const client = require("../app");
const config = require("../config.json");


module.exports.run = async (message) => {

let red = [242, 56, 79];
let green = [120, 193, 82];
    let guild = message.guild, user = message.author, channel = message.channel;

    let args = message.content.split(" ").slice(1);

    if (message.author.id !== config.ownerID) return;
    try {
        const code = args.join(" ");
        let evaled = eval(code);

        if (typeof evaled !== "string")
            evaled = require("util").inspect(evaled);
        let evalEmbed = new Discord.RichEmbed().setColor(green).setAuthor("Evaluation successful").setTimestamp().addField("With result:", `\`\`\`js\n${clean(evaled)}\`\`\``);
        message.channel.send(evalEmbed).then().catch();
    } catch (err) {
        let errEmbed = new Discord.RichEmbed().setColor(red).setAuthor("Evaluation failed").setTimestamp().addField("With error:", `\`\`\`js\n${err}\`\`\``);
        message.channel.send(errEmbed).then().catch();
    }
    return;
}

function clean(text) {
	if (typeof text === "string")
		return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
	else
		return text;
}