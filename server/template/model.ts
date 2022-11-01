import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';

/**
 * This file defines the properties stored in a Template
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Template on the backend
export type Template = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  name: string; 
  content: string;
  keyWords: string[];
};

// Mongoose schema definition for interfacing with a MongoDB table
// Template stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const TemplateSchema = new Schema<Template>({
  // The name of the Template 
  name: {
    type: String,
    required: true,
  },
  // The text contents of the Template
  content: {
    type: String,
    required: true
  }, 
  // The list of words that help in identifying the Template
  keyWords: { 
    type: [String], 
    required: true
  }
});

const TemplateModel = model<Template>('Template', TemplateSchema);
export default TemplateModel;
