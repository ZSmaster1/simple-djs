const Logger = require('./logger');
const { Client } = require('discord.js');

class Command {
    /**
     * @param { Object } exported 
     * @param { Client } client
     * @param { String } prefix
     */
    constructor(exported, client, prefix) {
        this.log = new Logger()
        this.dms = exported.allowDMs || false;
        this.guilds = exported.allowGuilds || true;
        this.aliases = exported.aliases;

        if(!this.aliases) {
            this.log.error('please specify an alias');
        }

        if(typeof this.dms !== 'boolean') {
            this.log.error('allowDMs must be true or false');
        }

        if(typeof this.guilds !== 'boolean') {
            this.log.error('allowGuilds must be true or false');
        }

        if(!exported.execute) {
            this.log.error(`Please add a "execute" function to the export for command ${this.aliases[0]}`);
        }

        if(typeof exported.execute !== 'function') {
            this.log.error(`"execute" must be a function for command ${this.aliases[0]}`);
        }

        if(typeof this.aliases === 'string') {
            this.aliases = [this.aliases];
        }

        client.on('message', (message) => {
            if(message.channel.type === 'dm' && this.dms === false) return;
            if(message.guild && this.guilds === false) return;

            const { content } = message;

            this.aliases.forEach((alias) => {
                const command = `${prefix}${alias}`;
                if(content === command || content.startsWith(command)) {
                    let args = content.split(/ +/);
                    args.shift();
                    exported.execute(client, message, args);
                    this.log.verbose(`running command ${command}`);
                }
            });
        })
    }
}

module.exports = Command;