import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {Group} from '../group/model';
import type {Freet} from '../freet/model';


/**
 * This file defines the properties stored in a User
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for User on the backend
export type User = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  name: string; 
  username: string;
  password: string;
  followers: number;
  following: number; 
  totalFreets: number; 
  totalUpvotes: number;
  totalDownvotes: number;
  reputationScore: number;
  groups: Types.ObjectId[];
  likedFreets: Types.ObjectId[]; 
  dislikedFreets: Types.ObjectId[]; 
  dateJoined: Date;
};

export type PopulatedUser = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  name: string; 
  username: string;
  password: string;
  followers: number;
  following: number; 
  totalFreets: number; 
  totalUpvotes: number;
  totalDownvotes: number;
  reputationScore: number;
  groups: Group[];
  likedFreets: Freet[]; 
  dislikedFreets: Freet[]; 
  dateJoined: Date;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Users stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const UserSchema = new Schema({
  // The user's name (mutable) 
  name: {
    type: String,
    required: true
  },
  // The user's username
  username: {
    type: String,
    required: true
  },
  // The user's password
  password: {
    type: String,
    required: true
  },
  // Number of followers the user has
  followers: {
    type: Number,
    required: true
  },
  // Number of profiles the user is following
  following: {
    type: Number,
    required: true
  },
  // Number of total freets the user has ever made
  totalFreets: {
    type: Number,
    required: true
  },
  // The total amount of upvotes a user has ever had
  totalUpvotes: {
    type: Number,
    required: true
  },
  // The total amount of downvotes a user has ever had 
  totalDownvotes: {
    type: Number,
    required: true
  },
  // The reputation score associated with the user
  reputationScore: {
    type: Number,
    required: true
  },
  // all the Groups this User is a part of 
  groups: [{
    type: Schema.Types.ObjectId, 
    required: true, 
    ref: 'Group'
  }],
  // all the freets this User likes
  likedFreets: [{
    type: Schema.Types.ObjectId, 
    required: true, 
    ref: 'Freet'
  }],
  // all the freets this User dislikes
  dislikedFreets: [{
    type: Schema.Types.ObjectId, 
    required: true, 
    ref: 'Freet'
  }],
  // The date the user joined
  dateJoined: {
    type: Date,
    required: true
  }
});

const UserModel = model<User>('User', UserSchema);
export default UserModel;
