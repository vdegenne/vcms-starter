import * as chai from 'chai';
import * as ChaiAsPromised from 'chai-as-promised';

import * as Knex from 'knex';
import {VcmsOptions} from 'vcms/lib/config';
import {getDatabase} from 'vcms/lib/database';
import {displayAllLoggers} from 'vcms/lib/logging'
import {getConfig} from 'vcms/lib/test/util';

chai.use(ChaiAsPromised);
const expect = chai.expect;

const defaultConfigScriptPath: string = __dirname + '/../startupconfig.js';


/* use the following code to cleanup the database */
/* beforeEach((done) => {
  const sql = ['destructure', 'structure', 'data']
                  .map(f =>
read(`${__dirname}/../../sql/${f}.sql`).toString()) .join('');

  database.raw(sql).then(() => done()).catch(err => done(err));
}); */

suite('Database', () => {
  let config: VcmsOptions;
  let database: Knex;

  const debug = () => {
    displayAllLoggers();
  };


  suiteSetup(async () => {
    // this will get executed before all, then all the suites inside this suite
    // run
    config = await getConfig([], defaultConfigScriptPath);
    // database = await getDatabase(config);
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



  test('gives us a decent connection', async () => {
    database = await getDatabase(config);
    return expect(database).to.be.ok;
  });
});
