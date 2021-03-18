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
        this.commandsDir = 'commands';

        this.commands = [];

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

    /**
     * @param { String } featuresDir 
     */
    setFeaturesDir(featuresDir) {
        if(typeof featuresDir !== 'string') {
            this.log.warn('featuresDir must be a string');
            return;
        }

        this.featuresDir = featuresDir;

        return this;
    }

    /**
     * @param { String } prefix 
     */
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
                    this.commands.push(exportedCommand);
                }
            }    
        }

        const loadFeatures = (dir) => {
            const files = fs.readdirSync(path.join(__dirname, dir));
            for(const file of files) {
                const stat = fs.lstatSync(path.join(__dirname, dir, file));
                if(stat.isDirectory()) {
                    loadFeatures(path.join(dir, file));
                } else {
                    const featurePath = path.join(dir, file);
                    const feature = require(`./${featurePath}`);
                    if(typeof feature === 'function') {
                        feature(this.client);
                    } else {
                        this.log.error(`Feature must be a function`);
                    }
                }
            }
        }

        if(this.featuresDir) {
            const checkForClient = () => {
                if(this.client.user) {
                    loadFeatures(this.featuresDir);
                } else {
                    setTimeout(() => {
                        checkForClient();
                    }, 250);
                }
            }
            checkForClient();
        }

        readCommands(this.commandsDir);

        this.log.warn(`Slash commands will not work yet because that feature is still in beta stage`);
        
        return this;
    }

    getCommands() {
        return this.commands;
    }
}

module.exports = Main;