import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Group} from '../group/model';
import type {User} from '../user/model';
import type {Message} from '../message/model';


// Update this if you add a property to the Group type!
type GroupResponse = {
    _id: string; 
    name: string; 
    dateCreated: string; 
    allUsers: string; 
    allMessages: string; 
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
const constructGroupResponse = (group: HydratedDocument<Group>): GroupResponse => {
  const groupCopy: Group = {
    ...group.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const name = groupCopy.name;
  const allUsers = groupCopy.allUsers;
  const allMessages = groupCopy.allMessages;
  delete groupCopy.name;
  return {
    ...groupCopy,
    _id: groupCopy._id.toString(),
    name: name,
    dateCreated: formatDate(group.dateCreated),
    allUsers: String(allUsers),
    allMessages: String(allMessages)
  };
};

export {
  constructGroupResponse
};
