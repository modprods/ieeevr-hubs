import React from "react";
import PropTypes from "prop-types";
import customStyles from "../../assets/stylesheets/conference-content.scss";
import ConferenceRoomGroup from "./ConferenceRoomGroup";
import { Loader } from "../misc/Loader";
function Spinner() {
  return (
    <div className="loader-wrap loader-mid">
      <div className="loader">
        <div className="loader-center"/>
      </div>
    </div>
  );
}

export function RoomList({rooms, ...rest}) {
  console.log(rooms);
  return (
    <div className="rooms" {...rest}>
    {
      rooms.length > 0 ?
        (
          rooms.map(group => <ConferenceRoomGroup key={group.name} group={group}/>) ) :
        (
          <div className={customStyles.spinnerContainer}>
            <Loader message="Finding Rooms"/>
          </div>
      )
    }
    </div>
  );
}

RoomList.propTypes = {
  room: PropTypes.object
};
