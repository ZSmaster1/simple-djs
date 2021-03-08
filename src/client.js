const discord = require('discord.js');
const logger = require('./logger');

class Client {
    /**
     * @param { String } token 
     */
    constructor(token) {
        this.log = new logger();
        this.client = new discord.Client({
            partials: [
                "MESSAGE",
                "CHANNEL",
                "REACTION",
            ] 
        });

        this.client.on('disconnect', () => {
            this.log.warn(`${this.client.user.username} disconnected`);
        })

        this.client.on('ready', () => {
            this.log.info(`${this.client.user.tag} is online and ready to go!`);
        })

        this.client.login(token).catch((err) => {
            if(err) {
                this.log.error(err);
            }
        })

        return this.client;
    }
}

module.exports = Client;