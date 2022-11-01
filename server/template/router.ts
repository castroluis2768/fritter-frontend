import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import TemplateCollection from './collection';
import * as userValidator from '../user/middleware';
import * as templateValidator from '../template/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all the templates
 *
 * @name GET /api/templates
 *
 * @return {TemplateResponse[]} - A list of all the templates
 */
router.get(
  '/',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response, next: NextFunction) => {

    const allTemplates = await TemplateCollection.findAll();
    const response = allTemplates.map(util.constructTemplateResponse);
    res.status(200).json(response);
  }
);

export {router as templateRouter};
