import {start} from 'vcms';
import {Routers} from 'vcms/lib/app';

import exampleRouter from './routers/example.router';


const routers: Routers = {
  '/example': exampleRouter
};


start({routers: routers});
