import {Routers, StartupConfig} from 'vcms';

import {exampleRouter} from './routers/example.router';
import {userRouter} from './routers/user.router';

let startupConfig: StartupConfig = {};

startupConfig.configFilepath = __dirname + '/../.vcms.yml';

startupConfig.routers = {
  '/api/example': exampleRouter,
  '/api/user': userRouter
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
