import {CreamModel, RelationMappings} from 'vcms';

import Pizza from './Pizza';


class Customer extends CreamModel {
  id!: number;
  firstname!: string;
  lastname!: string;
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
      lastname: {type: 'string'}
    }
  }
}

export const getCustomer = async (id: number, eager: string = null) => {
  if (eager) {
    return (await Customer.query().where('id', id).eager(eager))[0];
  }
  return (await Customer.query().where('id', id))[0];
};

export const getCustomerByFirstname =
    async (firstname: string, eager: string = null) => {
  if (eager) {
    return (
        await Customer.query().where('firstname', firstname).eager(eager))[0];
  }
  return (await Customer.query().where('firstname', firstname))[0];
};


export default Customer;
