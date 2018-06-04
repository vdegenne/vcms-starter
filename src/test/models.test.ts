import * as chai from 'chai';
import * as Knex from 'knex';
import {VcmsOptions} from 'vcms/lib/config';
import {getDatabase} from 'vcms/lib/database';
import {displayAllLoggers} from 'vcms/lib/logging';
import {getConfig, resetDatabase as _resetDatabase} from 'vcms/lib/test/util';

import Customer from '../models/Customer';
import Role from '../models/Role';
import User from '../models/User';

const expect = chai.expect;

const defaultConfigFilepath = __dirname + '/../../.vcms.yml';


suite('Models', () => {
  let config: VcmsOptions;
  let database: Knex;


  suiteSetup(async () => {
    config = await getConfig([], null, defaultConfigFilepath);
    database = await getDatabase(config);

    await resetDatabase();
  });

  suiteTeardown(async () => {
    if (database) {
      await database.destroy();
    }
  });

  async function resetDatabase() {
    let files = ['0.destroy', '1.pre-data', '2.data', '3.post-data'];
    files = files.map(f => `${__dirname}/../../sql/${f}.sql`);
    await _resetDatabase(database, files);
  }


  suite('Users', () => {
    test('Returns snakeoil (test user) with USER role', async () => {
      const user = await User.getByUsername('snakeoil', 'roles');
      expect(user.firstname).to.equal('Snake');
      expect(user.roles.map(r => r.name)).to.deep.equal(['TEST']);
    });
  });


  suite('Roles', () => {
    test(`Returns 'ADMIN', 'USER', and 'TEST' (initial)`, async () => {
      const roles = await Role.query();
      expect(roles.map(r => r.name)).to.deep.equal(['ADMIN', 'USER', 'TEST']);
    });
  });


  suite('Customers', () => {
    test('Returns all initial entries', async () => {
      const locations = await Customer.query();
      expect(locations.length).to.equal(1);
    });

    test('Returns one entry eager favoritePizza', async () => {
      const customer = await Customer.get(1, 'favoritePizza');
      expect(customer.firstname).to.equal('john');
      expect(customer.favoritePizza.name).to.equal('jerrycheese');
    });

    test('Add one entry', async () => {
      await Customer.query().insert({firstname: 'Adi', lastname: 'Bou'});

      const customer = await Customer.getByFirstname('Adi');
      expect(customer.lastname).to.equal('Bou');

      await resetDatabase();
    });

    test('Remove one entry', async () => {
      const deleted = await Customer.query().deleteById(1);
      expect(deleted).to.equal(1);

      await resetDatabase();
    });

    test('Update one entry', async () => {
      let customer = await Customer.get(1);
      expect(customer.firstname).to.equal('john');

      // change and update
      customer.firstname = 'Pika';
      await Customer.query().update(customer).where('id', customer.id);

      customer = await Customer.get(1);
      expect(customer.firstname).to.equal('Pika');
    });
  });
});
