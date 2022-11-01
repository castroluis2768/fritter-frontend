import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Template} from '../template/model';

// Update this if you add a property to the Template type!
type TemplateResponse = {
  _id: string; // MongoDB assigns each object this ID on creation
  name: string; 
  content: string;
  keyWords: string[];
};

/**
 * Transform a raw Template object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Template>} template - A template
 * @returns {TemplateResponse} - The template object formatted for the frontend
 */
const constructTemplateResponse = (template: HydratedDocument<Template>): TemplateResponse => {
  const templateCopy: Template = {
    ...template.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const name = templateCopy.name;
  const content = templateCopy.content;
  const keyWords = templateCopy.keyWords;
  delete templateCopy.name; 
  return {
    ...templateCopy,
    _id: templateCopy._id.toString(),
    name: name, 
    content: content, 
    keyWords: keyWords
  };
};

export {
  constructTemplateResponse
};
