
module.exports.run = async message => {
	if (message.member.hasPermission("MANAGE_MESSAGES")) {
		message.delete(5);
		let args = message.content.split(" ").slice(1);
		message.channel.send(args.join(" "));
	}
};