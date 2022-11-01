import type {HydratedDocument, Types} from 'mongoose';
import MessageModel from './model';
import GroupModel from './model';
import type {Group, PopulatedGroup} from './model';
import type {User} from '../user/model';
import type {Message} from '../message/model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore groups
 * stored in MongoDB, including adding, finding, updating, and deleting groups.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Group> is the output of the GroupModel() constructor,
 * and contains all the information in Group. https://mongoosejs.com/docs/typescript.html
 */
class GroupCollection {
  /**
   * Add a group to the collection
   *
   * @param {string} name - The name of the Group (unique identifier)
   * @param {Types.ObjectId[]} allUsers - The list of all the users in the Group
   * @param {Types.ObjectId[]} allMessages - The list of all the messages in the Group
   * @return {Promise<HydratedDocument<Group>>} - The newly created group
   */
  static async addOne(name: string, allUsers: Types.ObjectId[], allMessages: Types.ObjectId[]): Promise<HydratedDocument<Group>> {
    const date = new Date();
    const group = new GroupModel({
      name, 
      date, 
      allUsers, 
      allMessages
    });
    await group.save(); // Saves group to MongoDB
    return group.populate('creatorID');
  }

  /**
   * Find a group by its id
   *
   * @param {string} groupID - The ID of the group to find
   * @return {Promise<HydratedDocument<Group>> | Promise<null> } - The group with the given groupID, if any
   */
  static async findOne(groupID: Types.ObjectId | string): Promise<HydratedDocument<PopulatedGroup>> {
    return GroupModel.findOne({_id: groupID}).populate('creatorID').populate('allUsers').populate('allMessages');
  }

  /**
   * Find all groups in the database
   *
   * @return {Promise<HydratedDocument<Group>> | Promise<null> } - The group with the given groupID, if any
   */
   static async findAll(): Promise<Array<HydratedDocument<Group>>> {
    return GroupModel.find({}).populate('creatorID');
  }

  /**
   * Get all the groups in by given author
   *
   * @param {string} username - The username of author of the freets
   * @return {Promise<HydratedDocument<Group>[]>} - An array of all of the freets
   */
     static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Group>>> {
      const author = await UserCollection.findOneByUsername(username);
      return GroupModel.find({authorId: author._id}).populate('authorId');
    }

  /**
   * Add a new member to a group
   *
   * @param {string} groupID - The id of the group to be updated
   * @param {string} memberId - Member of group to be added/removed
   * @return {Promise<HydratedDocument<Freet>>} - The newly updated group
   */
  static async addMember(groupID: Types.ObjectId | string, memberID: Types.ObjectId): Promise<HydratedDocument<Group>> {
    const group = await GroupModel.findOne({_id: groupID});
    group.allUsers.push(memberID);
    await group.save();
    return group.populate('creatorID');
  }

  /**
   * Remove a member from a group
   *
   * @param {string} groupID - The id of the group to be updated
   * @param {string} content - The new content of the freet
   * @return {Promise<HydratedDocument<Freet>>} - The newly updated group
   */
  static async removeMember(groupID: Types.ObjectId | string, memberID: Types.ObjectId): Promise<HydratedDocument<Group>> {
    const group = await GroupModel.findOne({_id: groupID});
    group.allUsers.splice(group.allUsers.indexOf(memberID), 1);
    await group.save();
    return group.populate('creatorID');
  }

  /**
   * Delete a group with given groupID.
   *
   * @param {string} groupID - The groupID of group to delete
   * @return {Promise<Boolean>} - true if the group has been deleted, false otherwise
   */
  static async deleteOne(groupID: Types.ObjectId | string): Promise<boolean> {
    const group = await GroupModel.deleteOne({_id: groupID});
    return group !== null;
  }

  /**
   * Delete all the groups by the given author
   *
   * @param {string} creatorID - The id of author of groups
   */
  static async deleteMany(creatorID: Types.ObjectId | string): Promise<void> {
    await GroupModel.deleteMany({creatorID});
  }
}

export default GroupCollection;
