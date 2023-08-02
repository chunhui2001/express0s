import winston from 'winston';
import moment from 'moment-timezone';
import Path from 'path'


// const callsite = require('caller-callsite');

const SERVER_NAME: string = process.env.SERVER_NAME || 'ExpressServer';
const TIME_ZONE: string = process.env.TZ || 'UTC';

const level = () => {
    const env = process.env.NODE_ENV || 'development'
    const isDevelopment = env === 'development'
    return isDevelopment ? 'debug' : 'warn'
}

const formatTimestamp = (timestamp: any) => {
    return moment().tz(TIME_ZONE).format();
};

const customFormat = winston.format.printf(({ timestamp, level, message, ...meta }) => {
    return `${formatTimestamp(timestamp)} [${level.toUpperCase()}] {${meta.caller || '--'}} - ${message}`;
});

const formatConsole = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }),
    winston.format.errors({ stack: true }),
    customFormat
)

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({ format: formatConsole }),
        new winston.transports.File({ format: formatConsole, filename: `/tmp/logs/${SERVER_NAME}/logs.log`, level: level() })
    ],
})

function getCallerInfo(): string {

    const stack = new Error()['stack'] as string;
    const stackLines = stack ? stack.split('\n') : [];
    const callerLine = stackLines.length > 3 ? stackLines[3] : '';

    // const regex1 = /(.+\/)dist\/.+/; // 匹配 dist 前的整个路径，并保存在第一个捕获组
    const regex2 = /(?:\/?[\w.-]+\/)?([\w.-]+):(\d+):(\d+)/;

    const match2 = callerLine.match(regex2);
    
    if (match2) {
        const len = 32;
        const fileName2 = match2[1];
        const lineNumber2 = match2[2];
        const columnNumber2 = match2[3];
        const caller = `${fileName2}:${lineNumber2}:${columnNumber2}`;
        const callerString = caller.length > len ? '..' + caller.substr(0, len) : caller.padStart(len, '.');
        return `express0s::${callerString}`;
    }

    return "";

}

export class CreateLogger {

    _module: any;
    logger: any;

    static get(mod: any): CreateLogger {
        return new CreateLogger(mod);
    }

    constructor(mod: any) {
        this._module = mod;
        this.logger = Logger(this._module);
    }

    info(message: string, ...args: any) {
        const _caller = getCallerInfo();
        // var _filename = Path.basename(this._module.id);
        this.logger.info(message, ...args, { caller: `${_caller}` })
    }

    error(message: string, ...args: any) {
        const _caller = getCallerInfo();
        // var _filename = Path.basename(this._module.id);
        this.logger.error(message, ...args, { caller: `${_caller}` })
    }

}

export function Logger(module: any): any {
    return logger;
}