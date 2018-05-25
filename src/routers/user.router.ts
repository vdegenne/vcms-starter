import {raw} from 'objection';
import {Router} from 'vcms';

import User, {getUser, getUserByUsername} from '../models/User';

import {canAccess} from './secure';
import {validateBody} from './util';

const router: Router = Router();



/****************
 * Informations
 ***************/
router.get('/', async (req, res) => {
  if (req.session) {
    res.send({success: true, data: req.session.user});
  } else {
    res.end('No session for user informations.')
  }
});


/**************
 * Login
 *************/
router.post('/login', async (req, res) => {
  if (!validateBody(req.body, {'username': 'string', 'password': 'string'})) {
    res.status(400).end();
    return;
  }

  const username = req.body.username;
  const password = Buffer.from(req.body.password, 'base64').toString('utf8');

  // verify if the user first
  let user = await getUserByUsername(username);

  if (!user) {
    res.send({success: false, message: 'The user doesn\'t exist.'});
    return;
  }

  // then verify if the password is correct
  user = (await User.query()
              .eager('roles')
              .where('username', username)
              .where(raw(`password = crypt('${password}', password)`)))[0];


  if (!user) {
    res.send({success: false, message: 'The password is incorrect.'});
    return;
  }

  // success we save the user informations in the session
  if (req.session) {
    req.session.user = {
      id: user.id,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      roles: user.roles.map(({name}) => name),
      logged: true
    };
  }

  delete user.password;

  res.send({success: true, data: user});
});



export {router as userRouter};
