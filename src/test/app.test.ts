import * as chai from 'chai';
import * as ChaiAsPromised from 'chai-as-promised';
import * as supertest from 'supertest';
import {getApp} from 'vcms/lib/app';
import {VcmsOptions} from 'vcms/lib/config';
import {getDatabase} from 'vcms/lib/database';
import {displayAllLoggers} from 'vcms/lib/logging'
import {destroyStructure, getStructure, Structure} from 'vcms/lib/server';
import {getConfig} from 'vcms/lib/test/util';

import Customer from '../models/Customer';

import {resetDatabase} from './util';


chai.use(ChaiAsPromised);
const expect = chai.expect;

const defaultConfigScriptPath: string = __dirname + '/../startupconfig.js';


suite('App', () => {
  let config: VcmsOptions;
  let struct: Structure;

  setup(async () => {
    // this will get executed before each test
    // you can control the structure modifying the config object
    // and passing the object in the `getStructure` again.
    // important: if you call `getStructure` again in a test,
    // you have to call `destroyStructure` first to gracefull shut
    // all the different connections in the structure (session, database, ...)
    config = await getConfig([], defaultConfigScriptPath);
    struct = await getStructure(config);
  });


  teardown(async () => {
    if (struct.database) {
      await resetDatabase(struct.database);
    }
    await destroyStructure(struct);
  });


  async function grantAccess() {
    config.middlewares = [(req, res, next) => {
      req.session.user.logged = true;
      req.session.user.roles = ['ADMIN'];
      next();
    }];

    // closing connections before making a new structure
    await destroyStructure(struct);
    struct = await getStructure(config);
  }


  suite('Customers', () => {
    suite('GET', () => {
      test(`GET "/api/customers" needs Authorization`, async () => {
        await supertest(struct.app).get('/api/customers').expect(401);
      });

      test(
          `GET "/api/customers" returns all the initial customers`,
          async () => {
            await grantAccess();

            const req =
                await supertest(struct.app).get('/api/customers').expect(200);
            const res = JSON.parse(req.text);
            expect(res.success).to.be.true;
            expect(res.customers.length).to.equal(1);  // equal 1 tho
          });


      test('GET "/api/customers/:customer" works with integer', async () => {
        await grantAccess();

        const req =
            await supertest(struct.app).get('/api/customers/1').expect(200);
        const res = JSON.parse(req.text);
        expect(res.customer).to.be.ok;
        expect(res.customer.firstname).to.equal('john');
      });

      test('GET "/api/customers/:customer" works with string', async () => {
        await grantAccess();

        const req =
            await supertest(struct.app).get(`/api/customers/john`).expect(200);

        const res = JSON.parse(req.text);
        expect(res.customer).to.be.ok;
        expect(res.customer.lastname).to.equal('snow');
      });

      test(
          `GET /api/customers/:customer also returns favoritePizza.`,
          async () => {
            await grantAccess();

            const req = await supertest(struct.app)
                            .get(`/api/customers/john`)
                            .expect(200);

            const res = JSON.parse(req.text);
            expect(res.success).to.be.ok;
            expect(res.customer.favoritePizza).to.be.ok;
            expect(res.customer.favoritePizza.name).to.equal('jerrycheese');
          });
    });

    suite('POST', () => {
      test(
          `POST "/api/customers" Unauthorized if the user is not logged`,
          async () => {
            await supertest(struct.app)
                .post('/api/customers')
                .send()
                .expect(401);
          });


      test(
          `POST "/api/customers" Authorized if the user is logged`,
          async () => {
            await grantAccess();

            const req =
                await supertest(struct.app).post('/api/customers').send();

            expect(req.status).not.to.equal(401);
          });



      test(`POST "/api/customers" without arguments returns 400`, async () => {
        await grantAccess();

        const req = await supertest(struct.app)
                        .post('/api/customers')
                        .send()  // sends nothing
                        .expect(400);

        const res = JSON.parse(req.text);
        expect(res.success).not.to.be.ok;
        expect(res.message).to.contain('Bad Arguments');
      });

      test(
          `POST "/api/customers" adds the object in the database`, async () => {
            await grantAccess();

            expect(await Customer.count()).to.equal(1);

            await supertest(struct.app)
                .post('/api/customers')
                .send({
                  firstname: 'John',
                  lastname: 'Doe',
                })
                .expect(200);

            expect(await Customer.count()).to.equal(2);
          });


      test(
          `POST "/api/customers" fails trying to post the same customer`,
          async () => {
            await grantAccess();

            let req = await supertest(struct.app)
                          .post('/api/customers')
                          .send({firstname: 'John', lastname: 'Doe'})
                          .expect(200);

            req = await supertest(struct.app)
                      .post('/api/customers')
                      .send({firstname: 'John', lastname: 'Doe'})
                      .expect(200);

            const res = JSON.parse(req.text);
            expect(res.success).not.to.be.ok;
            expect(res.message).to.contains('already exist');
          });
    });

    suite('DELETE', () => {
      test(
          `DELETE "/api/customers/:customerId" needs Authorization`,
          async () => {
            await supertest(struct.app).delete('/api/customers/1').expect(401);
          });

      test(
          `DELETE "/api/customers/:customerId" Authorized if the user is logged`,
          async () => {
            await grantAccess();

            const req = await supertest(struct.app).delete('/api/customers/1');
            expect(req.status).not.to.equal(401);
          });

      test(
          `DELETE "/api/customers/:customerId" with "customerId" bodyParam as a "string" returns 400`,
          async () => {
            await grantAccess();

            await supertest(struct.app)
                .delete('/api/customers/hello')
                .expect(400);
          });

      test(
          `DELETE "/api/customers/1000" returns 404 (Data doesn't exist)`,
          async () => {
            await grantAccess();
            await supertest(struct.app)
                .delete('/api/customers/1000')
                .expect(404);
          });

      test(
          `DELETE "/api/customers/1" removes the object in the database`,
          async () => {
            await grantAccess();

            expect(await Customer.count()).to.equal(1);
            await supertest(struct.app).delete('/api/customers/1').expect(200);
            expect(await Customer.count()).to.equal(0);
          });
    });

    suite('PUT', () => {
      test(`PUT "/api/customers/:customerId" needs Authorization`, async () => {
        await supertest(struct.app).put('/api/customers/1').expect(401);
      });

      test(
          `PUT "/api/customers/:customerId" Authorized if the user is logged`,
          async () => {
            await grantAccess();

            const req = await supertest(struct.app).put('/api/customers/1');

            expect(req.status).not.to.equal(401);
          });

      test(
          `PUT "/api/customers/:customerId" with "customerId" bodyParam as a "string" returns 400`,
          async () => {
            await grantAccess();

            await supertest(struct.app).put('/api/customers/hello').expect(400);
          });

      test(`PUT "/api/customers/:customerId" refuses empty body`, async () => {
        await grantAccess();

        await supertest(struct.app)
            .put('/api/customers/1')
            .send({})
            .expect(400);
      });


      test(
          `PUT "/api/customers/1000" returns 404 (Data doesn't exist)`,
          async () => {
            await grantAccess();
            await supertest(struct.app)
                .put('/api/customers/1000')
                .send({
                  firstname: ''  // just to avoid the empty body constraint
                })
                .expect(404);
          });

      test(
          `PUT "/api/customers/1" updates the object in the database`,
          async () => {
            await grantAccess();

            let req = await supertest(struct.app)
                          .put('/api/customers/1')
                          .send({firstname: 'Jack'})
                          .expect(200);

            expect(JSON.parse(req.text).customer.firstname).to.equal('Jack');

            req =
                await supertest(struct.app).get('/api/customers/1').expect(200);

            expect(JSON.parse(req.text).customer.firstname).to.equal('Jack');
          });
    });
  });



  suite('User', () => {
    test(`success to login using route '/api/user/login'`, async () => {
      const base64Pass = Buffer.from('password').toString('base64');

      const req = await supertest(struct.app)
                      .post('/api/user/login')
                      .send(`username=snakeoil&password=${base64Pass}`);

      const res = JSON.parse(req.text);

      expect(res.success).to.be.true;
      expect(res.data).to.be.ok;
      return expect(res.data.username).to.equal('snakeoil');
    });
  });
});
