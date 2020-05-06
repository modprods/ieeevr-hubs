import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from "../assets/stylesheets/conference-content.scss";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons/faUsers";
import { faLink } from "@fortawesome/free-solid-svg-icons/faLink";
import configs from "../utils/configs";
import { createAndRedirectToNewHub } from "../utils/phoenix-utils";
import "../assets/stylesheets/loader.scss";

const maxRoomCap = configs.feature("max_room_cap") || 50;

export function groupFeaturedRooms(featuredRooms) {
  if (!featuredRooms) {
    return [];
  }

  let groups = [];

  for (const room of featuredRooms) {
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
    <li key={room.id}>
      <p className={styles.roomTitle}>{room.name}</p>
      <span>
        <FontAwesomeIcon icon={faUsers}/>
        <b>{`${room.member_count} / ${room.room_size}`}</b>
        {canSpectate ? (
          <a className={classNames(styles.joinButton)} href={room.url}>
            {canJoin ? "Join" : "Spectate"}
          </a>
        ) : (
          <p className={classNames(styles.joinButton, styles.joinButtonDisabled)}>Full</p>
        )}
      </span>
    </li>
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
      <div className={styles.item12}>
        <div className={styles.groupLeft}>
          {/*{group.name}*/}
          {/*<a href={"#" + this.state.id} className={styles.groupLink}>*/}
          {/*  <FontAwesomeIcon icon={faLink}/>*/}
          {/*</a>*/}
          {/*{group.description}*/}
          <ul className={styles.roomList}>
            {rooms.map(room => <RoomItem key={room.id} room={room}/>)}
            {!this.state.open &&
            rooms.length !== group.rooms.length && (
              <li key="show-more">
                <a href="#" onClick={this.showMore}>
                  Show more...
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
    );

    // ----
    // <div id={this.state.id} className={classNames(styles.card, styles.conferenceRoomGroup, styles.item12)}>
    //   <div className={styles.groupLeft}>
    // {/*<h2>*/}
    // {/*  {group.name}*/}
    // {/*  <a href={"#" + this.state.id} className={styles.groupLink}>*/}
    // {/*    <FontAwesomeIcon icon={faLink}/>*/}
    // {/*  </a>*/}
    // {/*</h2>*/}
    //   {group.description && <p>{group.description}</p>}
    //   <ul className={styles.roomList}>
    //     {rooms.map(room => <RoomItem key={room.id} room={room}/>)}
    //     {!this.state.open &&
    //     rooms.length !== group.rooms.length && (
    //       <li key="show-more">
    //         <a href="#" onClick={this.showMore}>
    //           Show more...
    //         </a>
    //       </li>
    //     )}
    //   </ul>
    // </div>
    // {/*<div className={styles.groupRight}>*/}
    // {/*  <img alt={group.name} src={group.thumbnail}/>*/}
    // {/*</div>*/}
    // </div>

  }
}

function Spinner() {
  return (
    <div className="loader-wrap loader-mid">
      <div className="loader">
        <div className="loader-center"/>
      </div>
    </div>
  );
}

export default class ConferenceContent extends Component {
  static propTypes = {
    publicRooms: PropTypes.array,
    favoritedRooms: PropTypes.array
  };

  constructor(props) {
    super(props);

    this.state = {
      shouldScroll: true
    };
  }

  componentDidUpdate() {
    if (!this.state.shouldScroll || !this.props.publicRooms) {
      return;
    }

    try {
      let hash = document.location.hash;

      if (hash) {
        hash = hash.replace(/[#/]/g, "");
      }

      const el = document.getElementById(hash);

      if (el) {
        el.scrollIntoView();
      }
    } catch (e) {
      // Don't scroll if there is an error getting the element.
      console.error(e);
    }

    this.setState({
      shouldScroll: false
    });
  }

  render() {
    const { publicRooms, favoritedRooms } = this.props;

    const groupedPublicRooms = groupFeaturedRooms(publicRooms);

    return (
      <main>
        {/*className={styles.conferenceContent}>*/}
        <section className={styles.descriptionContainer}>
          <div className={styles.contentContainer}>
            <div className={classNames(styles.card, styles.header)}>
              <img className={styles.logo} src={configs.image("logo")}/>
              <div className={classNames(styles.centered, styles.headercontent)}>
                <h1>Miami University</h1>
                <h2>2020 Virtual Commencement</h2>
                <a className={classNames(styles.joinButton, styles.createRoomButton)} href="#virtual-rooms">
                  Browse Rooms
                </a>
              </div>
            </div>
            <div className={classNames(styles.centered, styles.contentContainer, styles.steps)}>
              <dl>
                <dt><span className={classNames(styles.circle)}>1</span>Step One</dt>
                <dd>If you are not registered, you cannot attend in Hubs or join the conference Slack. You
                  may still watch the twitch streams. Links and information are available at{" "}
                  <a href="http://ieeevr.org/2020/online/" target="_blank" rel="noopener noreferrer">
                    http://ieeevr.org/2020/online/
                  </a>
                </dd>
                <dt><span className={classNames(styles.circle)}>2</span>Step Two</dt>
                <dd>Join the IEEE VR 2020 Slack by entering your registration email{" "}
                  <a href="https://ieeevr-slack-invite.glitch.me/" target="_blank" rel="noopener noreferrer">
                    here
                  </a>.
                </dd>
                <dt><span className={classNames(styles.circle)}>3</span>Step Three</dt>
                <dd>If you have not yet tried Hubs, go to one of the Tutorial rooms below: volunteers will
                  assist you.{" "}
                  <a href="http://ieeevr.org/2020/online/" target="_blank" rel="noopener noreferrer">
                    http://ieeevr.org/2020/online/
                  </a>{" "}
                  also has a collection FAQs, links to tutorial videos, and other information you may find useful.
                </dd>
                <dt><span className={classNames(styles.circle)}>4</span>Step four</dt>
                <dd>Put on your headphones. Echo and feedback will ruin the experience for everyone!</dd>
                <dt><span className={classNames(styles.circle)}>5</span>Step five</dt>
                <dd>Ready to attend a session? Consult the{" "}
                  <a href="http://ieeevr.org/2020/program/overview.html" target="_blank" rel="noopener noreferrer">
                    program
                  </a>{" "}
                  and the{" "}
                  <a href="http://ieeevr.org/2020/program/bof.html" target="_blank" rel="noopener noreferrer">
                    Birds-of-a-Feather/Social Schedule
                  </a>. The proceedings are also available for download{" "}
                  <a
                    href="https://conferences.computer.org/vr-tvcg/2020/#!/home"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    here
                  </a>{" "}
                  (Note: Firefox will complain about this link because the server uses an out-of-date version of TLS).
                </dd>
                <dt><span className={classNames(styles.circle)}>6</span>Step six</dt>
                <dd>For BOFs, go to the room linked from the BOF schedule. For the regular program, choose
                  one of the rooms for your track below. You can see how many people are in a room, and how many it
                  holds;
                  if you are on a lower powered device or slow internet connection, consider joining one of the smaller
                  rooms (only join one of the multi-stream rooms on a high end desktop or laptop).
                </dd>
              </dl>
            </div>
          </div>
        </section>
        <section className={styles.descriptionContainer}>
          <div className={styles.virtualRooms}>
            <div className={styles.item2}>
              <h1>Virtual Rooms</h1>
            </div>
            <div className={styles.item3}>
              this is an image
            </div>
            {groupedPublicRooms.length > 0 ? (
              groupedPublicRooms.map(group => <ConferenceRoomGroup key={group.name} group={group}/>)
            ) : (
              <div className={styles.spinnerContainer}>
                <Spinner/>
              </div>
            )}
            {/*<div className={styles.contentContainer}>*/}
            {/*  {favoritedRooms &&*/}
            {/*  favoritedRooms.length > 0 && (*/}
            {/*    <div className={styles.centered}>*/}
            {/*      <h1>Favorite Rooms</h1>*/}
            {/*      {groupFeaturedRooms(favoritedRooms).map(group => (*/}
            {/*        <ConferenceRoomGroup key={group.name} group={group}/>*/}
            {/*      ))}*/}
            {/*    </div>*/}
            {/*  )}*/}
            {/*  <div className={classNames(styles.item2, styles.centered)} id="virtual-rooms">*/}
            {/*    <h1>Virtual Rooms</h1>*/}
            {/*  </div>*/}
            {/*  {groupedPublicRooms.length > 0 ? (*/}
            {/*    groupedPublicRooms.map(group => <ConferenceRoomGroup key={group.name} group={group}/>)*/}
            {/*  ) : (*/}
            {/*    <div className={styles.spinnerContainer}>*/}
            {/*      <Spinner/>*/}
            {/*    </div>*/}
            {/*  )}*/}
            {/*  <button*/}
            {/*    className={classNames(styles.joinButton, styles.createRoomButton)}*/}
            {/*    onClick={e => {*/}
            {/*      e.preventDefault();*/}
            {/*      createAndRedirectToNewHub(null, null, false);*/}
            {/*    }}*/}
            {/*  >*/}
            {/*    Create Room*/}
            {/*  </button>*/}
            {/*</div>*/}
          </div>
        </section>
      </main>
    );
  }
}
