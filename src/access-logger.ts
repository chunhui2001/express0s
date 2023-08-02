import express, { Request, Response } from 'express';

import morgan, { StreamOptions } from 'morgan';
import { Logger } from './winston-logger';

// Custom token format for morgan to log

const logger = Logger(module)

morgan.token('protocol', (req: Request, res: Response): string => {
  return 'HTTP/' + req.httpVersion; // If req.protocol is not available, fallback to req.httpVersion
});

morgan.token('remote-addr', (req: Request, res: Response): string => {

    const xForwardedFor = req.headers['x-forwarded-for'];

    if (Array.isArray(xForwardedFor)) {
        return xForwardedFor[0] || req.connection.remoteAddress || '-';
    } else {
        return xForwardedFor || req.connection.remoteAddress || '-';
    }

});

// # 127.0.0.1 - - [21/Jul/2023 16:50:02] "GET /favicon.ico HTTP/1.1" 304 -
const loggerFormat: string = 'Access :remote-addr ":method :url :protocol" :status :res[content-length]/bytes :response-time/ms';

const stream: StreamOptions = {
    write: (message: string) => logger.info(message.trim())
}

function skipLog(req: express.Request, res: express.Response) {
    let url: string = req.url;
    if (url.indexOf('?') > 0)
        url = url.substr(0, url.indexOf('?'));
    if (url.match(/(js|jpg|png|ico|css|woff|woff2|eot|gif)$/ig)) {
        return true
    }
    return false;
}

export function acceessLogger(): express.RequestHandler {
  return morgan(loggerFormat, { skip: skipLog, stream });
}

