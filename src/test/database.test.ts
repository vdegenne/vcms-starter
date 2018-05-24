import * as chai from 'chai';
import * as ChaiAsPromised from 'chai-as-promised';

import * as Knex from 'knex';
import {VcmsOptions} from 'vcms/lib/config';
import {getDatabase} from 'vcms/lib/database';
import {displayAllLoggers} from 'vcms/lib/logging'
import {getConfig} from 'vcms/lib/test/util';

chai.use(ChaiAsPromised);
const expect = chai.expect;

const defaultConfigFilepath: string = __dirname + '/../../test/.vcms-db.yml';


suite('Database', () => {
  let config: VcmsOptions;
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

  test('gives us a decent connection', async () => {
    return expect(database).to.be.ok;
  });
});
