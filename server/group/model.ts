import {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Message} from '../message/model';


/**
 * This file defines the properties stored in a Group
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Group on the backend
export type Group = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  name: string; // the Group chat's name
  creatorID: Types.ObjectId; // the creator of the Group (think admin privileges)
  dateCreated: Date; // The Date when the Group was made
  allUsers: Types.ObjectId[]; // all Users in the Group. If the length is 2, then it's essentially a 1:1 chat 
  allMessages: Types.ObjectId[]; // list of messages in the Group
};

export type PopulatedGroup = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  name: string; // the Group chat's name
  creatorID: User; // the creator of the Group (think admin privileges)
  dateCreated: Date; // The Date when the Group was made
  allUsers: User[]; // all Users in the Group. If the length is 2, then it's essentially a 1:1 chat 
  allMessages: Message[]; // list of messages in the Group
};

// Mongoose schema definition for interfacing with a MongoDB table
// Chats stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const GroupSchema = new Schema<Group>({
  // The name of the Chat (unique ID)
  name: {
    type: String, 
    required: true 
  }, 
  // The ID of the person who created the Group 
  creatorID: {
    type: Schema.Types.ObjectId, 
    required: true,
    ref: 'User'
  },
  // The date the Freet was created
  dateCreated: {
    type: Date,
    required: true
  },
  // A list of all the Users in the Chat 
  allUsers: {
    type: [Schema.Types.ObjectId], 
    required: true,
    ref: 'User'
  }, 
  // A list of all the messages in the Chat
  allMessages: { 
    type: [Schema.Types.ObjectId], 
    required: true,
    ref: 'Message'
  }
});

const GroupModel = model<Group>('Group', GroupSchema);
export default GroupModel;
