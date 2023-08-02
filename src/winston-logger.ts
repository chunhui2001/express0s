import winston from 'winston';
import moment from 'moment-timezone';
import Path from 'path'


const t: any = winston.transports;
const SERVER_NAME: string = process.env.SERVER_NAME || 'ExpressServer';
const TIME_ZONE: string = process.env.TZ || 'UTC';

const level = () => {
    const env = process.env.NODE_ENV || 'development'
    const isDevelopment = env === 'development'
    return isDevelopment ? 'debug' : 'warn'
}

// Function to format the timestamp with the desired timezone
const formatTimestamp = (timestamp: any) => {
    return moment().tz(TIME_ZONE).format();
};

// export default Logger


export function Logger(module: any): any {

    var filename = Path.basename(module.id);

    // Create a custom log format with timestamp and timezone
    const customFormat = winston.format.printf(({ timestamp, level, message }) => {
        return `${formatTimestamp(timestamp)} [${level.toUpperCase()}] {${filename}} - ${message}`;
    });

    const formatConsole = winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }),
        winston.format.errors({ stack: true }),
        customFormat
    )

    const Logger = winston.createLogger({
        transports: [
            new winston.transports.Console({ format: formatConsole }),
            new winston.transports.File({ format: formatConsole, filename: `/tmp/logs/${SERVER_NAME}/logs.log`, level: level() })
        ],
    })

  return Logger;

}
