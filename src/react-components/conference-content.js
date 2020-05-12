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
      <main className={styles.conferenceContent}>
        {/*>*/}
        <section>
          {/*className={styles.descriptionContainer}>*/}
          <div className={styles.descriptionContainer2}>
            {/*// className={styles.contentContainer}>*/}
            <div className={styles.redWrapper}>
              <div className={styles.descriptionContainerHeader}>
                {/*// className={classNames(styles.card, styles.header)}>*/}
                <img className={styles.logo} src={configs.image("company_logo")}/>
                <div className={styles.banner}>
                  {/*// className={classNames(styles.centered, styles.headercontent)}>*/}
                  <h1>Miami University</h1>
                  <h2>2020 Virtual <br/> Commencement</h2>
                  <div className={styles.browseButtonWrap}>
                    <a href="#virtual-rooms" className={classNames(styles.browseButton)}>
                      <span>Browse Rooms</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.instructions}>
              <div className={styles.steps}>
                {/*className={classNames(styles.centered, styles.contentContainer, styles.steps)}>*/}
                <dl>
                  <dt>
                    <span className={classNames(styles.circle)}>1</span>
                    <span className={classNames(styles.stepHeading)}>Step One</span>
                  </dt>
                  <dd>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi et quam feugiat, suscipit tellus
                    quis, tempus diam. Duis egestas rhoncus lectus egestas faucibus.
                  </dd>
                  <dt>
                    <span className={classNames(styles.circle)}>2</span>
                    <span className={classNames(styles.stepHeading)}>Step Two</span>
                  </dt>
                  <dd>Donec tempus augue non lacus consectetur, in ultricies sapien mollis. Donec dapibus aliquam nisl,
                    in dapibus massa dapibus quis. Pellentesque porta nisl nec velit convallis viverra.
                  </dd>
                  <dt>
                    <span className={classNames(styles.circle)}>3</span>
                    <span className={classNames(styles.stepHeading)}>Step Three</span>
                  </dt>
                  <dd>Nulla enim diam, fermentum sit amet elit quis, vehicula fringilla turpis. Praesent mattis massa
                    metus, eu pellentesque felis ultrices sed. Sed nec elit sit amet turpis egestas condimentum. Aliquam
                    vitae elit sed arcu malesuada vestibulum. Proin quis aliquet mi, quis bibendum urna.
                  </dd>
                  <dt>
                    <span className={classNames(styles.circle)}>4</span>
                    <span className={classNames(styles.stepHeading)}>Step Four</span>
                  </dt>
                  <dd>Sed at diam sed lectus luctus elementum. Donec convallis quam a molestie molestie. Nam porta id
                    leo vitae consequat. Aenean in ullamcorper magna, vel varius est. Cras vestibulum, est vitae
                    vulputate feugiat, felis ex porta lacus, ut tincidunt lacus nulla ut velit.
                  </dd>
                  <dt>
                    <span className={classNames(styles.circle)}>5</span>
                    <span className={classNames(styles.stepHeading)}>Step Five</span>
                  </dt>
                  <dd>Nullam suscipit augue ultrices rutrum porttitor. Quisque feugiat, dui ut consectetur scelerisque,
                    tortor nulla vestibulum leo, quis sodales ante ipsum eu ligula. Cras quis arcu mauris.
                  </dd>
                  <dt>
                    <span className={classNames(styles.circle)}>6</span>
                    <span className={classNames(styles.stepHeading)}>Step Six</span>
                  </dt>
                  <dd>Ut a bibendum tortor. Integer varius nisl at feugiat aliquet. Donec a dui nec tellus sagittis
                    dictum. Curabitur vitae mauris velit. Nunc elementum porttitor finibus. Ut elementum at lorem luctus
                    semper.
                  </dd>
                </dl>

                <hr />

                <div className={classNames(styles.virtualIntro)}>
                  <div className="intro-text">
                    <h2>Virtual Rooms</h2>
                    <p>Short intro paragraph here lore ipsum dolar sit amet, mea omnis dicam eu, qui ex nonumes neglegentur. Ad est altera quidam fastidi.</p>
                  </div>
                  <img src={"../assets/images/room-screenshot.png"} width={"200px"} height="115px"/>
                </div>

                <div className="rooms">
                  {
                    groupedPublicRooms.length > 0 ? (
                      groupedPublicRooms.map(group => <ConferenceRoomGroup key={group.name} group={group}/>)
                    ) : (
                      <div className={styles.spinnerContainer}>
                        <Spinner/>
                      </div>
                    )
                  }
                </div>

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
            </div>
          </div>
        </section>
      </main>
    );
  }
}
