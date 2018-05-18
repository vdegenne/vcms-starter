import * as chai from 'chai';
import * as Knex from 'knex';

import {getDatabase} from 'vcms/lib/database';
import {displayAllLoggers} from 'vcms/lib/logging';
import {getConfig} from 'vcms/lib/test/util';

import Role from '../models/Role';
import User from '../models/User';

const expect = chai.expect;

const defaultConfigFilepath = __dirname + '/../../.vcms.yml';


suite('Models', () => {
  let database: Knex;

  const debug = () => {
    displayAllLoggers();
  };

  suiteSetup(async () => {
    /**
     * We should get a database to connect with the Models
     */
    // save context
    const originalArgv = process.argv;
    const originalNodeEnv = process.env.NODE_ENV;

    // change context
    process.argv = ['node', 'app'];

    // get config with user-defined option in root .vcms.yml file
    const config = await getConfig([], null, defaultConfigFilepath);

    // get a database instance
    database = await getDatabase(config);

    // restore context
    process.argv = originalArgv;
  });

  suiteTeardown(async () => {
    await database.destroy();
  });

  teardown(() => {
    displayAllLoggers(false);
  });

  let title = `[Users] returns snakeoil (test user) with roles 'TEST'`;
  test(title, async () => {
    const user =
        await User.query().where('username', 'snakeoil').eager('roles');

    expect(user.length).to.equal(1);
    return expect(user[0].roles.map(r => r.name)).to.deep.equal(['TEST']);
  });

  title =
      `[Roles] returns 'ADMIN', 'USER' and 'TEST' (initial data in the table)`;
  test(title, async () => {
    const roles = await Role.query();
    expect(roles.map(r => r.name)).to.deep.equal(['ADMIN', 'USER', 'TEST']);
  });
});
