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
        this.isSlashCommand = false || exported.slashCommand;

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

        if(this.isSlashCommand === true) {
            let constructor = {
                data: {
                    name: this.aliases[0],
                    description: exported.description,
                }
            }

            if(exported.arguments) {

                constructor.data.options = [];

                exported.arguments.forEach((argument) => {
                    if(!argument.name) {
                        this.log.error('Argument name missing');
                    }

                    if(!argument.description) {
                        this.log.error('Argument description missing');
                    }

                    if(!argument.type) {
                        this.log.error('Argument type missing');
                    }

                    constructor.data.options.push({
                        name: argument.name,
                        description: argument.description,
                        type: argument.type,
                        required: argument.required || true,
                    })
                })
            }

            client.api.applications(client.user.id).commands.post(constructor).then(() => {
                this.log.verbose(`Slash Command registered: /${constructor.data.name}`);
            }).catch((err) => {
                this.log.warn(`Error registering Slash Command /${constructor.data.name} because ${err}`);
            })
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