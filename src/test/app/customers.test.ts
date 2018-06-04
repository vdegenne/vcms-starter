import * as chai from 'chai';
import * as ChaiAsPromised from 'chai-as-promised';
import * as supertest from 'supertest';
import {getApp} from 'vcms/lib/app';
import {VcmsOptions} from 'vcms/lib/config';
import {getDatabase} from 'vcms/lib/database';
import {displayAllLoggers} from 'vcms/lib/logging'
import {destroyStructure, getStructure, Structure} from 'vcms/lib/server';
import {accessAsAdmin, getConfig, resetDatabase as _resetDatabase} from 'vcms/lib/test/util';

import Customer from '../../models/Customer';


chai.use(ChaiAsPromised);
const expect = chai.expect;

const defaultConfigScriptPath: string = __dirname + '/../../startupconfig.js';


suite('App', () => {
  let config: VcmsOptions;
  let struct: Structure;

  suiteSetup(async () => {
    config = await getConfig([], defaultConfigScriptPath);
    struct = await getStructure(config);
    await resetDatabase();
    await destroyStructure(struct);
  });


  setup(async () => {
    config = await getConfig([], defaultConfigScriptPath);
    struct = await getStructure(config);
  });


  teardown(async () => {
    if (struct) {
      await destroyStructure(struct);
    }
  });

  async function resetDatabase() {
    if (struct.database) {
      let files = ['0.destroy', '1.pre-data', '2.data', '3.post-data'];
      files = files.map(f => `${__dirname}/../../../sql/${f}.sql`);
      await _resetDatabase(struct.database, files);
    }
  }

  suite('Customers', () => {
    suite('Authorization', () => {
      test('GET "/api/customers" Needs Authorization', async () => {
        await supertest(struct.app).get('/api/customers').expect(401);
      });
      test('POST "/api/customers" Needs Authorization', async () => {
        await supertest(struct.app).post('/api/customers').send().expect(401);
      });
      test(`PUT "/api/customers/:customerId" Needs Authorization`, async () => {
        await supertest(struct.app).put('/api/customers/1').expect(401);
      });
      test(`DELETE "/api/customers/:customerId" Needs Authorization`, async () => {
        await supertest(struct.app).delete('/api/customers/1').expect(401);
      });
    });

    suite('GET', () => {
      test(`GET "/api/customers" returns all the initial customers`, async () => {
        struct = await accessAsAdmin(struct);

        let response;
        let data;

        response = await supertest(struct.app).get('/api/customers').expect(200);
        data = JSON.parse(response.text);
        expect(data.success).to.be.ok;
        expect(data.customers.length).to.equal(1);  // equal 1 tho
      });


      test('GET "/api/customers/:customer" works with integer', async () => {
        struct = await accessAsAdmin(struct);

        const req = await supertest(struct.app).get('/api/customers/1').expect(200);
        const res = JSON.parse(req.text);
        expect(res.customer).not.to.be.undefined;
        expect(res.customer.firstname).to.equal('john');
      });

      test('GET "/api/customers/:customer" works with string', async () => {
        struct = await accessAsAdmin(struct);

        const req = await supertest(struct.app).get(`/api/customers/john`).expect(200);

        const res = JSON.parse(req.text);
        expect(res.customer).not.to.be.undefined;
        expect(res.customer.lastname).to.equal('snow');
      });

      test(`GET "/api/customers/1000" returns 404 (Data doesn't exist)`, async () => {
        await resetDatabase();
        struct = await accessAsAdmin(struct);
        await supertest(struct.app).get('/api/customers/1000').expect(404);
      });
    });

    suite('POST', () => {
      test('POST "/api/customers" without arguments returns 400', async () => {
        struct = await accessAsAdmin(struct);

        let response;

        response = await supertest(struct.app)
                       .post('/api/customers')
                       .send()  // sends nothing
                       .expect(400);

        const res = JSON.parse(response.text);
        expect(res.success).not.to.be.ok;
        expect(res.message).to.contain('Bad Arguments');
      });

      test(`POST "/api/customers" adds the object in the database`, async () => {
        struct = await accessAsAdmin(struct);

        let response;

        response = await supertest(struct.app).get('/api/customers').expect(200);
        expect(JSON.parse(response.text).customers.length).to.equal(1);

        await supertest(struct.app)
            .post('/api/customers')
            .send({
              firstname: 'John',
              lastname: 'Doe',
            })
            .expect(200);

        response = await supertest(struct.app).get('/api/customers').expect(200);
        expect(JSON.parse(response.text).customers.length).to.equal(2);

        await resetDatabase();
      });


      test(`POST "/api/customers" fails trying to post the same customer`, async () => {
        struct = await accessAsAdmin(struct);

        let response;
        let data;

        await supertest(struct.app)
            .post('/api/customers')
            .send({firstname: 'John', lastname: 'Doe'})
            .expect(200);

        response = await supertest(struct.app)
                       .post('/api/customers')
                       .send({firstname: 'John', lastname: 'Doe'})
                       .expect(200);

        data = JSON.parse(response.text);
        expect(data.success).not.to.be.ok;
        expect(data.message).to.contains('already exist');

        await resetDatabase();
      });
    });

    suite('PUT', () => {
      test(`PUT "/api/customers/:customerId" with "customerId" as a "string" returns 400`, async () => {
        struct = await accessAsAdmin(struct);
        await supertest(struct.app).put('/api/customers/hello').expect(400);
      });

      test(`PUT "/api/customers/:customerId" refuses empty body`, async () => {
        struct = await accessAsAdmin(struct);
        await supertest(struct.app).put('/api/customers/1').send({}).expect(400);
      });


      test(`PUT "/api/customers/1000" returns 404 (Data doesn't exist)`, async () => {
        await resetDatabase();
        struct = await accessAsAdmin(struct);

        const response =
            await supertest(struct.app).put('/api/customers/1000').send({firstname: ''}).expect(404);
      });

      test(`PUT "/api/customers/1" updates the object in the database`, async () => {
        struct = await accessAsAdmin(struct);

        let response;

        response = await supertest(struct.app).put('/api/customers/1').send({firstname: 'Jack'}).expect(200);
        expect(JSON.parse(response.text).customer.firstname).to.equal('Jack');

        response = await supertest(struct.app).get('/api/customers/1').expect(200);
        expect(JSON.parse(response.text).customer.firstname).to.equal('Jack');

        await resetDatabase();
      });
    });

    suite('DELETE', () => {
      test(`DELETE "/api/customers/:customerId" with "customerId" as a "string" returns 400`, async () => {
        struct = await accessAsAdmin(struct);
        await supertest(struct.app).delete('/api/customers/hello').expect(400);
      });

      test(`DELETE "/api/customers/1000" returns 404 (Data doesn't exist)`, async () => {
        struct = await accessAsAdmin(struct);
        await supertest(struct.app).delete('/api/customers/1000').expect(404);
      });

      test(`DELETE "/api/customers/1" removes the object in the database`, async () => {
        struct = await accessAsAdmin(struct);

        let response;

        // 1. only one customer
        response = await supertest(struct.app).get('/api/customers').expect(200);
        expect(JSON.parse(response.text).customers.length).to.equal(1);

        // 2. remove the only customer
        await supertest(struct.app).delete('/api/customers/1').expect(200);

        // 3. no customer anymore
        response = await supertest(struct.app).get('/api/customers');
        expect(JSON.parse(response.text).customers.length).to.equal(0);

        await resetDatabase();
      });
    });
  });
});
