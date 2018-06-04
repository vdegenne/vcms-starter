import {raw} from 'objection';
import {Router} from 'vcms';
import {validateBody} from 'vcms/lib/routers/util';

import User from '../models/User';

import {AuthorizationDetails, getAuthorizationDetails} from './authorization';

const router: Router = Router();



/****************
 * Informations
 ***************/
router.get('/', async (req, res) => {
  try {
    let auth: AuthorizationDetails = await getAuthorizationDetails(req);

    if (!auth.pass && auth.as !== 'GUEST') {
      res.status(401).end();
      return;
    }

    res.send({success: 1, user: req.session.user});
    return;

  } catch (e) {
    res.status(500).end();
    return;
  }
});


/**************
 * Login
 *************/
router.post('/login', async (req, res) => {
  try {
    let auth: AuthorizationDetails = await getAuthorizationDetails(req);

    if (auth.as !== 'GUEST') {
      res.status(401).end();
      return;
    }

    /*****************
     * Bad Request ?
     *****************/
    let body: any = validateBody(req, {username: 'string', password: 'string'});
    if (!body) {
      res.status(400).end();
      return;
    }

    const username = body.username;
    const password = Buffer.from(body.password, 'base64').toString('utf8');

    // verify that the user exist first
    let user = await User.getByUsername(username);

    if (!user) {
      res.send({success: 0, message: `The user doesn't exist`});
      return;
    }

    // then verify if the password is correct
    user = (await User.query()
                .where('username', username)
                .andWhere(raw(`password = crypt('${password}', password)`))
                .eager('roles'))[0];

    if (!user) {
      res.send({success: 0, message: `The password is incorrect`});
      return;
    }

    // update the session object
    if (req.session) {
      req.session.user = {
        logged: true,
        id: user.id,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        roles: user.roles.map(({name}) => name)
      }
    }

    res.send({success: 1, user});
    return;

  } catch (e) {
    res.status(500).end();
    return;
  }
});



export {router as userRouter};
