const Client = require('./src/client');
const Logger = require('./src/logger');
const Command = require('./src/command');
const fs = require('fs');
const path = require('path');

class Main {

    /**
     * @param { String } token Your bots token
     * @param { String } defaultPrefix Your bots default prefix
     */
    constructor(token) {
        this.log = new Logger();

        if(!token) {
            this.log.error('No token specified');
        }

        if(typeof token !== 'string') {
            this.log.error('Token must be a string');
        }

        this.client = new Client(token);
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

    setDefaultPrefix(prefix) {

        if(typeof prefix !== 'string') {
            this.log.error('Default prefix must be a string');
        }

        this.defaultPrefix = prefix;

        return this;
    }

    load() {

        if(!fs.existsSync(`./${this.commandsDir}`)) {
            this.log.error(`./${this.commandsDir} doesen't exist!`);
        }

        const readCommands = (dir) => {
            const files = fs.readdirSync(path.join(__dirname, dir));
            for(const file of files) {
                const stat = fs.lstatSync(path.join(__dirname, dir, file));
                if(stat.isDirectory()) {
                    readCommands(path.join(dir, file));
                } else {
                    const commandPath = path.join(dir, file);
                    const exportedCommand = require(`./${commandPath}`);
                    new Command(exportedCommand, this.client, this.defaultPrefix);
                }
            }    
        }

        readCommands(this.commandsDir)

        return this;
    }
}

module.exports = Main;