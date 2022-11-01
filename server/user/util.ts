import type {HydratedDocument, Types} from 'mongoose';
import moment from 'moment';
import type {User, PopulatedUser} from './model';
import type {Group} from '../group/model';


// Update this if you add a property to the User type!
type UserResponse = {
  _id: string;
  name: string;
  username: string;
  password: string;
  group: Group[];
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw User object from the database into an object
 * with all the information needed by the frontend
 * (in this case, removing the password for security)
 *
 * @param {HydratedDocument<User>} user - A user object
 * @returns {UserResponse} - The user object without the password
 */
const constructUserResponse = (user: HydratedDocument<User>): UserResponse => {
  const userCopy: PopulatedUser = {
    ...user.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const name = userCopy.name;
  const username = userCopy.username;
  const password = userCopy.password;
  const groups = userCopy.groups;
  delete userCopy.name;
  return {
    ...userCopy,
    _id: userCopy._id.toString(),
    name: name,
    username: username, 
    password: password, 
    group: groups
  };
};

export {
  constructUserResponse
};
