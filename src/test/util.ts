import {readFileSync} from 'fs';
import * as Knex from 'knex';
import {VcmsOptions} from 'vcms';
import {destroyStructure, getStructure, Structure} from 'vcms/lib/server';

import Role from '../models/Role';
