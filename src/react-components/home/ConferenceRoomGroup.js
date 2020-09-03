import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from "../../assets/stylesheets/conference-content.scss";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons/faUsers";
import { faLink } from "@fortawesome/free-solid-svg-icons/faLink";
import configs from "../../utils/configs";
import { createAndRedirectToNewHub } from "../../utils/phoenix-utils";
import "../../assets/stylesheets/loader.scss";
import '../../assets/stylesheets/common.css';
import '../../assets/stylesheets/help.css';
import '../../assets/stylesheets/home.css';

const maxRoomCap = configs.feature("max_room_cap") || 50;

export function makeSlug(name) {
  let slug = name.toLowerCase();

  // Remove non-word characters
  slug = slug.replace(/[^a-z0-9\s-_]/gi, "");

  // Reduce to single whitespace
  slug = slug.replace(/[\s-]+/g, " ");

  // Replace whitespace and underscores with dashes
  slug = slug.replace(/[\s_]+/g, "-");

  return slug;
}

function RoomItem({ room }) {
  let canSpectate = true;
  let canJoin = true;

  if (room.member_count + room.lobby_count >= maxRoomCap) {
    canSpectate = false;
  }

  if (room.member_count >= room.room_size) {
    canJoin = false;
  }

  return (
    <div class="room_div flex_horizontal">
        <div class="room_title">{room.name}</div>
        <div class="growing_div"></div>
        <img src={"../../assets/images/home/IconPeople.svg"}/>
        <div class="room_count">{`${room.member_count} / ${room.room_size}`}</div>
        {canSpectate ? (
          <button class="blue_button join_room_button" onClick={() => {location.href=room.url}}>
            {canJoin ? "Join" : "Spectate"}
          </button>
        ) : (
          <p className={classNames(styles.joinButton, styles.joinButtonDisabled)}>Full</p>
        )}
    </div>
  );
}

class ConferenceRoomGroup extends Component {
  static propTypes = {
    group: PropTypes.object
  };

  constructor(props) {
    super(props);

    const groupName = props.group.name;

    let open = true;

    if (groupName.startsWith("Track ") || groupName.startsWith("Three Conference Streams")) {
      open = false;
    }

    this.state = {
      id: makeSlug(groupName),
      open
    };
  }

  showMore = e => {
    e.preventDefault();
    this.setState({ open: true });
  };

  render() {
    const { group } = this.props;

    let rooms;

    if (this.state.open) {
      rooms = group.rooms;
    } else {
      rooms = [];
      let emptyRooms = 0;

      for (let i = 0; i < group.rooms.length; i++) {
        const room = group.rooms[i];

        if (room.member_count > 0) {
          rooms.push(room);
        } else if (emptyRooms < 3) {
          rooms.push(room);
          emptyRooms++;
        }
      }
    }

    return (
      <>
        {rooms.map(room => <RoomItem key={room.id} room={room}/>)}
      </>
    );
  }
}

export default ConferenceRoomGroup;
