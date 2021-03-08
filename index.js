const client = require('./src/client');
const logger = require('./src/logger');

class Main {

    /**
     * @param { String } token Your bots token
     * @param { Object } configuration The configuration
     */
    constructor(token) {
        this.log = new logger();

        if(!token) {
            this.log.error('No token specified');
        }

        if(typeof token !== 'string') {
            this.log.error('Token must be a string');
        }

        this.client = new client(token);
        this.DMs = false;
        this.guilds = true;
        this.commandsDir = 'commands';

        return this;
    }


    /**
     * @param { Boolean } true_or_false 
     */
    allowsDMs(true_or_false) {
        if(typeof true_or_false !== 'boolean') {
            this.log.warn('true_or_false must be true or false');
            return;
        }

        this.DMs = true_or_false;

        return this;
    }

    /**
     * @param { Boolean } true_or_false 
     */
    allowGuilds(true_or_false) {
        if(typeof true_or_false !== 'boolean') {
            this.log.warn('true_or_false must be true or false');
            return;
        }

        this.guilds = true_or_false;

        return this;
    }

    /**
     * @param { String } commandsDir 
     */
    setCommandsDir(commandsDir) {
        if(typeof commandsDir !== 'string') {
            this.log.warn('commandsDir must be a string');
            return;
        }

        this.commandsDir = commandsDir;

        return this;
    }

    load() {
        
    }
}

module.exports = Main;