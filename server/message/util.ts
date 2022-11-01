import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Message, PopulatedMessage} from '../message/model';

// Update this if you add a property to the Message type!
type MessageResponse = {
  _id: string;
  creator: string;
  dateSent: string;
  content: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Message object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Message>} message - A message
 * @returns {MessageResponse} - The message object formatted for the frontend
 */
const constructMessageResponse = (message: HydratedDocument<PopulatedMessage>): MessageResponse => {
  const messageCopy: PopulatedMessage = {
    ...message.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = messageCopy.creatorID;
  delete messageCopy.creatorID; 
  return {
    ...messageCopy,
    _id: messageCopy._id.toString(),
    creator: username,
    dateSent: formatDate(message.dateSent),
  };
};

export {
  constructMessageResponse
};
