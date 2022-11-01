import type {HydratedDocument, Types} from 'mongoose';
import type {Template} from './model';
import TemplateModel from './model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore templates
 * stored in MongoDB, including adding, finding, updating, and deleting templates.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Template> is the output of the TemplateModel() constructor,
 * and contains all the information in Template. https://mongoosejs.com/docs/typescript.html
 */
class TemplateCollection { // these are read-only templates that you can apply when you publish freets. you can't update them, create them, nor delete them. 
  /**
   * Find a template by its id
   *
   * @param {string} templateID - The id of the template to find
   * @return {Promise<HydratedDocument<Template>> | Promise<null> } - The template with the given templateId, if any
   */
  static async findOne(templateID: Types.ObjectId | string): Promise<HydratedDocument<Template>> {
    return TemplateModel.findOne({_id: templateID});
  }

  /**
   * Get all the templates in the database
   *
   * @return {Promise<HydratedDocument<Template>[]>} - An array of all of the templates
   */
  static async findAll(): Promise<Array<HydratedDocument<Template>>> {
    // Retrieves templates and sorts them from most to least recent
    // return TemplateModel.find({}).sort({dateModified: -1}).populate('authorId');
    return TemplateModel.find({});
  }

}

export default TemplateCollection;
