import {Transaction} from 'objection';
import {CreamModel, RelationMappings} from 'vcms';

import Pizza from './Pizza';


class Customer extends CreamModel {
  readonly id!: number;
  firstname: string;
  lastname: string;
  favorite_pizza: number;

  favoritePizza?: Pizza;

  static tableName = 'customers';
  static relationMappings: RelationMappings = {
    favoritePizza: {
      relation: CreamModel.HasOneRelation,
      modelClass: `${__dirname}/Pizza`,
      join: {from: 'customers.favorite_pizza', to: 'pizzas.id'}
    }
  }

  static jsonSchema = {
    type: 'object',
    required: ['firstname', 'lastname'],

    properties: {
      id: {type: 'integer'},
      firstname: {type: 'string'},
      lastname: {type: 'string'},
      favorite_pizza: {type: ['integer', 'null']}
    }
  };

  static get = async (id: number, eager: string = '', trx: Transaction = null) => {
    return await Customer.query(trx).findById(id).eager(eager);
  };

  static getByFirstname = async (firstname: string, eager: string = '', trx: Transaction = null) => {
    return (await Customer.query(trx).where('firstname', firstname).eager(eager))[0];
  };
}


export default Customer;
