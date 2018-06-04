import * as chai from 'chai';
import * as ChaiAsPromised from 'chai-as-promised';
import * as supertest from 'supertest';
import {VcmsOptions} from 'vcms';
import {destroyStructure, getStructure, Structure} from 'vcms/lib/server';
import {accessAsGuest, getConfig, resetDatabase as _resetDatabase} from 'vcms/lib/test/util';

import Role from '../../models/Role';

chai.use(ChaiAsPromised);
const expect = chai.expect;

const defaultConfigScriptPath: string = __dirname + '/../../startupconfig.js';


suite('App', () => {
  let config: VcmsOptions;
  let struct: Structure;

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
      _resetDatabase(struct.database, ['0.destroy', '1.pre-data', '2.data', '3.post-data']);
    }
  }

  suite('User', () => {
    test(`success to login using route '/api/user/login'`, async () => {
      struct = await accessAsGuest(struct);

      const base64Pass = Buffer.from('password').toString('base64');

      const req = await supertest(struct.app)
                      .post('/api/user/login')
                      .send(`username=snakeoil&password=${base64Pass}`)
                      .expect(200);

      const res = JSON.parse(req.text);

      expect(res.success).not.to.be.undefined;
      expect(res.user).not.to.be.undefined;
      expect(res.user.username).to.equal('snakeoil');
    });
  });
});
