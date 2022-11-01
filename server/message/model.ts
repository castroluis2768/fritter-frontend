import {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Group} from '../group/model';

/**
 * This file defines the properties stored in a Message
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Message on the backend
export type Message = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creations
  creatorID: Types.ObjectId; // the ID of the User who sent the Message
  dateSent: Date; // The Date when the Message was sent
  content: string; // what is contained in the Message
  group: Types.ObjectId; // list of Users who received the Message
};

export type PopulatedMessage = {
    _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
    creatorID: User; // the ID of the User who sent the Message
    dateSent: Date; // The Date when the Message was sent
    content: string; // what is contained in the Message
    group: Group; // list of Users who received the Message
  };

// Mongoose schema definition for interfacing with a MongoDB table
// Chats stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const MessageSchema = new Schema<Message>({
  // The ID of the User who sent the Message
  creatorID: {
    type: Schema.Types.ObjectId, // this is inside MongoDB
    required: true, 
    ref: 'User'
  }, 
  // The Date when the Message was sent 
  dateSent: {
    type: Date,
    required: true,
  }, 
  // The content of the Message
  content: {
    type: String,
    required: true
  },
  // The List of the Users who received the Message 
  group: { 
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Group'
  }
});

const MessageModel = model<Message>('Message', MessageSchema);
export default MessageModel;
