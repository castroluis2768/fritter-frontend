import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import MessageCollection from '../message/collection';

/**
 * Checks if a message with messageID is req.params exists
 */
const isMessageExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.messageID);
  const message = validFormat ? await MessageCollection.findOne(req.params.messageID) : '';
  if (!message) {
    res.status(404).json({
      error: {
        freetNotFound: `Message with Message ID ${req.params.messageID} does not exist.`
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
const isValidMessageContent = (req: Request, res: Response, next: NextFunction) => {
  const {content} = req.body as {content: string};
  if (!content.trim()) {
    res.status(400).json({
      error: 'Message content must be at least one character long.'
    });
    return;
  }

  if (content.length > 140) {
    res.status(413).json({
      error: 'Message content must be no more than 140 characters.'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the author of the message whose messageID is in req.params
 */
const isValidMessageModifier = async (req: Request, res: Response, next: NextFunction) => {
    const message = await MessageCollection.findOne(req.params.messageID);
    const userId = message.creatorID._id;
    if (req.session.creatorID !== userId.toString()) {
      res.status(403).json({
        error: 'Cannot modify other users\' messages.'
      });
      return;
    }
    else 
  
    next();
  };

export {
  isValidMessageContent,
  isValidMessageModifier,
  isMessageExists,
};
