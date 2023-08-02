require('dotenv').config({ path: '.env' });

import express from 'express';
import * as http from 'http';
import * as bodyparser from 'body-parser';
import cors from 'cors'
import moment from 'moment-timezone';
const helmet = require("helmet");
const path = require("path");
const fileUpload = require('express-fileupload');
const rewrite = require('express-urlrewrite');
const useragent = require('express-useragent');

import { CreateLogger } from './winston-logger';
import { ErrorHandler } from './error';
import { CommonRoutesConfig } from './common.routes.config'; 
import { Response } from './response';
import { acceessLogger } from './access-logger';

const faviconConfig = require('./favicon.config');
const logger = CreateLogger.get(module)

export function createServer(APP_ROOT_DIR: string, customerRouters: any[], callback: any) {    

    const serverName: string = process.env.SERVER_NAME || 'ExpressServer';
    const serverPort: number = parseInt(String(process.env.SERVER_PORT)) || 3000;

    const mongodbHost: string = process.env.MONGODB_HOST || '';
    const mongodbPort: number = process.env.MONGODB_PORT ? parseInt(String(process.env.MONGODB_PORT)) : 27017;
    const mongodbDbname: string = process.env.MONGODB_DBNAME || 'default_db';

    const app: express.Application = express();
    const server: http.Server = http.createServer(app);
    const router = express.Router({ caseSensitive: app.get('case sensitive routing') }); // 不区分大小写
    const routes: Array<CommonRoutesConfig> = [];

    app.use(router);
    app.use(faviconConfig(APP_ROOT_DIR)); 
    app.use(acceessLogger());
    app.use(bodyparser.text({ limit: '50mb' }));
    app.use(bodyparser.json({ limit: '50mb' }));
    app.use(bodyparser.urlencoded({ extended: true, limit: '50mb' }));

    // enable files upload: 200MB max file(s) size
    app.use(fileUpload({ createParentPath: true, defCharset: 'utf8', limits: { fileSize: 200 * 1024 * 1024 * 1024 } }));
    app.use(cors());
    app.use(useragent.express());

    // 静态文件
    app.use('/RichMedias', express.static(path.join(APP_ROOT_DIR, '..', 'static')));

    // 模版引擎
    app.set('view engine', 'ejs');
    app.set('views', path.join(APP_ROOT_DIR, '..', 'views'));

    router.get('/info', (req: express.Request, res: express.Response) => {
        return res.status(200).send(`Hello, server is alive and kicking.`)
    });

    // put routers
    if (customerRouters) {
        for (const r of customerRouters) {
            routes.push(new r(APP_ROOT_DIR, app));
        }
    }

    app.use((req, res, next) => {
        if(res.status(404)) {
            res.statusMessage = 'Page Not Found';
            return res.status(404).json(Response.errorResponse(404, 'Page Not Found'));
        }
    });

    app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
        ErrorHandler.handle(400, err, res);
    });

    process.on('unhandledRejection', (err: Error) => {
        logger.error(`unhandledRejection: errorName=${err.name}, errorMessage=${err.message}, stack=${err.stack}`);
    });

    server.listen(serverPort, () => {
        
        logger.info(`APP_ROOT_DIR: ${APP_ROOT_DIR}`);
        logger.info(`${serverName} running [${process.env.NODE_ENV || 'development'}] on http://0.0.0.0:${serverPort} at ${moment().format('YYYY-MM-DDTHH:mm:ssZ')}`);
        
        routes.forEach((route: CommonRoutesConfig) => {
            logger.info(`${serverName} Routes configured for ${route.getName()}`);
        });

        if (callback) {
            callback();
        }

    });
}

