import {Request} from 'express';

import User from '../models/User';



export interface AuthorizationDetails {
  pass: boolean;
  as: string;
  user: User;
}


export async function getAuthorizationDetails(req: Request):
    Promise<AuthorizationDetails> {
  let auth: AuthorizationDetails = {pass: false, as: undefined, user: undefined};

  if (!req.session || !req.session.user) {
    return auth;  // no session informations.
  }

  // casting
  auth.user = Object.assign(new User, req.session.user);

  if (auth.user.hasRole('GUEST')) {
    auth.as = 'GUEST';
  }

  if (!auth.user.logged) {
    return auth;
  }

  if (await auth.user.hasRole('ADMIN')) {
    auth.pass = true;
    auth.as = 'ADMIN';
    return auth;
  }

  if (await auth.user.hasRole('USER') && auth.user.id) {
    auth.as = 'USER';

    if (!await auth.user.verifyExistence()) {
      return auth;  // user doesn't exist.
    }

    auth.pass = true;
    return auth;  // authorized. may need further verification though.
  }

  return auth;  // default to false.
};
