import {RelationMappings} from 'objection';
import {CreamModel} from 'vcms';

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
}



export default Pizza;
