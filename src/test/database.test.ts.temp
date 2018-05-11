import {readFileSync as read} from 'fs';
import database from '../database';

// renew the database
beforeEach((done) => {
  const sql = ['destructure', 'structure', 'data']
                  .map(f => read(`${__dirname}/../../sql/${f}.sql`).toString())
                  .join('');

  database.raw(sql).then(() => done()).catch(err => done(err));
});


// after all
after(done => {database.destroy(done)});


suite('Database', () => {

  test('gives us a decent connection', async() => {
    try {
      return database.raw('select 1+1 as result');
    } catch (err) {
      throw new Error('brooo');
    }
  });
});
