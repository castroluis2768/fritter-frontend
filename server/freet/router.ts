import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FreetCollection from './collection';
import UserCollection from '../user/collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as util from './util';
import { Types, HydratedDocument } from 'mongoose';
import type {Freet} from './model'

const router = express.Router();

/**
 * Get all the freets
 *
 * @name GET /api/freets
 *
 * @return {FreetResponse[]} - A list of all the freets sorted in descending
 *                      order by date modified
 */
/**
 * Get freets by author.
 *
 * @name GET /api/freets?author=username
 *
 * @return {FreetResponse[]} - An array of freets created by user with username, author
 * @throws {400} - If author is not given
 * @throws {404} - If no user has given author
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if author query parameter was supplied
    if (req.query.author !== undefined) {
      next();
      return;
    }
    console.log("NO AAUTHOR");
    const allFreets = await FreetCollection.findAll();
    console.log("got all freets");
    const response = allFreets.map(util.constructFreetResponse);
    console.log("mapped freets");
    res.status(200).json(response);
  },
  [
    userValidator.isAuthorExists
  ],
  async (req: Request, res: Response) => {
    console.log("YES AUTOHr");
    const authorFreets = await FreetCollection.findAllByUsername(req.query.author as string);
    const response = authorFreets.map(util.constructFreetResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new freet.
 *
 * @name POST /api/freets
 *
 * @param {string} content - The content of the freet
 * @param {number} upvotes - The number of upvotes on the freet
 * @param {number} downvotes - The number of downvotes on the freet
 * @return {FreetResponse} - The created freet
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {413} - If the freet content is more than 140 characters long
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isValidFreetContent
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const freet = await FreetCollection.addOne(userId, req.body.content);

    res.status(201).json({
      message: 'Your freet was created successfully.',
      freet: util.constructFreetResponse(freet)
    });
  }
);

/**
 * Delete a freet
 *
 * @name DELETE /api/freets/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the freet
 * @throws {404} - If the freetId is not valid
 */
router.delete(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    freetValidator.isValidFreetModifier
  ],
  async (req: Request, res: Response) => {
    await FreetCollection.deleteOne(req.params.freetId);
    res.status(200).json({
      message: 'Your freet was deleted successfully.'
    });
  }
);

/**
 * Modify the contents of a freet
 *
 * @name PATCH /api/freets/:id
 *
 * @param {string} content - the new content for the freet
 * @return {FreetResponse} - the updated freet
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the freet
 * @throws {404} - If the freetId is not valid
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {413} - If the freet content is more than 140 characters long
 */
/**
 * Perform like/dislike actions on a freet 
 * 
 * @name PATCH api/freets/:id
 */
router.patch(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    freetValidator.isValidFreetModifier,
    freetValidator.isValidFreetContent
  ],
  async (req: Request, res: Response) => {
    let freet: HydratedDocument<Freet>; 
    let user = await UserCollection.findOneByUserId(req.session.userId); 
    if (req.body.action == 'editContent') {
      freet = await FreetCollection.updateOne(req.params.freetId, req.body.content);
    }
    if (req.body.action == 'addUpvote' && !user.likedFreets.includes(req.params.freetID as unknown as Types.ObjectId)) {
      freet = await FreetCollection.incrementUpvote(req.params.freetId);
      await UserCollection.incrementUpvote(freet.authorId);
      user = await UserCollection.addLikedFreet(req.session.userId, req.params.freetID);
    }
    if (req.body.action == 'subtractUpvote' && !user.likedFreets.includes(req.params.freetID as unknown as Types.ObjectId)) {
      freet = await FreetCollection.decrementUpvote(req.params.freetId);
      await UserCollection.decrementUpvote(freet.authorId);
      user = await UserCollection.removeLikedFreet(req.session.userId, req.params.freetID);
    }
    if (req.body.action == 'addDownvote' && !user.likedFreets.includes(req.params.freetID as unknown as Types.ObjectId)) {
      freet = await FreetCollection.incrementDownvote(req.params.freetId);
      await UserCollection.incrementDownvote(freet.authorId);
      user = await UserCollection.addDislikedFreet(req.session.userId, req.params.freetID);
    }
    if (req.body.action == 'subtractDownvote' && !user.likedFreets.includes(req.params.freetID as unknown as Types.ObjectId)) {
      freet = await FreetCollection.decrementDownvote(req.params.freetId);
      await UserCollection.decrementDownvote(freet.authorId);
      user = await UserCollection.removeDislikedFreet(req.session.userId, req.params.freetID);
    } 

    res.status(200).json({
      message: 'Your freet was updated successfully.',
      freet: util.constructFreetResponse(freet)
    });
  });

export {router as freetRouter};
