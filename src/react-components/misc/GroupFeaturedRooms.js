import React from "react";

export function GroupFeaturedRooms(featuredRooms) {
  if (!featuredRooms) {
    return [];
  }

  let groups = [];

  for (const room of featuredRooms) {
    console.log(featuredRooms);
    const parts = room.name.split(" | ");

    if (parts.length === 2) {
      const [groupName, roomName] = parts;

      let group = groups.find(g => g.name === groupName);

      if (group) {
        group.rooms.push({ ...room, name: roomName });
      } else {
        groups.push({
          name: groupName,
          rooms: [{ ...room, name: roomName }],
          user_data: room.user_data
        });
      }
    } else {
      groups.push({
        name: room.name,
        rooms: [room],
        user_data: room.user_data
      });
    }
  }

  groups = groups.sort((a, b) => {
    if (a.user_data && a.user_data.group_order !== undefined && b.user_data && b.user_data.group_order !== undefined) {
      return a.user_data.group_order - b.user_data.group_order;
    }

    if (a.user_data && a.user_data.group_order !== undefined) {
      return -1;
    }

    if (b.user_data && b.user_data.group_order !== undefined) {
      return 1;
    }

    return 0;
  });

  for (const group of groups) {
    group.rooms = group.rooms.sort((a, b) => {
      if (a.user_data && a.user_data.room_order !== undefined && b.user_data && b.user_data.room_order !== undefined) {
        return a.user_data.room_order - b.user_data.room_order;
      }

      if (a.user_data && a.user_data.room_order !== undefined) {
        return -1;
      }

      if (b.user_data && b.user_data.room_order !== undefined) {
        return 1;
      }

      return 0;
    });

    const mainRoom = group.rooms[0];
    group.description = mainRoom.description;
    group.thumbnail = mainRoom.images && mainRoom.images.preview && mainRoom.images.preview.url;
  }

  return groups;
}
