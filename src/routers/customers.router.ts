import {Router, validateBody} from 'vcms';
import {getErrorDetails, validateParams} from 'vcms';

import Customer from '../models/Customer';

import {AuthorizationDetails, getAuthorizationDetails} from './authorization';

const router: Router = Router();



/***********
 * GET
 **********/
router.get('/', async (req, res) => {
  try {
    let auth: AuthorizationDetails = await getAuthorizationDetails(req);

    // FORBIDDEN ?
    if (!auth.pass || auth.as !== 'ADMIN') {
      res.status(401).end();
      return;
    }

    const customers = await Customer.query();
    res.send({success: 1, customers});
    return;

  } catch (e) {
    res.status(500).end();
    return;
  }
});


router.get('/:customer', async (req, res) => {
  try {
    let auth: AuthorizationDetails = await getAuthorizationDetails(req);

    // FORBIDDEN ?
    if (!auth.pass || auth.as !== 'ADMIN') {
      res.status(401).end();
      return;
    }

    /*****************
     * Bad Request ?
     *****************/
    let params: any = validateParams(req, {customer: ['number', 'string']});
    if (!params) {
      res.status(400).send({success: 0, message: 'Bad Arguments'});
      return;
    }

    /************************
     * Authentication checks
     ************************/
    // SHOULD ADD MORE AUTHENTICATION CHECK HERE

    // FORBIDDEN ?
    if (!auth.pass) {
      res.status(401).end();
      return;
    }


    try {  // get

      // eager
      const fulleager = ('fulleager' in req.query) ? true : false;
      const eager = fulleager ? 'favoritePizza' : '';


      let customer: Customer;
      switch (typeof params.customer) {
        case 'number':
          customer = await Customer.get(params.customer, eager);
          break;
        case 'string':
          customer = await Customer.getByFirstname(params.customer, eager);
          break;
        default:
          throw new Error();
      }

      if (!customer) {
        res.status(404).send({success: 0, message: `The customer couldn't be found`});
        return;
      }

      // send
      res.send({success: 1, customer});
      return;

    } catch (e) {
      const details = getErrorDetails(e);
      res.status(details.httpStatus).send({success: 0, ...details});
      return;
    }
  } catch (e) {
    res.status(500).end();
    return;
  }
});



/***********
 * POST
 **********/
router.post('/', async (req, res) => {
  try {
    let auth: AuthorizationDetails = await getAuthorizationDetails(req);

    // FORBIDDEN ?
    if (!auth.pass) {
      res.status(401).end();
      return;
    }

    /*****************
     * Bad Request ?
     *****************/
    let body: any = validateBody(req, {firstname: 'string', lastname: 'string'});
    if (!body) {
      res.status(400).send({success: 0, message: 'Bad Arguments'});
      return;
    }

    /************************
     * Authentication checks
     ************************/
    // SHOULD ADD MORE AUTHENTICATION CHECK HERE

    // FORBIDDEN ?
    if (!auth.pass) {
      res.status(401).end();
      return;
    }

    try {  // insert
      // SHOULD PREPARE THE DATA HERE


      // insert
      const customer = await Customer.query().insert(body).returning('*');

      res.status(200).send({success: 1, customer});
      return;

    } catch (e) {
      const details = getErrorDetails(e);
      res.status(details.httpStatus).send({success: 0, ...details});
      return;
    }

  } catch (e) {
    res.status(500).end();
    return;
  }
});



/***********
 * PUT
 ***********/
router.put('/:customerId', async (req, res) => {
  try {
    let auth: AuthorizationDetails = await getAuthorizationDetails(req);

    // FORBIDDEN ?
    if (!auth.pass) {
      res.status(401).end();
      return;
    }

    /*****************
     * Bad Request ?
     *****************/
    let params: any = validateParams(req, {customerId: 'number'});
    let body: any =
        validateBody(req, {firstname: ['string', 'undefined'], lastname: ['string', 'undefined']});

    if (!params || !body || !Object.keys(body).length) {
      res.status(400).send({success: 0, message: 'Bad Arguments'});
      return;
    }

    /************************
     * Authentication checks
     ************************/
    // SHOULD ADD MORE AUTHENTICATION CHECK HERE

    // FORBIDDEN ?
    if (!auth.pass) {
      res.status(401).end();
      return;
    }

    try {  // update
      let customer: Customer = await Customer.get(params.customerId);

      if (!customer) {
        res.status(404).send({success: 0, message: 'The customer doesn\'t exist'});
        return;
      }

      // customer = {...customer, ...body};
      customer = (await Customer.query().patch(body).where('id', customer.id).returning('*'))[0];

      res.send({success: 1, customer});
      return;

    } catch (e) {
      const details = getErrorDetails(e);
      res.status(details.httpStatus).send({success: 0});
      return;
    }

  } catch (e) {
    res.status(500).end();
    return;
  }
});



/***********
 * DELETE
 **********/
router.delete('/:customerId', async (req, res) => {
  try {
    let auth: AuthorizationDetails = await getAuthorizationDetails(req);

    // forbidden ?
    if (!auth.pass) {
      res.status(401).end();
      return;
    }

    /*****************
     * Bad Request ?
     *****************/
    let params: any = validateParams(req, {customerId: 'number'});
    if (!params) {
      res.status(400).end();
      return;
    }

    let customer: any = await Customer.get(params.customerId);
    try {  // delete

      if (!customer) {
        res.status(404).send({success: 0, message: 'The customer was not found'});
        return;
      }

      // deleting the object
      customer = await Customer.query().deleteById(params.customerId);
      res.send({success: 1, customer});


    } catch (e) {
      const details = getErrorDetails(e);
      res.status(details.httpStatus).send({success: 0, ...details});
      return;
    }
  } catch (e) {
    res.status(500).end();
    return;
  }
});



export {router as customersRouter};
