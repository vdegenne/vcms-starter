import {Router} from 'vcms';

import Hangeul, {getCustomer, getCustomerByFirstname} from '../models/Customer';
import Customer from '../models/Customer';

import {canAccess} from './secure';
import {getErrorDetails, validateParams} from './util';

const router: Router = Router();


/** verification */
router.use(async (req, res, next) => {
  // secure access to these interfaces
  if (['GET', 'POST', 'PUT', 'DELETE'].includes(req.method)) {
    if (!canAccess(req)) {
      res.status(401).end();
      return;
    }
  }
  next();
});



/***********
 * GET
 **********/
router.get('/', async (req, res) => {
  const customers = (await Customer.query().eager('favoritePizza'));
  res.send({success: true, customers});
});

router.get('/:customer', async (req, res) => {
  try {
    let customer;
    // the hangeulId can be both a character and a
    // Is the urlParam an integer ?
    if (validateParams(req.params, {'customer': 'integer'})) {
      customer = await getCustomer(req.params.customer, 'favoritePizza');
    } else if (validateParams(req.params, {'customer': 'string'})) {
      customer =
          await getCustomerByFirstname(req.params.customer, 'favoritePizza');
    } else {
      res.status(400).end();
      return;
    }

    if (!customer) {
      res.status(404).end();
      return;
    }

    // send the result
    res.send({success: true, customer});

  } catch (error) {
    const details = getErrorDetails(error);
    res.status(details.httpStatus === 500 ? 200 : details.httpStatus)
        .send({success: 0, ...details});
    return;
  }
});



/***********
 * POST
 **********/
router.post('/', async (req, res) => {
  // trying to insert the object in the database
  try {
    const customer = await Customer.query().insert(req.body);

    res.status(200).send({success: true, customer});
    return;

  } catch (error) {
    const details =
        getErrorDetails(error, {'23505': 'The customer already exist.'});
    res.status(details.httpStatus === 500 ? 200 : details.httpStatus)
        .send({success: 0, ...details});
    return;
  }
});


/***********
 * DELETE
 **********/
router.delete('/:customer_id', async (req, res) => {
  // Is the urlParam an integer ?
  if (!validateParams(req.params, {customer_id: 'integer'})) {
    res.status(400).end();
    return;
  }

  // Trying to delete the object
  try {
    let customer;

    // 404 not found
    if (!(customer =
              await getCustomer(req.params.customer_id, 'favoritePizza'))) {
      res.status(404).end();
      return;
    }

    // delete
    await Customer.query().delete().where('id', customer.id);
    res.status(200).send({success: true, customer});

  } catch (error) {
    const details = getErrorDetails(error);
    res.status(details.httpStatus === 500 ? 200 : details.httpStatus)
        .send({success: 0, ...details});
    return;
  }
});


/************
 * PUT
 ***********/
router.put('/:customer_id', async (req, res) => {
  // Is the urlParam an integer ?
  if (!validateParams(req.params, {customer_id: 'integer'}) ||
      !Object.keys(req.body).length) {
    res.status(400).end();
    return;
  }

  // trying to update
  try {
    let customer;

    // 404 not found
    if (!(customer =
              await getCustomer(req.params.customer_id, 'favoritePizza'))) {
      res.status(404).end();
      return;
    }

    customer = {...customer, ...req.body};

    // update
    await Customer.query().update(customer).where('id', customer.id);

    res.send({success: true, customer});
    return;

  } catch (error) {
    const details = getErrorDetails(error);
    res.status(details.httpStatus === 500 ? 200 : details.httpStatus)
        .send({success: 0, ...details});
    return;
  }
});



export {router as customersRouter};
