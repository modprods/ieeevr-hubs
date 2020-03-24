import React, { Component } from "react";
import PropTypes from "prop-types";
import { IntlProvider, FormattedMessage } from "react-intl";
import UnlessFeature from "./unless-feature";
import { makeSlug, groupFeaturedRooms } from "./conference-content";

import configs from "../utils/configs";
import { lang, messages } from "../utils/i18n";
import loaderStyles from "../assets/stylesheets/loader.scss";

const maxRoomCap = configs.feature("max_room_cap") || 50;

export default class ShardPage extends Component {
  static propTypes = {
    shardId: PropTypes.string,
    publicRooms: PropTypes.array
  };

  componentDidUpdate() {
    const { shardId, publicRooms } = this.props;

    if (!publicRooms) {
      return;
    }

    const groups = groupFeaturedRooms(publicRooms);

    let redirectUrl = "/";

    for (const group of groups) {
      if (makeSlug(group.name) === shardId) {
        // Get the list of all the occupied rooms that aren't full and sort them by number of users in ascending order.
        const sortedOccupiedRooms = group.rooms
          .filter(room => room.member_count < room.room_size && room.member_count > 0)
          .sort((a, b) => a.member_count - b.member_count);

        let room;

        if (sortedOccupiedRooms.length > 0) {
          room = sortedOccupiedRooms[0];

          // If the room is over 50% full give a 50% chance to move the user to an unoccupied room.
          if (room.member_count > room.room_size / 2 && Math.random() > 0.5) {
            const unoccupiedRooms = group.rooms.filter(room => room.member_count === 0);

            // If there is an unoccupied room availible pick one at random
            if (unoccupiedRooms.length > 0) {
              const index = Math.round(Math.random() * unoccupiedRooms.length);
              room = unoccupiedRooms[index];
            }

            // Otherwise just put the user in the occupied room
          }
        } else {
          const emptyRooms = group.rooms.filter(room => room.member_count === 0);

          // Otherwise pick an empty room at random.
          if (emptyRooms.length > 0) {
            const index = Math.round(Math.random() * emptyRooms.length);
            room = emptyRooms[index];
          } else {
            const spectatorRooms = group.rooms.filter(room => room.member_count + room.lobby_count < maxRoomCap);

            // If there are no empty rooms, just put the user in any room that has space for a spectator
            if (spectatorRooms.length > 0) {
              const index = Math.round(Math.random() * spectatorRooms.length);
              room = spectatorRooms[index];
            }
          }
        }

        if (room) {
          redirectUrl = room.url;
        }

        // If all the rooms are full, redirect the user to the homepage

        break;
      }
    }

    location.href = redirectUrl;
  }

  render() {
    return (
      <IntlProvider locale={lang} messages={messages}>
        <div className="loading-panel">
          <img className="loading-panel__logo" src={configs.image("logo")} />
          <UnlessFeature name="hide_powered_by">
            <div className="loading-panel__powered-by">
              <span className="loading-panel__powered-by__prefix">
                <FormattedMessage id="home.powered_by_prefix" />
              </span>
              <a href="https://hubs.mozilla.com/cloud">
                <FormattedMessage id="home.powered_by_link" />
              </a>
            </div>
          </UnlessFeature>

          <h4 className={loaderStyles.loadingText}>
            <FormattedMessage id="loader.loading" />
            ...
          </h4>

          <div className="loader-wrap loader-bottom">
            <div className="loader">
              <div className="loader-center" />
            </div>
          </div>
        </div>
      </IntlProvider>
    );
  }
}
