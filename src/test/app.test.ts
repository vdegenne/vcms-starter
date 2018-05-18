import * as chai from 'chai';
import * as ChaiAsPromised from 'chai-as-promised';
import {Application} from 'express';
import * as Knex from 'knex';
import {Response} from 'superagent';
import * as supertest from 'supertest';
import {getApp} from 'vcms/lib/app';
import {VcmsOptions} from 'vcms/lib/config';
import {getDatabase} from 'vcms/lib/database';
import {displayAllLoggers} from 'vcms/lib/logging'
import {getConfig} from 'vcms/lib/test/util';



chai.use(ChaiAsPromised);
const expect = chai.expect;

const defaultConfigScriptPath: string = __dirname + '/../startupconfig.js';


suite('App', () => {
  let config: VcmsOptions;
  let app: Application;
  let database: Knex;

  const debug = () => {
    displayAllLoggers();
  };

  suiteSetup(async () => {
    // this will get executed before all, then all the suites inside this suite
    // run
    config = await getConfig([], defaultConfigScriptPath);
    database = await getDatabase(config);
    app = await getApp(config);
  });


  suiteTeardown(async () => {
    // this will get executed after all the suites inside this suite finish to
    // run
    if (database) {
      await database.destroy();
    }
  });

  teardown(() => {
    displayAllLoggers(false);
  });

  suite('Example', () => {
    let title = `route '/api/example/hello returns "hello world"`;
    test(title, async () => {
      const response = await supertest(app).get('/api/example/hello');
      return expect(response.text).to.equal('hello world');
    });
  });


  suite('User', () => {
    test(`success to login using route '/api/user/login'`, async () => {
      const base64Pass = Buffer.from('password').toString('base64');

      const response = await supertest(app)
                           .post('/api/user/login')
                           .send(`username=snakeoil&password=${base64Pass}`);

      const jsonResp = JSON.parse(response.text);

      expect(jsonResp.success).to.be.true;
      expect(jsonResp.user).to.be.ok;
      const user = jsonResp.user;
      return expect(user.username).to.equal('snakeoil');
    });
  });
});
