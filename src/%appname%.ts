import {Routers, start} from 'vcms';

import {exampleRouter} from './routers/example.router';


const routers: Routers = {
  '/example': exampleRouter
};


start({routers: routers});
