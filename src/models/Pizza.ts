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
}



export const getPizza = async (id: number, eager: string = null) => {
  if (eager) {
    return (await Pizza.query().where('id', id).eager(eager))[0];
  }
  return (await Pizza.query().where('id', id))[0];
};


export default Pizza;
