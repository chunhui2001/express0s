
const SERVER_NAME: string = process.env.SERVER_NAME || 'ExpressServer';

export class Response extends Error {
  
  static errorResponse (errCode: number, errorMesage: string) {
    return { code: errCode, message: errorMesage, app: SERVER_NAME }
  }

}
