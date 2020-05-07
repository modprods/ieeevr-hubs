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
            <div className={styles.descriptionContainerHeader}>
              {/*// className={classNames(styles.card, styles.header)}>*/}
              <img className={styles.logo} src={configs.image("logo")}/>
              <div className={styles.banner}>
                {/*// className={classNames(styles.centered, styles.headercontent)}>*/}
                <h1>Miami University</h1>
                <h2>2020 Virtual Commencement</h2>
                <a className={classNames(styles.joinButton)} href="#virtual-rooms">
                  Browse Rooms
                </a>
              </div>
            </div>
            <div className={styles.instructions}>
              <div className={styles.steps}>
                {/*className={classNames(styles.centered, styles.contentContainer, styles.steps)}>*/}
                <dl>
                  <dt><span className={classNames(styles.circle)}>1</span>Step One</dt>
                  <dd>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi et quam feugiat, suscipit tellus
                    quis, tempus diam. Duis egestas rhoncus lectus egestas faucibus. Aliquam molestie, dolor faucibus
                    sodales dictum, risus eros scelerisque eros, vitae sollicitudin tortor turpis eu augue. Phasellus
                    eget enim mollis, varius libero non, finibus dui. Aenean semper auctor vulputate. Vivamus quis lacus
                    non sapien auctor venenatis. Cras erat nulla, consectetur sit amet magna eget, volutpat ornare
                    sapien.
                  </dd>
                  <dt><span className={classNames(styles.circle)}>2</span>Step Two</dt>
                  <dd>Donec tempus augue non lacus consectetur, in ultricies sapien mollis. Donec dapibus aliquam nisl,
                    in dapibus massa dapibus quis. Pellentesque porta nisl nec velit convallis viverra. Aliquam
                    eleifend, lectus ut convallis tempus, libero nisi accumsan ante, sed laoreet leo lectus sed sem.
                    Suspendisse potenti. Nulla ut sagittis purus, in iaculis lectus. In ornare, tellus non ultrices
                    placerat, quam sem ultricies justo, eu euismod neque sapien ac velit. Ut efficitur id arcu id
                    hendrerit.
                  </dd>
                  <dt><span className={classNames(styles.circle)}>3</span>Step Three</dt>
                  <dd>Nulla enim diam, fermentum sit amet elit quis, vehicula fringilla turpis. Praesent mattis massa
                    metus, eu pellentesque felis ultrices sed. Sed nec elit sit amet turpis egestas condimentum. Aliquam
                    vitae elit sed arcu malesuada vestibulum. Proin quis aliquet mi, quis bibendum urna. Morbi convallis
                    velit ac orci aliquet mollis. Aliquam quis tortor facilisis, finibus lacus ut, congue augue. Nulla
                    nulla purus, aliquet sed velit in, ullamcorper accumsan mauris. Maecenas et congue dolor, sed
                    hendrerit nisl. Suspendisse accumsan, turpis eu vulputate tempor, odio eros cursus diam, sit amet
                    accumsan diam est vitae massa. Nulla venenatis venenatis quam eu laoreet. In ultrices velit lorem.
                  </dd>
                  <dt><span className={classNames(styles.circle)}>4</span>Step four</dt>
                  <dd>Sed at diam sed lectus luctus elementum. Donec convallis quam a molestie molestie. Nam porta id
                    leo vitae consequat. Aenean in ullamcorper magna, vel varius est. Cras vestibulum, est vitae
                    vulputate feugiat, felis ex porta lacus, ut tincidunt lacus nulla ut velit. Ut quis nulla lacus. Nam
                    condimentum rhoncus nisl eu lacinia. Maecenas tristique finibus ipsum vel dapibus. Donec quis
                    sagittis ipsum.
                  </dd>
                  <dt><span className={classNames(styles.circle)}>5</span>Step five</dt>
                  <dd>Nullam suscipit augue ultrices rutrum porttitor. Quisque feugiat, dui ut consectetur scelerisque,
                    tortor nulla vestibulum leo, quis sodales ante ipsum eu ligula. Cras quis arcu mauris. Donec
                    hendrerit mi facilisis vehicula dapibus. Curabitur non purus lacinia, ornare orci id, lacinia sem.
                    Etiam facilisis lacus at orci varius, at pharetra leo porta. Vivamus sem ipsum, pretium quis
                    volutpat eget, gravida in metus. Fusce ac egestas nunc, vel cursus magna.
                  </dd>
                  <dt><span className={classNames(styles.circle)}>6</span>Step six</dt>
                  <dd>Ut a bibendum tortor. Integer varius nisl at feugiat aliquet. Donec a dui nec tellus sagittis
                    dictum. Curabitur vitae mauris velit. Nunc elementum porttitor finibus. Ut elementum at lorem luctus
                    semper. Nam et lacus non nibh imperdiet interdum. In pulvinar massa aliquet erat ullamcorper
                    placerat. Morbi non risus vel libero malesuada consectetur. Mauris volutpat tellus ut nisl luctus,
                    at suscipit quam dictum. Cras id elementum neque.
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </section>
        <section>
          {/*className={styles.descriptionContainer}>*/}
          <div id="virtual-rooms" className={styles.virtualRoomsSection}>
            <div className={styles.virtualRoomsSectionHeader}>
              <h1>Virtual Rooms</h1>
            </div>
            <div className={styles.virtualRoomsSectionContainer}>
              <div className={styles.virtualRoomsGroup}>
                <div className={styles.item12}>
                  <h2>Virtual Commencement Rooms</h2>
                  {groupedPublicRooms.length > 0 ? (
                    groupedPublicRooms.map(group => <ConferenceRoomGroup key={group.name} group={group}/>)
                  ) : (
                    <div className={styles.spinnerContainer}>
                      <Spinner/>
                    </div>
                  )}
                </div>
                <div className={styles.item3}>
                  <img src={"../assets/images/Room_Screenshot.png"} width={"250px"} height={"150px"}/>
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
