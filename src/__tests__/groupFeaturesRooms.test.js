import { GroupFeaturedRooms } from "../react-components/misc/GroupFeaturedRooms"
const rooms = require('./room.json')

test('TEST', () => {
  const groupedKeynoteRooms = GroupFeaturedRooms(rooms.results, 'keynote');
  console.log(groupedKeynoteRooms);
});
