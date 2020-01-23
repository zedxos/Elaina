const { RichEmbed } = require('discord.js');
const { stripIndents } = require("common-tags");
const { Colors } = require('../../utils/settings');
const moment = require('moment');

module.exports = {
    config: {
        name: 'ban',
        aliases: ['fban', 'remove'],
        category: 'moderation',
        description: 'Bans the mentioned user.',
        usage: '<user> <reason>',
        example: '@Ryevi Break the rules',
        accessableby: 'Moderators'
    },
    run: async (bot, message, args) => {
        if (message.deletable) {
            message.delete()
        };
        
        if(!message.member.hasPermission(['BAN_MEMBERS', 'ADMINISTRATOR'])) 
            return message.channel.send('You do not have permission to perform this command!');

        let banMember = message.mentions.members.first() || message.guild.members.get(args[0]);
        if(!banMember) return message.channel.send('Please provide a user to ban!');
    
        let reason = args.slice(1).join(' ');
        if(!reason) reason = 'You must specify a reason for the ban!';
    
        if(!message.guild.me.hasPermission(['BAN_MEMBERS', 'ADMINISTRATOR'])) 
            return message.channel.send('I dont have permission to perform this command!');
    
        banMember.send(`Hello, you have been banned from **${message.guild.name}** for: ${reason}`).then(() => 
        message.guild.ban(banMember, { days: 1, reason: reason})).catch(err => console.log(err));
    
        message.channel.send(`${banMember.user.tag} has been banned`).then(m => m.delete(5000));
    
        let embed = new RichEmbed()
            .setColor(Colors.RED)
            .setAuthor('Banned Member', banMember.user.displayAvatarURL)
            .setDescription(stripIndents`**Banned By:** ${message.author.tag} (${message.author.id})
            **Banned User:** ${banMember.user.tag} (${banMember.user.id})
            **Reason:** ${reason}
            **Date & Time:** ${moment(message.createdAt).format('ddd, MMMM DD, YYYY HH:mm')}`)
            .setFooter(message.guild.me.displayName, bot.user.displayAvatarURL)
            .setTimestamp();
    
        let sChannel = message.guild.channels.find(c => c.name === 'incident-log');
        sChannel.send(embed);
    }
}