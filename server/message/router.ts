import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import MessageCollection from './collection';
import GroupCollection from '../group/collection';
import * as userValidator from '../user/middleware';
import * as messageValidator from '../message/middleware';
import * as util from './util';
import UserCollection from '../user/collection';
import { PopulatedMessage } from './model';

const router = express.Router();

/**
 * Get messages in a group.
 *
 * @name GET /api/messages?groupID=id
 *
 * @return {MessageResponse[]} - An array of messages created by user with id, creatorID
 * @throws {400} - If creatorID is not given
 * @throws {404} - If no user has given creatorID
 *
 */
router.get(
  '/',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    const group = await GroupCollection.findOne(req.params.groupID);
    const response = group.allMessages;
    res.status(200).json(response);

    // const filtered: PopulatedMessage[] = [];
    // const messages = (await UserCollection.findOneByUserId(req.session.userId)).messages;
    // for (const message of messages) {
    //   const good = await (GroupCollection.findOne(message));
    //   filtered.push(good);
    // }

    // const userId = await UserCollection.findOneByUserId(req.params.userID); 
    // const response = userId.groups;

    // const response = filtered.map(util.constructMessageResponse);
    // res.status(200).json(response);
  }
);

/**
 * Create a new message.
 *
 * @name POST /api/messages
 *
 * @param {string} content - The content of the freet
 * @return {MessageResponse} - The created message
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the message content is empty or a stream of empty spaces
 * @throws {413} - If the message content is more than 140 characters long
 */
router.post(
  '/:group?',
  [
    userValidator.isUserLoggedIn,
    messageValidator.isValidMessageContent
  ],
  async (req: Request, res: Response) => {
    // const userId = req.session.userId; // Will not be an empty string since its validated in isUserLoggedIn
    // const group = await MessageCollection.addOne(req.body.content, userId, [userId], []); // Figure out if you should pass in userId
    // await UserCollection.addMessage(req.session.userId, group._id);

    // res.status(201).json({
    //   message: 'Your group was created successfully.',
    //   group: util.constructMessageResponse(group)
    // });
    console.log(req.body);
    const creatorID = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const messageResult = await MessageCollection.addOne(creatorID, req.body.content, req.params.group);
    await GroupCollection.addMessage(req.params.group, messageResult._id);

    res.status(201).json({
      message: 'Your message was created successfully.',
      messageResult: util.constructMessageResponse(messageResult)
    });
  }
);

/**
 * Delete a message
 *
 * @name DELETE /api/messages/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the message
 * @throws {404} - If the messageID is not valid
 */
router.delete(
  '/:messageID?',
  [
    userValidator.isUserLoggedIn,
    messageValidator.isMessageExists,
    messageValidator.isValidMessageModifier
  ],
  async (req: Request, res: Response) => {
    await MessageCollection.deleteOne(req.params.messageID);
    res.status(200).json({
      message: 'Your message was deleted successfully.'
    });
  }
);

export {router as messageRouter};
