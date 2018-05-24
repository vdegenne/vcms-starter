import {CreamModel, RelationMappings} from 'vcms';

import Role from './Role';


class User extends CreamModel {
  id!: number;
  username!: string;
  firstname!: string;
  lastname!: string;
  email!: string;
  password!: string;

  roles?: Role[];

  static tableName = 'users';
  static relationMappings: RelationMappings = {
    roles: {
      relation: CreamModel.ManyToManyRelation,
      modelClass: `${__dirname}/Role`,
      join: {
        from: 'users.id',
        through: {from: 'users_roles.user_id', to: 'users_roles.role_id'},
        to: 'roles.id'
      }
    }
  }

  static jsonSchema = {
    type: 'object',
    required: ['username', 'firstname', 'lastname', 'email', 'password'],

    properties: {
      id: {type: 'integer'},
      username: {type: 'string'},
      firstname: {type: 'string'},
      lastname: {type: 'string'},
      email: {type: 'string'},
      password: {type: 'string'}
    }
  }
}


export const getUser = async (id: number, eager: string = null) => {
  if (eager) {
    return (await User.query().where('id', id).eager(eager))[0];
  }
  return (await User.query().where('id', id))[0];
};

export const getUserByUsername =
    async (username: string, eager: string = null) => {
  if (eager) {
    return (await User.query().where('username', username).eager(eager))[0];
  }
  return (await User.query().where('username', username))[0];
};


export default User;
