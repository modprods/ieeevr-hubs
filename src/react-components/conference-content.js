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
                <img className={styles.logo} src={"../assets/images/company-logo-white-2x.png"}/>
                <div className={styles.banner}>
                  {/*// className={classNames(styles.centered, styles.headercontent)}>*/}
                  <h1>2020 Virtual <br/> Commencement</h1>
                  <div className={styles.browseButtonWrap}>
                    <a href="#virtual-rooms" className={classNames(styles.browseButton)}>
                      <span>Browse Rooms</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round">
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
                    <span className={classNames(styles.stepHeading)}>Before you get started</span>
                  </dt>
                  <dd>
                    <ul>
                      <li>Know your unique id email address and have your email open/ready to access.</li>
                      <li>For the best experience possible, we recommend using:</li>
                      <ul>
                        <li>A relatively new laptop or desktop computer with a reliable internet connection</li>
                        <li>The latest Firefox browser.</li>
                      </ul>
                    </ul>
                    <p>While the virtual rooms work with most devices and web browsers, including Google Chrome and Safari, using low-powered devices such as mobile phones, tablets, and laptops (2015 and older) may impact your experience.</p>
                  </dd>
                  <dt>
                    <span className={classNames(styles.circle)}>2</span>
                    <span className={classNames(styles.stepHeading)}>Find a Room</span>
                  </dt>
                  <dd>
                    <p>You can experience commencement in <b>any</b> of the identical virtual rooms. Each room can hold up to 20 people.
                    Think of these as different sections of the same auditorium.
                    All of the rooms will see the same content, but you will only be able to interact with people in the same room as you.</p>
                    <p>To choose a room, scroll to the bottom of the page where you will see a list of rooms and how many people are in each (out of the 20 person max).
                      We encourage you to coordinate with your friends to choose a room that can fit your group so you can enjoy the experience together.
                      Once you’ve decided on a room, click <b>"Join"</b> to enter.</p>
                  </dd>
                  <dt>
                    <span className={classNames(styles.circle)}>3</span>
                    <span className={classNames(styles.stepHeading)}>Logging onto the virtual rooms</span>
                  </dt>
                  <dd>
                    <p>Once you’ve clicked <b>Join</b>, you will be asked to enter your Miami University <b>unique ID email address</b> to log in.
                    You will receive an email with the subject <b>"Your Miami University Virtual Commencement Sign-In Link"</b> that will contain a login link.
                    Clicking the login link will open a new browser tab/window where you should get a message saying <b>"Email Verified"</b>.
                    You can then close the verification tab tab/window and navigate back to the virtual room tab and click <b>"Enter Room"</b>.
                    </p>
                  </dd>
                  <dt>
                    <span className={classNames(styles.circle)}>4</span>
                    <span className={classNames(styles.stepHeading)}>Creating a Name and Choosing an Avatar</span>
                  </dt>
                  <dd>
                    <p>Once inside your room, you will be asked to enter your name and choose your avatar, both of which will be visible to others in the room.
                      We recommend you use your real First and Last name to help others identify you.
                      To see available avatar options, click <b>"Browse Avatars"</b> and click on your desired choice.
                    </p>
                  </dd>
                  <dt>
                    <span className={classNames(styles.circle)}>5</span>
                    <span className={classNames(styles.stepHeading)}>Setting up Communication Settings</span>
                  </dt>
                  <dd>
                    <p>Once you have created a name and chosen an avatar, click <b>"Enter on Screen"</b> (or <b>"Connect VR Headset"</b> for VR headset users).
                      You will then be asked to grant mic permissions. To grant mic permissions, click <b>Allow</b>,
                      (Clicking <b>Block</b> will prevent you from using your microphone to communicate to others in the room) then click <b>"Next"</b>.
                      If you have multiple microphones, this screen will allow you to choose which one to use.
                      If you don’t know what to select, simply continue with Default. If your microphone is working,
                      you should see a blue level indicator inside the microphone icon when you speak.
                      Click the speaker to test your speakers or headphones. When you are done, click <b>"Enter Now"</b>
                    </p>
                  </dd>
                  <dt>
                    <span className={classNames(styles.circle)}>6</span>
                    <span className={classNames(styles.stepHeading)}>Moving Around the virtual space</span>
                  </dt>
                  <dd>
                    <p>Once you are in a  virtual room, use the controls below to move around the room</p>
                    <ul>
                      <li>To walk, use <b>WASD keyboard controls</b> like you would a first person game. (W moves forward, A moves left, S moves backward, D moves right.)</li>
                      <li>To move faster, hold down <b>SHIFT</b> as you move.</li>
                      <li>To look left, right, up and down, <b>CLICK AND DRAG</b> using the <b>LEFT MOUSE BUTTON.</b></li>
                    </ul>
                  </dd>
                  <dt>
                    <span className={classNames(styles.circle)}>7</span>
                    <span className={classNames(styles.stepHeading)}>Communicating and Interacting with others</span>
                  </dt>
                  <dd>
                    <p><b>Please Note:</b> <i>The ceremony includes a live text or audio chat feature. We recommend using the text chat feature to ensure the most accessible experience for all participants.</i></p>
                    <p>Once inside a room, you can communicate with other individuals as if you were in a real space.
                      To talk to others via text chat, type in the translucent text bar at the bottom of the screen and press <b>ENTER</b>.
                      Your message will then be displayed in the main chat window to the rest of the room. 
                    </p>
                    <p>To Adjust the volume of the video, hover your mouse over the middle screen and click on the <b>"+" and "-" buttons</b></p>
                  </dd>
                  <dt>
                    <span className={classNames(styles.circle)}>8</span>
                    <span className={classNames(styles.stepHeading)}>Changing and Leaving Rooms</span>
                  </dt>
                  <dd>
                    <p>To move to a different room, simply navigate back to this page, by either hitting the back button,
                      or by going to miamioh-gradify.com, and select <b>"Join"</b> another room. You will not need to repeat the sign in process. </p>
                    <p>To leave a room, simply close the tab or window in your browser. </p>
                  </dd>
                  <dt>
                    <span className={classNames(styles.circle)}>9</span>
                    <span className={classNames(styles.stepHeading)}>Support and Reporting Misconduct</span>
                  </dt>
                  <dd>
                    <p>If you are having trouble, try refreshing the page and re-entering the room.
                      If you are still having trouble, you can chat with us in the bottom right corner of the page,
                      or by emailing <a href="mailto:support@subvrsive.com">support@subvrsive.com</a>
                    </p>
                    <p>Faculty and Staff will be present in the virtual rooms to moderate the experience.
                      To report inappropriate behavior, or misconduct, email <a href="mailto:eventconduct@subvrsive.com">eventconduct@subvrsive.com</a> and include
                      the full display name of the person causing a problem as well as the name of the room where the issue is taking place. 
                    </p>
                  </dd>
                </dl>

                <hr />

                <div className={classNames(styles.virtualIntro)}>
                  <div className="intro-text">
                    <h2 id="virtual-rooms">Virtual Rooms</h2>
                    <p>Join one of the following rooms.</p>
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
