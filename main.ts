
import { createServer } from './src/express-starter';
import { DefaultRouter } from './routers/Default.router';

createServer(__dirname, [
    DefaultRouter
], null);
