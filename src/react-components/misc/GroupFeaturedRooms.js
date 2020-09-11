import React from "react";
import RoomInfo from '../home/rooms.json'

export function GroupFeaturedRooms(featuredRooms, lobbyType) {
  if (!featuredRooms) {
    return [];
  }

  let groups = [];

  // Iterating through all the rooms
  for (const room of featuredRooms) {
    if( lobbyType ) {
      // Filter on provided lobby type
      if( RoomInfo[lobbyType].includes(room.name) ) {
        filterRoom(room, groups)
      }
    } else {
      // Everything else
      filterRoom(room, groups)
    }
  }

  // Sort the group order
  groups = groups.sort((a, b) => {
    sortComparator(a, b, 'group_order')
  });

  // Sort the room order
  for (const group of groups) {
    group.rooms = group.rooms.sort((a, b) => {
      sortComparator(a, b, 'room_order')
    });

    // Grab the main thumbnail and description
    const mainRoom = group.rooms[0];
    group.description = mainRoom.description;
    group.thumbnail = mainRoom.images && mainRoom.images.preview && mainRoom.images.preview.url;
  }

  return groups;
}

function sortComparator(a, b, filterOption) {
  if (a.user_data && a.user_data[filterOption] !== undefined && b.user_data && b.user_data[filterOption] !== undefined) {
    return a.user_data[filterOption] - b.user_data[filterOption];
  }

  if (a.user_data && a.user_data[filterOption] !== undefined) {
    return -1;
  }

  if (b.user_data && b.user_data[filterOption] !== undefined) {
    return 1;
  }

  return 0;
}

function filterRoom(room, groups) {
  const parts = room.name.split(" | ");

  if (parts.length === 2) {
    // Room is part of a group
    const [groupName, roomName] = parts;

    let group = groups.find(g => g.name === groupName);

    if (group) {
      // Group already exists, append this room
      group.rooms.push({ ...room, name: roomName });
    } else {
      // Create a new group
      groups.push({
        name: groupName,
        rooms: [{ ...room, name: roomName }],
        user_data: room.user_data
      });
    }
  } else {
    // Room is not part of a group
    groups.push({
      name: room.name,
      rooms: [room],
      user_data: room.user_data
    });
  }
}
