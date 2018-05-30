import {readFileSync} from 'fs';
import {VcmsOptions} from 'vcms';

import {customersRouter} from './routers/customers.router';
import {userRouter} from './routers/user.router';


export default (config: VcmsOptions) => {
  config.configFilepath = __dirname + '/../.vcms.yml';

  config.routers = {
    '/api/user': userRouter,
    '/api/customers': customersRouter,
    '*': async (req, res) => {
      res.send(await readFileSync('public/index.html').toString());
    }
  };

  config.initSessionFunction = (session) => {
    if (!session.user) {
      session.user = {username: 'guest', logged: false, roles: ['GUEST']}
    }
    // tip: it's good to get the last information of the user
    // If the user object exists, we should fetch new information
    // and update here.
  };

  return config;
}
