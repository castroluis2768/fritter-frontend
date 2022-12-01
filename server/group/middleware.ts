import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import GroupCollection from '../group/collection';
import GroupModel from '../group/model';


/**
 * Checks if a group with said group name is req.params exists
 */
const isGroupExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.groupID);
  const group = validFormat ? await GroupCollection.findOne(req.params.groupID) : '';
  if (!group) {
    res.status(404).json({
      error: {
        groupNotFound: `Group with group ID ${req.params.groupID} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if the content of the message in req.body is valid, i.e not a stream of empty
 * spaces and not more than 140 characters
 */
 const isValidGroupName = (req: Request, res: Response, next: NextFunction) => {
    const {content} = req.body as {content: string};
    if (!content.trim()) {
      res.status(400).json({
        error: 'Group name must be at least one character long.'
      });
      return;
    }
  
    if (content.length > 140) {
      res.status(413).json({
        error: 'Group name must be no more than 140 characters.'
      });
      return;
    }
  
    next();
  };

/**
 * Checks if the current user is the author of the group whose groupId is in req.params. 
 * 
 * 
 * The creator of the group should be the only one able to change who's in the group
 */
const isValidGroupModifier = async (req: Request, res: Response, next: NextFunction) => {
    const group = await GroupCollection.findOne(req.params.groupID);
    const userId = group.creatorID._id;
    if (req.session.userId !== userId.toString()) {
      res.status(403).json({
        error: 'Cannot modify other users\' groups.'
      });
      return;
    }
    else 
  
    next();
  };

/**
 * Checks if this person belongs in the group they're looking for
 * 
 * 
 * This person should only be able to look up a person within a specific group
 */
const isPersonInGroup = async (req: Request, res: Response, next: NextFunction) => {
    const group = await GroupCollection.findOne(req.params.groupID);
    const allUsers = group.allUsers.map(u => u.username); 
    if (!allUsers.includes(req.session.id)) {
        res.status(403).json({
            error: 'Cannot modify other users\' groups.'
          });
          return;
    }
    next();

}

export {
  isGroupExists,
  isValidGroupModifier, 
  isPersonInGroup,
  isValidGroupName
};
