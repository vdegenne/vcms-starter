import {CreamModel, RelationMappings} from 'vcms';


class Role extends CreamModel {
  id!: number;
  name!: string;

  static tableName = 'roles';

  static relationMappings: RelationMappings = {
    users: {
      relation: CreamModel.ManyToManyRelation,
      modelClass: `${__dirname}/User`,
      join: {
        from: 'roles.id',
        through: {from: 'users_roles.role_id', to: 'users_roles.user_id'},
        to: 'users.id'
      }
    }
  }

  static jsonSchema = {
    type: 'object',
    required: ['name'],

    properties: {id: {type: 'integer'}, name: {type: 'string'}}
  }
}


export const getRole = async (id: number, eager: string = null) => {
  if (eager) {
    return (await Role.query().where('id', id).eager(eager))[0];
  }
  return (await Role.query().where('id', id))[0];
};


export default Role;
