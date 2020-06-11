module.exports = class {

	constructor(client) {
		this.client = client;
	}

	async run(message) {
		const mentionRegex = RegExp(`^<@!?${this.client.user.id}>$`);
		const mentionRegexPrefix = RegExp(`^<@!?${this.client.user.id}> `);

		if (message.author.bot) return;

		if (message.content.match(mentionRegex)) {
			this.client.embed.generals('', message, `My prefix for **${message.guild.name}** is \`${this.client.PREFIX}\`.`);
		}

		const prefix = message.content.match(mentionRegexPrefix) ? message.content.match(mentionRegexPrefix)[0] : this.client.PREFIX;

		if (!message.content.startsWith(prefix)) return;

		const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);

		const command = this.client.commands.get(cmd.toLowerCase()) || this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()));
		if (!command) {
			return;
		}

		if (command.guildOnly && !message.guild) {
			message.channel.send('This command is only available on a server!');
			return;
		}

		try {
			command.run(message, args);
		} catch (err) {
			console.log(err);
			message.channel.send('An error has occurred, please try again in a few minutes.');
			return;
		}
	}

};