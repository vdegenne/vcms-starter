import {json, Request, Response} from 'express';
import {ValidationError} from 'objection';


export function validateBody(
    params: object, validationObject: {[param: string]: string|string[]}) {
  return validateParams(params, validationObject);
}

export function validateParams(
    params: object, validationObject: {[param: string]: string|string[]}) {
  // for every params to validate
  for (const p of Object.keys(validationObject)) {
    // convert to an array if needed to enter the loop
    if (typeof validationObject[p] === 'string') {
      validationObject[p] = [<string>validationObject[p]];
    }

    // if the param is not in the params, returns false directly
    if (!params[p] && !validationObject[p].includes('undefined')) {
      return false;
    }


    // opt-in
    let valid = false;

    // for every type
    for (const t of validationObject[p]) {
      // if valid we pass all other validation
      if (valid) continue;

      let typeDetails: any = {type: t};

      // details the string type ?
      if (typeDetails.type !== 'string') {
        let stringDetails;
        if ((stringDetails = typeDetails.type.match(/^string\((.*)\)$/))) {
          typeDetails.type = 'string';
          typeDetails.length = parseInt(stringDetails[1]);  // add the length
        }
      }
      // todo: more details (for example size of integer)

      switch (typeDetails.type) {
        case 'number':
        case 'integer':
          valid = (typeof params[p] === 'number');
          if (!valid) {  // try against the string
            valid = parseInt(params[p]).toString() === params[p];
          }
          break;
        case 'string':
          valid = (typeof params[p] === 'string');
          if (typeDetails.length) {
            valid = (params[p].length === typeDetails.length);
          }
          break;
        case 'null':
          valid = (params[p] === null);
          if (!valid) {  // try against the string
            valid = (params[p] === 'null');
          }
          break;
        case 'undefined':
          valid = (!params[p]);
          break;
      }
    }

    // if no validation type were satisfied (fail)
    if (!valid) return false;
  }

  return true;
}


export interface ErrorDetails {
  message?: string;
  /** Usually error code from database */
  errcode?: number;
  /** Recommended http status to send as a response */
  httpStatus?: number;
}

export function getErrorDetails(
    error: any, customErrorMessages: {[code: string]: string} = {}) {
  let details: ErrorDetails = {
    message: 'none',
    httpStatus: 500
  }

  // objection validation fail
  if (error.name === 'ValidationError') {
    details.message = `Bad Arguments (${error.message})`;
    details.errcode = error.statusCode;
    details.httpStatus = 400;
  }

  // probably errors from the database
  if (error.code) {
    details.errcode = error.code;

    switch (error.code) {
      case '42703':
        details.message = customErrorMessages['42703'] || 'Too many arguments';
        details.httpStatus = 400;
        break;
      case '23505':
        details.message =
            customErrorMessages['23505'] || 'The object already exist.';
        break;
      case '23502':
        details.message = customErrorMessages['23502'] ||
            'Trying to delete but some data depends on it.';
        break;
      default:
        details.message = customErrorMessages[error.code] || null;
    }
  }

  return details;
}
