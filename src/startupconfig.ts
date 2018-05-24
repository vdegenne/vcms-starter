import {Routers, StartupConfig} from 'vcms';

import {customersRouter} from './routers/customers.router';
import {userRouter} from './routers/user.router';

let startupConfig: StartupConfig = {};

startupConfig.configFilepath = __dirname + '/../.vcms.yml';

startupConfig.routers = {
  '/api/user': userRouter,
  '/api/customers': customersRouter
};


startupConfig.initSessionFunction = (session) => {
  if (!session.user) {
    session.user = {name: 'guest', roles: ['GUEST']}
  }
  // tip: it's good to get the last information of the user
  // If the user object exists, we should fetch new information
  // and update here.
};


export default startupConfig;
