import {json, Request, Response} from 'express';
import {ValidationError} from 'objection';


export interface ErrorFeedback {
  success: boolean;
  data: string;
  /** Usually error code from database */
  errcode?: number;
  /** http status */
  httpStatus: number;
}

export async function getErrorFeedback(
    error: any, req: Request, res: Response,
    customErrorMessages: {[code: string]: string} = {}):
    Promise<ErrorFeedback> {
  let feed: ErrorFeedback = {
    success: false,
    data: null,
    httpStatus: 500
  }

  // objection validation fail
  if (error.name === 'ValidationError') {
    feed = {
      ...feed,
      errcode: error.statusCode,
      data: 'Bad Arguments',
      httpStatus: 400
    };
  }


  // probably errors from the database
  if (error.code) {
    feed.errcode = error.code;
    switch (error.code) {
      case '23505':
        feed.data = customErrorMessages['23505'] || 'The object already exist.';
        break;
      case '23502':
        feed.data = customErrorMessages['23502'] ||
            'Trying to delete but some data depends on it.';
        break;
      default:
        feed.data = customErrorMessages[error.code] || null;
    }
  }

  return feed;
}


export function validateBody(
    params: object, validationObject: {[param: string]: string}) {
  return validateParams(params, validationObject);
}

export function validateParams(
    params: object, validationObject: {[param: string]: string}) {
  for (const p of Object.keys(validationObject)) {
    if (!params[p]) return false;

    let Type: any = {
      type: validationObject[p]
    }

    // details the string type ?
    if (Type.type !== 'string') {
      let stringDetails;
      if ((stringDetails = Type.type.match(/^string\((.*)\)$/))) {
        Type.type = 'string';
        Type.length = parseInt(stringDetails[1]);
      }
    }
    // todo: more details (for example size of integer)

    switch (Type.type) {
      case 'integer':
        if (parseInt(params[p]).toString() !== params[p]) {
          return false;
        }
        break;
      case 'string':
        if (Type.length)
          if (params[p].length !== Type.length) return false;
        break;
      default:
        return false;
    }
  }
  return true;
}
