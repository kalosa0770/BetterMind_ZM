const winston = require('winston');
const { stack } = require('../routes/auth');
require('winston-daily-rotate-file');
const {combine, timestamp, json, errors} = winston.format;

const fileTransport = new winston.transports.DailyRotateFile({
    filename: 'logs/%DATE%-combined.log',
    datePattern: 'DD-MM-YYYY',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
});

const errorFileTransport = new winston.transports.DailyRotateFile({
    filename: 'logs/%DATE%-error.log',
    datePattern: 'DD-MM-YYYY',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '30d',
    level: 'error',

});

const logger = winston.createLogger({
    level: 'info',
    format: combine(
        errors({ stack: true }),
        timestamp(),
        json()
    ),
    transports: [
        new winston.transports.Console(),
        fileTransport,
        errorFileTransport,
    ],
});

module.exports = logger;