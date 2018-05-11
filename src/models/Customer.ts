// import {CreamModel, RelationMappings} from 'vcms/lib/models/objection-cream'
import {RelationMappings} from 'objection';
import {CreamModel} from 'vcms';

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
}

export default Customer;
