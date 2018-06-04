import * as chai from 'chai';
import * as ChaiAsPromised from 'chai-as-promised';

import * as Knex from 'knex';
import {VcmsOptions} from 'vcms/lib/config';
import {getDatabase} from 'vcms/lib/database';
import {displayAllLoggers} from 'vcms/lib/logging'
import {getConfig} from 'vcms/lib/test/util';

chai.use(ChaiAsPromised);
const expect = chai.expect;

const defaultConfigScriptFilepath: string = __dirname + '/../startupconfig.js';


suite('Database', () => {
  let config: VcmsOptions;
  let database: Knex;

  setup(async () => {
    config = await getConfig([], defaultConfigScriptFilepath);
    database = await getDatabase(config);
  });

  teardown(async () => {
    if (database) {
      await database.destroy();
    }
  });

  test('gives us a decent connection', async () => {
    expect(database).to.be.ok;
  });
});
