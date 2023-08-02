import express from 'express';

export abstract class CommonRoutesConfig {
    app: express.Application;
    name: string;
    appRoot: string;
    constructor(appRoot: string, app: express.Application, name: string) {
        this.app = app;
        this.name = name;
        this.appRoot = appRoot;
        this.configureRoutes();
    }
    getName() {
        return this.name;
    }
    getRoot() {
        return this.appRoot;
    }
    abstract configureRoutes(): express.Application;
}
