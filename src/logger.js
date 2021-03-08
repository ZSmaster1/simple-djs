const { log } = require('mustang-log');

class Logger {
    constructor() {
        return this;
    }

    /**
     * @param { String } error 
     */
    error(error) {
        log(error, 'ERROR');
        process.exit();
    }

    /**
     * @param { String } warning
     */
    warn(warning) {
        log(warning, 'WARN');
    }

    /**
     * @param { String } information
     */
    info(information) {
        log(information, 'INFO');
    }

    /**
     * @param { String } verbose 
     */

    verbose(verbose) {
        log(verbose, 'VERBOSE');
    }
}

module.exports = Logger;