import express from 'express';
import { expect } from 'chai';

import Logger from '../src/winston-logger';

import { CommonRoutesConfig } from '../src/common.routes.config';
import { ErrorHandler } from '../src/error';

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

        return this.app;
    
    }

}