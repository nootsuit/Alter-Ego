﻿const settings = include('settings.json');

module.exports.config = {
    name: "delete_moderator",
    description: "Deletes multiple messages at once.",
    details: "Deletes multiple messages at once. You can delete up to 100 messages at a time. Only messages "
        + "from the past 2 weeks can be deleted. You can also choose to only delete messages from a certain user. "
        + "Note that if you specify a user and for example, 5 messages, it will not delete that user's last 5 messages. "
        + "Rather, it will search through the past 5 messages, and if any of those 5 messages were sent by "
        + "the given user, they wil be deleted.",
    usage: `${settings.commandPrefix}delete 3\n`
        + `${settings.commandPrefix}delete 100\n`
        + `${settings.commandPrefix}delete @Alter Ego 5\n`
        + `${settings.commandPrefix}delete @MolSno 75`,
    usableBy: "Moderator",
    aliases: ["delete"],
    requiresGame: false
};

module.exports.run = async (bot, game, message, command, args) => {
    if (args.length === 0) {
        message.reply("you need to specify an amount of messages to delete. Usage:");
        message.channel.send(exports.config.usage);
        return;
    }

    const user = message.mentions.users.first();
    const amount = parseInt(args[args.length - 1]);
    if (isNaN(amount)) return message.reply(`invalid amount specified.`);
    if (amount < 1) return message.reply(`at least one message must be deleted.`);
    if (amount > 100) return message.reply(`only 100 messages can be deleted at a time.`);

    message.channel.fetchMessages({
        limit: amount
    }).then((messages) => {
        var size = messages.size;
        if (user) {
            const filterBy = user ? user.id : Client.user.id;
            messages = messages.filter(message => message.author.id === filterBy).array().slice(0, amount);
            size = messages.length;
        }
        message.channel.bulkDelete(messages, true).then(() => {
            message.channel.send(`Deleted ${size} messages.`).then(message => message.delete(3000));
        }).catch(error => console.log(error.stack));
    });

    return;
};