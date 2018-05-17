const fs = require('fs');
const Utility = require('../utility/Utility');

class Sanita {
    static get pathLogFile() {
        return Utility.pathJoin(global.appRoot, 'log', 'log.txt');
    }
    static log(...message) {
        var breakLine =
            Utility.getCurrentTime() +
            ' - ' +
            '---------------------------------------------------------------------------------------------------------------------' +
            '\n'
            ;
        var bodyLog =
            Utility.getCurrentTime() +
            ' - ' +
            message.join(' ') +
            '\n'
            ;

        var stream = fs.createWriteStream(this.pathLogFile, { flags: 'a' });
        {
            stream.write(breakLine + bodyLog);
            stream.end();
        }
    }

    static logObject(object) {
        var breakLine =
            Utility.getCurrentTime() +
            ' - ' +
            '---------------------------------------------------------------------------------------------------------------------' +
            '\n'
            ;
        var bodyLog =
            Utility.getCurrentTime() +
            ' - ' +
            JSON.stringify(object) +
            '\n'
            ;

        var stream = fs.createWriteStream(this.pathLogFile, { flags: 'a' });
        {
            stream.write(breakLine + bodyLog);
            stream.end();
        }
    }

    static error(...message) {
        var breakLine =
            Utility.getCurrentTime() +
            ' - ' +
            '---------------------------------------------------------------------------------------------------------------------' +
            '\n'
            ;
        var bodyLog =
            Utility.getCurrentTime() +
            ' - ' +
            message.join(' ') +
            '\n'
            ;
        var stream = fs.createWriteStream(this.pathLogFile, { flags: 'a' });
        {
            stream.write(breakLine + bodyLog);
            stream.end();
        }
    }

    static clearLog() {
        fs.writeFileSync(this.pathLogFile, '');
    }
}

module.exports = Sanita;