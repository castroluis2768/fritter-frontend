import type {HydratedDocument, Types} from 'mongoose';
import moment from 'moment';
import type {Group, PopulatedGroup} from '../group/model';
import type {User} from '../user/model';
import type {Message} from '../message/model';


// Update this if you add a property to the Group type!
type GroupResponse = {
    _id: string; 
    name: string; 
    creatorID: User; 
    dateCreated: string; 
    allUsers: User[]; 
    allMessages: Message[]; 
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Group object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Group>} group - A group
 * @returns {GroupResponse} - The freet object formatted for the frontend
 */
const constructGroupResponse = (group: HydratedDocument<PopulatedGroup>): GroupResponse => {
  const groupCopy: PopulatedGroup = {
    ...group.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  // const {creator} = groupCopy.creatorID;
  const allUsers = groupCopy.allUsers;
  const allMessages = groupCopy.allMessages;
  return {
    ...groupCopy,
    _id: groupCopy._id.toString(),
    creatorID: groupCopy.creatorID,
    name: groupCopy.name,
    dateCreated: formatDate(groupCopy.dateCreated),
    allUsers: groupCopy.allUsers,
    allMessages: groupCopy.allMessages
  };
};

export {
  constructGroupResponse
};
