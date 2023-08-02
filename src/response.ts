
export class Response extends Error {
  
  static errorResponse (errCode: number, errorMesage: string) {
    return { code: errCode, message: errorMesage, app: process.env.SERVER_NAME || 'ExpressServer' }
  }

}
