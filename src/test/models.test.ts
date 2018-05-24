import * as chai from 'chai';
import * as Knex from 'knex';
import {VcmsWritableOptions} from 'vcms/lib/config';
import {getDatabase} from 'vcms/lib/database';
import {displayAllLoggers} from 'vcms/lib/logging';
import {getConfig} from 'vcms/lib/test/util';

import Role from '../models/Role';
import User, {getUser, getUserByUsername} from '../models/User';

const expect = chai.expect;

const defaultConfigFilepath = __dirname + '/../../.vcms.yml';


suite('Models', () => {
  let config: VcmsWritableOptions;
  let database: Knex;


  setup(async () => {
    // this will get executed before all, then all the suites inside this suite
    // run
    config = await getConfig([], null, defaultConfigFilepath);
    database = await getDatabase(config);
  });


  teardown(async () => {
    if (database) {
      await database.destroy();
    }
  });

  test(`[Users] returns snakeoil (test user) with roles 'TEST'`, async () => {
    const user = await getUserByUsername('snakeoil', 'roles');
    expect(user).to.be.ok;
    return expect(user.roles.map(r => r.name)).to.deep.equal(['TEST']);
  });

  test(
      `[Roles] returns 'ADMIN', 'USER' and 'TEST' (initial data in the table)`,
      async () => {
        const roles = await Role.query();
        expect(roles.map(r => r.name)).to.deep.equal(['ADMIN', 'USER', 'TEST']);
      });
});
