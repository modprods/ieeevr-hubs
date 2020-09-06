import React from "react";
import PropTypes from "prop-types";
import customStyles from "../../assets/stylesheets/conference-content.scss";
import ConferenceRoomGroup from "./ConferenceRoomGroup";
import { Loader } from "../misc/Loader";
import '../../assets/stylesheets/common.css';
import '../../assets/stylesheets/help.css';
import '../../assets/stylesheets/home.css';

export function RoomList({rooms, ...rest}) {
  return (
    <>
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
    </>
  );
}

RoomList.propTypes = {
  room: PropTypes.object
};
