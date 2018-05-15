import {getConfig, Routers, start, StartupConfig} from 'vcms';

import {exampleRouter} from './routers/example.router';
import {userRouter} from './routers/user.router';

async function run() {
  let startconfig: StartupConfig = {};

  startconfig.routers = {
    '/api/example': exampleRouter,
    '/api/user': userRouter
  };


  // general config
  const config = await getConfig();

  if (config.SESSION_REQUIRED) {
    startconfig.initSessionFunction = async (session) => {
      // define session object for new-comers here
      if (!session.user) {
        session.user = { name: 'guest', roles: ['GUEST'] }
      }
    }
  }

  start(startconfig);
}


run();
