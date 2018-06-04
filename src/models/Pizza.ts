import {Transaction} from 'objection';
import {CreamModel, RelationMappings} from 'vcms';

import Customer from './Customer';


class Pizza extends CreamModel {
  id!: number;
  name!: string;
  toppings!: string;

  customers?: Customer[];

  static tableName = 'pizzas';
  static relationMappings: RelationMappings = {
    customers: {
      relation: CreamModel.HasManyRelation,
      modelClass: `${__dirname}/Customer`,
      join: {from: 'pizzas.id', to: 'customers.id'}
    }
  }

  static jsonSchema = {
    type: 'object',
    required: ['name', 'toppings'],

    properties: {
      id: {type: 'integer'},
      name: {type: 'string'},
      toppings: {type: 'string'}
    }
  }

  get = async (id: number, eager: string = '', trx: Transaction = null) => {
    return await Pizza.query(trx).findById(id).eager(eager);
  };
}


export default Pizza;
