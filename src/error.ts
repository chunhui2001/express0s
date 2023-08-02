import express from 'express';
import { AssertionError } from 'chai';

import Logger from './winston-logger';
import { Response } from './response';

const SERVER_NAME: string = process.env.SERVER_NAME || 'ExpressServer';

export class ErrorHandler extends Error {
  
  code: number;
  message: string;
  
  constructor(code: number, error: string | Error) {
    super();
    this.code = code;
    this.message = error instanceof String ? (error as Error).message : String(error);
  }
  
  static handle(errCode: number, err: Error, res: express.Response) {
    if (err instanceof AssertionError) {
      const code = 413;
      const { message } = err;
      return res.status(200).json(Response.errorResponse(code, `Invalid-Params: \`${message.split(':')[0]}\``));
    }
    if (err instanceof ErrorHandler) {
      const { code, message } = err;
      Logger.info(`ErrorHandler: errorCode=${code}, errorMessage=${message}`);
      return res.status(200).json(Response.errorResponse(code, `Process-Failed: \`${message}\``));
    }
    Logger.error(`ErrorHandler: type=${typeof err}, errorCode=${errCode}, errorMessage=${err.message || err.stack?.toString().split('\n')[0]}, stack=${err.stack}`);
    return res.status(500).json(Response.errorResponse(500, `Server-Internal-Error: \`${err.message || err.stack?.toString().split('\n')[0]}\``));
  }

  static errorResponse (errCode: number, errorMesage: string) {
    return { code: errCode, message: errorMesage, app: '${SERVER_NAME}' }
  }

}