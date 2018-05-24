import {readFileSync} from 'fs';
import * as Knex from 'knex';


export async function resetDatabase(database: Knex) {
  const sql =
      ['cleanup', '2.data']
          .map(f => readFileSync(`${__dirname}/../../sql/${f}.sql`).toString())
          .join(';');

  await database.raw(sql);
}
