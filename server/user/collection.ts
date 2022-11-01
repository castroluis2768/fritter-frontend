import {HydratedDocument, Types} from 'mongoose';
import type {User, PopulatedUser} from './model';
import type {Group} from '../group/model';
import GroupModel from '../group/model';
import UserModel from './model';

/**
 * This file contains a class with functionality to interact with users stored
 * in MongoDB, including adding, finding, updating, and deleting. Feel free to add
 * additional operations in this file.
 *
 * Note: HydratedDocument<User> is the output of the UserModel() constructor,
 * and contains all the information in User. https://mongoosejs.com/docs/typescript.html
 */
class UserCollection {
  /**
   * Add a new user
   *
   * @param {string} name - The name of the user
   * @param {string} username - The username of the user
   * @param {string} password - The password of the user
   * @return {Promise<HydratedDocument<User>>} - The newly created user
   */
  static async addOne(name: string, username: string, password: string): Promise<HydratedDocument<User>> {
    const dateJoined = new Date();
    const followers = new Number(0); 
    const following = new Number(0);
    const totalFreets = new Number(0);
    const reputationScore = new Number(0);
    const totalUpvotes = new Number(0); 
    const totalDownvotes = new Number(0); 
    const groups = new Array<Types.ObjectId>();
    const likedFreets = new Array<Types.ObjectId>();
    const dislikedFreets = new Array<Types.ObjectId>();

    const user = new UserModel({name, username, password, followers, following, totalFreets, totalUpvotes, totalDownvotes, reputationScore, groups, likedFreets, dislikedFreets, dateJoined});
    await user.save(); // Saves user to MongoDB
    return user.populate('groups');
  }

  /**
   * Find a user by userId.
   *
   * @param {string} userId - The userId of the user to find
   * @return {Promise<HydratedDocument<User>> | Promise<null>} - The user with the given username, if any
   */
  static async findOneByUserId(userId: Types.ObjectId | string): Promise<HydratedDocument<User>> {
    return UserModel.findOne({_id: userId});
  }

  /**
   * Find a user by username (case insensitive).
   *
   * @param {string} username - The username of the user to find
   * @return {Promise<HydratedDocument<User>> | Promise<null>} - The user with the given username, if any
   */
  static async findOneByUsername(username: string): Promise<HydratedDocument<User>> {
    return UserModel.findOne({username: new RegExp(`^${username.trim()}$`, 'i')});
  }

  /**
   * Find a user by username (case insensitive).
   *
   * @param {string} username - The username of the user to find
   * @param {string} password - The password of the user to find
   * @return {Promise<HydratedDocument<User>> | Promise<null>} - The user with the given username, if any
   */
  static async findOneByUsernameAndPassword(username: string, password: string): Promise<HydratedDocument<User>> {
    return UserModel.findOne({
      username: new RegExp(`^${username.trim()}$`, 'i'),
      password
    });
  }

  /**
   * Update user's information
   *
   * @param {string} userId - The userId of the user to update
   * @param {Object} userDetails - An object with the user's updated credentials
   * @return {Promise<HydratedDocument<User>>} - The updated user
   */
   static async updateOne(userId: Types.ObjectId | string, userDetails: {password?: string; username?: string, reputationScore: number, totalUpvotes: number, totalDownvotes: number, groups: Types.ObjectId[]}): Promise<HydratedDocument<User>> {
    const user = await UserModel.findOne({_id: userId}).populate('groups');
    if (userDetails.password) {
      user.password = userDetails.password;
    }

    if (userDetails.username) {
      user.username = userDetails.username;
    }

    if (userDetails.reputationScore) {
      user.reputationScore = userDetails.reputationScore;
    }
    
    if (userDetails.totalUpvotes) {
      user.totalUpvotes = userDetails.totalUpvotes;
    }

    if (userDetails.totalDownvotes) {
      user.totalDownvotes = userDetails.totalDownvotes;
    }

    if (userDetails.groups) {
      user.groups = userDetails.groups;
    }

    await user.save();
    return user.populate('groups');
  }

  /**
   * Update a freet by decrementing the upvote count
   *
   * @param {string} freetId - The id of the freet to be updated
   * @return {Promise<HydratedDocument<Freet>>} - The newly updated freet
   */
  static async addLikedFreet(userId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<HydratedDocument<User>> {
      const user = await UserModel.findOne({_id: userId});
      user.likedFreets.push(new Types.ObjectId(freetId));
      await user.save();
      return user;
    }
  
  /**
   * Update a freet by decrementing the upvote count
   *
   * @param {string} freetId - The id of the freet to be updated
   * @return {Promise<HydratedDocument<Freet>>} - The newly updated freet
   */
  static async removeLikedFreet(userId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<HydratedDocument<User>> {
      const user = await UserModel.findOne({_id: userId});
      user.likedFreets.splice(user.likedFreets.indexOf(new Types.ObjectId(freetId)), 1);   
      await user.save();
      return user;
    }

  /**
   * Update a freet by decrementing the upvote count
   *
   * @param {string} freetId - The id of the freet to be updated
   * @return {Promise<HydratedDocument<Freet>>} - The newly updated freet
   */
  static async addDislikedFreet(userId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<HydratedDocument<User>> {
    const user = await UserModel.findOne({_id: userId});
    user.dislikedFreets.push(new Types.ObjectId(freetId));
    await user.save();
    return user;
  }
  
  /**
   * Update a freet by decrementing the upvote count
   *
   * @param {string} freetId - The id of the freet to be updated
   * @return {Promise<HydratedDocument<Freet>>} - The newly updated freet
   */
  static async removeDislikedFreet(userId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<HydratedDocument<User>> {
    const user = await UserModel.findOne({_id: userId});
    user.dislikedFreets.splice(user.dislikedFreets.indexOf(new Types.ObjectId(freetId)), 1);   
    await user.save();
    return user;
  }

  /**
   * Delete a user from the collection.
   *
   * @param {string} userId - The userId of user to delete
   * @return {Promise<Boolean>} - true if the user has been deleted, false otherwise
   */
  static async deleteOne(userId: Types.ObjectId | string): Promise<boolean> {
    const user = await UserModel.deleteOne({_id: userId});
    return user !== null;
  }
}

export default UserCollection;
