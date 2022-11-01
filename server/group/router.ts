import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import GroupCollection from './collection';
import * as userValidator from '../user/middleware';
import * as groupValidator from '../group/middleware';
import * as util from './util';
import UserCollection from '../user/collection';

const router = express.Router();

/**
 * Get all the groups that you're in 
 *
 * @name GET /api/groups/all
 *
 * @return {GroupResponse[]} - A list of all the groups sorted in descending
 *                      order by date modified
 */
/**
 * Get groups created by the author.
 *
 * @name GET /api/groups?CreatorId=id
 *
 * @return {GroupResponse[]} - An array of groups created by user with id, creatorId
 * @throws {400} - If creatorId is not given
 * @throws {404} - If no user has given creatorId
 *
 */
router.get(
  '/',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if creatorId query parameter was supplied
    // if (req.query.creator !== undefined) {
    //   next();
    //   return;
    // }

    const group = await GroupCollection.findOne(req.params.groupID);
    const userId = await UserCollection.findOneByUserId(req.params.userID); 
    const response = userId.groups;
    res.status(200).json(response);
    },
  [
    userValidator.isUserLoggedIn,
    userValidator.isAuthorExists
  ],
  async (req: Request, res: Response) => {
    const authorGroups = await GroupCollection.findAllByUsername(req.query.author as string);
    const response = authorGroups.map(util.constructGroupResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new group.
 *
 * @name POST /api/groups
 *
 * @param {string} name - The name of the group
 * @return {GroupResponse} - The created group
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the group name is empty or a stream of empty spaces
 * @throws {413} - If the group name is more than 30 characters long
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    groupValidator.isValidGroupName
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const group = await GroupCollection.addOne(req.body.name, [], []);

    res.status(201).json({
      message: 'Your group was created successfully.',
      freet: util.constructGroupResponse(group)
    });
  }
);

/**
 * Delete a group
 *
 * @name DELETE /api/groups/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the freet
 * @throws {404} - If the freetId is not valid
 */
router.delete(
  '/:groupID?',
  [
    userValidator.isUserLoggedIn,
    groupValidator.isGroupExists,
    groupValidator.isValidGroupModifier
  ],
  async (req: Request, res: Response) => {
    await GroupCollection.deleteOne(req.params.groupID);
    res.status(200).json({
      message: 'Your group was deleted successfully.'
    });
  }
);

/**
 * Add someone to the group chat
 *
 * @name PATCH /api/groups/:id/add
 *
 * @param {string} content - the new content for the freet
 * @return {FreetResponse} - the updated freet
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the freet
 * @throws {404} - If the freetId is not valid
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {413} - If the freet content is more than 140 characters long
 */
router.patch(
  '/:groupID?/members/add',
  [
    userValidator.isUserLoggedIn,
    groupValidator.isGroupExists,
    groupValidator.isValidGroupModifier,
  ],
  async (req: Request, res: Response) => {
    const group = await GroupCollection.addMember(req.params.groupID, req.body.memberID);
    res.status(200).json({
      message: 'Your group was updated successfully.',
      freet: util.constructGroupResponse(group)
    });
  }
);

/**
 * Remove someone from the group chat
 *
 * @name PATCH /api/groups/:id/remove
 *
 * @param {string} content - the new content for the freet
 * @return {FreetResponse} - the updated freet
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the freet
 * @throws {404} - If the freetId is not valid
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {413} - If the freet content is more than 140 characters long
 */
 router.patch(
    '/:groupID?/members/remove',
    [
      userValidator.isUserLoggedIn,
      groupValidator.isGroupExists,
      groupValidator.isValidGroupModifier,
    ],
    async (req: Request, res: Response) => {
      const group = await GroupCollection.removeMember(req.params.groupID, req.body.memberID);
      res.status(200).json({
        message: 'Your group was updated successfully.',
        freet: util.constructGroupResponse(group)
      });
    }
  );

export {router as groupRouter};
