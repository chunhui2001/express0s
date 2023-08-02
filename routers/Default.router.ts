import express from 'express';
import { expect } from 'chai';

import { Logger } from '../src/winston-logger';

import { CommonRoutesConfig } from '../src/common.routes.config';
import { ErrorHandler } from '../src/error';

const logger = Logger(module)

export class DefaultRouter extends CommonRoutesConfig {
    
    constructor(appRoot: string, app: express.Application) {
        super(appRoot, app, 'DefaultRouter');
    }

    configureRoutes() {

        this.app.route(`/simple`)
            .get((req: express.Request, res: express.Response, next: express.NextFunction) => {
                return res.status(200).json({ 
                    code: 200, message: 'OK', data: 'This is Simple Default page'
                });
            });

        // 示例错误
        this.app.route(`/simple-error`)
            .get((req: express.Request, res: express.Response, next: express.NextFunction) => {
                return next(new ErrorHandler(400, 'This is Simple ERROR page'));
            });

        // 示例参数验证
        this.app.route(`/simple-validate`)
            .get((req: express.Request, res: express.Response, next: express.NextFunction) => {
                expect(false, `validate params simple`).to.be.true;
            });

        // 示例内部异常
        this.app.route(`/simple-exception`)
            .get((req: express.Request, res: express.Response, next: express.NextFunction) => {
                const s: any = {};
                return res.status(200).json({ code: 200, message: 'OK', data: s.data.result });
            });
            
        return this.app;
    
    }

}