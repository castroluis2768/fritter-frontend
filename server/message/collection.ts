import type {HydratedDocument, Types} from 'mongoose';
import type {Message} from './model';
import type {Group} from '../group/model';
import type {PopulatedGroup} from '../group/model';
import type {PopulatedMessage} from './model';
import MessageModel from './model';
import GroupModel from '../group/model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore messages
 * stored in MongoDB, including adding, finding, updating, and deleting messages.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Message> is the output of the MessageModel() constructor,
 * and contains all the information in Message. https://mongoosejs.com/docs/typescript.html
 */
class MessageCollection {
  /**
   * Add a message to the collection
   *
   * @param {string} creatorID - The id of the author of the message
   * @param {string} content - The id of the content of the message
   * @param {Types.ObjectId[]} group - The list of the users who received the message
   * @return {Promise<HydratedDocument<Message>>} - The newly created message
   */
  static async addOne(creatorID: Types.ObjectId | string, content: string, groupID: Types.ObjectId | string): Promise<HydratedDocument<PopulatedMessage>> {

    const date = new Date();
    const message = new MessageModel({
      creatorID,
      dateSent: date,
      content,
      group: groupID,
    });
    await message.save(); // Saves freet to MongoDB
    return (await message.populate('creatorID')).populate('group');
  }

  /**
   * Find a message by the messageID 
   *
   * @param {string} messageID - The id of the message to find
   * @return {Promise<HydratedDocument<Message>> | Promise<null> } - The message with the given messageID, if any
   */
  static async findOne(messageID: Types.ObjectId | string): Promise<HydratedDocument<Message>> {
    return MessageModel.findOne({_id: messageID}).populate('creatorID');
  }

  /**
   * Get all the messages in the database that you've sent out to people (one-to-one)
   *
   * @return {Promise<HydratedDocument<Message>[]>} - An array of all of the messages
   */
  static async allMessagesSentOne(creatorID: Types.ObjectId | string, isOneToOne: boolean): Promise<Array<HydratedDocument<Message>>> {
    // Retrieves messages and sorts them from most to least recent
    if (isOneToOne) {
        return MessageModel.find({creatorID: creatorID, isOneToOne: true}).sort({dateModified: -1}).populate('creatorID');
    }
  }

  /**
   * Get all the messages in the database that you've sent out to people (group)
   *
   * @return {Promise<HydratedDocument<Message>[]>} - An array of all of the messages
   */
   static async allMessagesSentGroup(creatorID: Types.ObjectId | string, isOneToOne: boolean): Promise<Array<HydratedDocument<Message>>> {
    // Retrieves messages and sorts them from most to least recent
    if (!isOneToOne) {
        return MessageModel.find({creatorID: creatorID, isOneToOne: false}).sort({dateModified: -1}).populate('creatorID');
    }
  }

  /**
   * Get all the messages in the database that you've ever sent out to people (total)
   *
   * @param {string} creatorID - The ID of author of the messages
   * @return {Promise<HydratedDocument<Message>[]>} - An array of all of the messages
   */
  static async findAllMessagesSent(creatorID: string): Promise<Array<HydratedDocument<Message>>> {
    return MessageModel.find({creatorID: creatorID}).sort({dateModified: -1}).populate('creatorID');
  }

  /**
   * Get all the messages in the database that you've ever received
   *
   * @param {string} username - The username of author of the messages
   * @return {Promise<HydratedDocument<Messages>[]>} - An array of all of the messages
   */
  static async findAllMessagesReceived(username: string): Promise<Array<HydratedDocument<Message>>> {
    const author = await UserCollection.findOneByUsername(username);
    return MessageModel.find({recipientIDs: [author]}).sort({dateModified: -1}).populate('creatorID');
  }
 
  /**
   * Get all the messages in a group that you belong in
   *
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the groups
   */
  static findAllMessagesGroup(group: PopulatedGroup): Array<Message> {
    // Retrieves freets and sorts them from most to least recent
    return group.allMessages;
  }

  /**
   * Delete a message with given messageID. // think like an undo feature
   *
   * @param {string} messageID - The messageID of the message to delete
   * @return {Promise<Boolean>} - true if the message has been deleted, false otherwise
   */
  static async deleteOne(messageID: Types.ObjectId | string): Promise<boolean> {
    const message = await MessageModel.deleteOne({_id: messageID});
    return message !== null;
  }


  
}

export default MessageCollection;
