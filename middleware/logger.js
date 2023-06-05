const { format } = require('date-fns');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const logEvents = async (message, logFileName) => {
    const dateTime = format(new Date(), 'yyyyMMdd\tHH:mm:ss');
    const logItem = `${dateTime}\t${uuidv4()}\t${message}\n`;
    const logPath = path.join(__dirname, '..', 'logs');
    try {
        // Checks to see if 'logs' folder exists, and creates if it doesn't.
        // As dev logs are gitignored this should always result in the creation of a logs folder on the first run
        if (!fs.existsSync(logPath)) {
            await fsPromises.mkdir(logPath);
        }

        await fsPromises.appendFile(path.join(logPath, logFileName), logItem);
    } catch (error) {
        console.log(error);
    }
}

const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog.log');
    console.log(`${req.method} ${req.path}`);
    next();
}

module.exports = { logEvents, logger }