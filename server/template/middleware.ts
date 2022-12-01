import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import TemplateCollection from '../template/collection';

/**
 * Checks if a template with a specified name is req.params exists
 */
const isTemplateExists = async (req: Request, res: Response, next: NextFunction) => {
  // const validFormat = Types.ObjectId.isValid(req.params._id);
  // const template = validFormat ? await TemplateCollection.findOne(req.params.name) : '';
  const template = await TemplateCollection.findOne(req.params.name);

  if (!template) {
    res.status(404).json({
      error: {
        templateNotFound: `Template with template ID ${req.params.name} does not exist.`
      }
    });
    return;
  }

  next();
};

export {
  isTemplateExists,
};
