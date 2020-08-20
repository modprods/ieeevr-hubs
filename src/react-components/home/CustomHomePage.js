import React, { useContext, useEffect } from "react";
import { FormattedMessage, addLocaleData } from "react-intl";
import en from "react-intl/locale-data/en";
import classNames from "classnames";
import configs from "../../utils/configs";
import IfFeature from "../if-feature";
import { Page } from "../layout/Page";
import { CreateRoomButton } from "./CreateRoomButton";
import { PWAButton } from "./PWAButton";
import { useFavoriteRooms } from "./useFavoriteRooms";
import { usePublicRooms } from "./usePublicRooms";
import styles from "./HomePage.scss";
import customeStyles from "../../assets/stylesheets/conference-content.scss";
import discordLogoUrl from "../../assets/images/discord-logo-small.png";
import { AuthContext } from "../auth/AuthContext";
import { createAndRedirectToNewHub } from "../../utils/phoenix-utils";
import { MediaGrid } from "./MediaGrid";
import { RoomTile } from "./RoomTile";

addLocaleData([...en]);

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
      <div className={customeStyles.item12}>
        <div className={customeStyles.groupLeft}>
          <ul className={customeStyles.roomList}>
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

export function CustomHomePage() {
  const auth = useContext(AuthContext);

  const { results: favoriteRooms } = useFavoriteRooms();
  const { results: publicRooms } = usePublicRooms();

  const featuredRooms = Array.from(new Set([...favoriteRooms, ...publicRooms])).sort(
    (a, b) => b.member_count - a.member_count
  );

  useEffect(() => {
    const qs = new URLSearchParams(location.search);

    // Support legacy sign in urls.
    if (qs.has("sign_in")) {
      const redirectUrl = new URL("/signin", window.location);
      redirectUrl.search = location.search;
      window.location = redirectUrl;
    } else if (qs.has("auth_topic")) {
      const redirectUrl = new URL("/verify", window.location);
      redirectUrl.search = location.search;
      window.location = redirectUrl;
    }

    if (qs.has("new")) {
      createAndRedirectToNewHub(null, null, true);
    }
  }, []);

  const canCreateRooms = !configs.feature("disable_room_creation") || auth.isAdmin;

  const pageStyle = { backgroundImage: configs.image("home_background", true) };

  const logoUrl = configs.image("logo");

  const showDescription = featuredRooms.length === 0;

  const logoStyles = classNames(styles.logoContainer, {
    [styles.centerLogo]: !showDescription
  });

  return (
    <main className={customeStyles.conferenceContent}>
      <section>
        <div className={customeStyles.descriptionContainer2}>
          <div className={customeStyles.redWrapper}>
            <div className={customeStyles.descriptionContainerHeader}>
              <img className={customeStyles.logo} src={"../assets/images/company-logo-white-2x.png"}/>
              <div className={customeStyles.banner}>
                <h1>2020 Virtual <br/> Commencement</h1>
                <div className={customeStyles.browseButtonWrap}>
                  <a href="#virtual-rooms" className={classNames(customeStyles.browseButton)}>
                    <span>Browse Rooms</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className={customeStyles.instructions}>
            <div className={customeStyles.steps}>
              <dl>
                <dt>
                  <span className={classNames(customeStyles.circle)}>1</span>
                  <span className={classNames(customeStyles.stepHeading)}>Before you get started</span>
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
                  <span className={classNames(customeStyles.circle)}>2</span>
                  <span className={classNames(customeStyles.stepHeading)}>Find a Room</span>
                </dt>
                <dd>
                  <p>You can experience commencement in <b>any of the identical virtual rooms</b>. Each room can hold up to 20 people.
                  Think of these as different sections of the same auditorium.
                  All of the rooms will see the same content, but you will only be able to interact with people in the same room as you.</p>
                  <p>To choose a room, scroll to the bottom of the page where you will see a list of rooms and how many people are in each (out of the 20 person max).
                    We encourage you to coordinate with your friends to choose a room that can fit your group so you can enjoy the experience together.
                    Once you’ve decided on a room, click <b>"Join"</b> to enter.</p>
                </dd>
                <dt>
                  <span className={classNames(customeStyles.circle)}>3</span>
                  <span className={classNames(customeStyles.stepHeading)}>Logging onto the virtual rooms</span>
                </dt>
                <dd>
                  <p>Once you’ve clicked "<b>Join</b>", you will be asked to enter your Miami University <b>unique ID email address</b> to log in.
                  You will receive an email with the subject <b>"Your Miami University Virtual Commencement Sign-In Link"</b> that will contain a login link.
                  Clicking the login link will open a new browser tab/window where you should get a message saying <b>"Email Verified"</b>.
                  You can then close the verification tab tab/window and navigate back to the virtual room tab and click <b>"Enter Room"</b>.
                  </p>
                  <p>By entering this virtual environment, you acknowledge that you have read, understood, and agreed to abide by the <u><b>Virtual Commencement Code of Conduct</b></u>.
                  </p>
                </dd>
                <dt>
                  <span className={classNames(customeStyles.circle)}>4</span>
                  <span className={classNames(customeStyles.stepHeading)}>Creating a Name and Choosing an Avatar</span>
                </dt>
                <dd>
                  <p>Once inside your room, you will be asked to enter your name and choose your avatar, both of which will be visible to others in the room.
                    We recommend you use your real First and Last name to help others identify you.
                    To see available avatar options, click <b>"Browse Avatars"</b> and click on your desired choice.
                  </p>
                </dd>
                <dt>
                  <span className={classNames(customeStyles.circle)}>5</span>
                  <span className={classNames(customeStyles.stepHeading)}>Setting up Communication Settings</span>
                </dt>
                <dd>
                  <p>Once you have created a name and chosen an avatar, click <b>"Enter on Screen"</b> (or <b>"Connect VR Headset"</b> for VR headset users).
                    You will then be asked to grant mic permissions. To grant mic permissions, click <b>"Allow"</b>,
                    (Clicking <b>"Block"</b> will prevent you from using your microphone to communicate to others in the room) then click <b>"Next"</b>.
                    If you have multiple microphones, this screen will allow you to choose which one to use.
                    If you don’t know what to select, simply continue with Default. If your microphone is working,
                    you should see a blue level indicator inside the microphone icon when you speak.
                    Click the speaker to test your speakers or headphones. When you are done, click <b>"Enter Now"</b>
                  </p>
                </dd>
                <dt>
                  <span className={classNames(customeStyles.circle)}>6</span>
                  <span className={classNames(customeStyles.stepHeading)}>Moving Around the virtual space</span>
                </dt>
                <dd>
                  <p>Once you are in a  virtual room, use the controls below to move around the room</p>
                  <ul>
                    <li>Laptop / Desktop Controls:
                      <ul>
                      <li>To walk, use <b>WASD keyboard controls</b> like you would a first person game. (<b>W</b> moves forward, <b>A</b> moves left, <b>S</b> moves backward, <b>D</b> moves right.)</li>
                      <li>To move faster, hold down <b>SHIFT</b> as you move.</li>
                      <li>To look left, right, up and down, <b>CLICK AND DRAG</b> using the <b>LEFT MOUSE BUTTON.</b></li>
                      </ul>
                    </li>
                    <li>Mobile Controls:
                    <ul>
                      <li>To walk, use two fingers to <b>MAKE A PINCH OPEN GESTURE</b></li>
                      <li>To look left, right, up, and down, <b>SWIPE AROUND</b> the screen with <b>ONE FINGER</b></li>
                    </ul>
                      </li>
                  </ul>
                </dd>
                <dt>
                  <span className={classNames(customeStyles.circle)}>7</span>
                  <span className={classNames(customeStyles.stepHeading)}>Communicating and Interacting with others</span>
                </dt>
                <dd>
                  <p><b>Please Note:</b> The ceremony includes a live text or audio chat feature. We recommend using the text chat feature to ensure the most accessible experience for all participants.</p>
                  <p>Once inside a room, you can communicate with other individuals as if you were in a real space.
                    To talk to others via text chat, type in the translucent text bar at the bottom of the screen and press the <b>"ENTER KEY"</b>.
                    Your message will then be displayed in the main chat window to the rest of the room.
                  </p>
                  <ul>
                    <li>To Adjust the volume of the video, hover your mouse over the middle screen and click on the <b>"+" and "-" buttons</b>
                    </li>
                    <li>To adjust your Name and Avatar Preferences (and additional settings), click on the Menu button in the top left corner of your window.
                    </li>
                  </ul>

                </dd>
                <dt>
                  <span className={classNames(customeStyles.circle)}>8</span>
                  <span className={classNames(customeStyles.stepHeading)}>Changing and Leaving Rooms</span>
                </dt>
                <dd>
                  <p>To move to a different room, simply navigate back to this page, by either hitting the back button,
                    or by going to miamioh-gradify.com, and select <b>"Join"</b> another room. You will not need to repeat the sign in process. </p>
                  <p>To leave a room, simply close the tab or window in your browser. </p>
                </dd>
                <dt>
                  <span className={classNames(customeStyles.circle)}>9</span>
                  <span className={classNames(customeStyles.stepHeading)}>Support and Reporting Misconduct</span>
                </dt>
                <dd>
                  <p>If you are having trouble, try refreshing the page and re-entering the room.
                    If you are still having trouble, you can chat with us at <a href="https://subvrsive.com/miami-university">subvrsive.com/miami-university</a> or
                     by emailing <a href="mailto:support@subvrsive.com">support@subvrsive.com</a>
                  </p>
                  <p>With sign in, all users agree to abide by the <u><b>Virtual Commencement Code of Conduct</b></u>. Report any violations of the Code of Student Conduct
                    to the Office of Community Standards at CommunityStandards@Miamioh.edu. This includes conduct that is defamatory, harassing or discriminatory, obscene, or is inciting or facilitating violence including threats of violence or harm and intimidation.
                  </p>
                </dd>
              </dl>

              <hr />

              <div className={classNames(customeStyles.virtualIntro)}>
                <div className="intro-text">
                  <h2 id="virtual-rooms">Virtual Commencement Rooms</h2>
                  <p>Click <b>“Join”</b> to enter a room. If a room says <b>“Spectate”</b>, that room is full and you should choose a different room.</p>
                </div>
                <img src={"../assets/images/room-screenshot.png"} width={"200px"} height="115px"/>
              </div>

              <div className="rooms">
                {
                  groupedPublicRooms.length > 0 ? (
                    groupedPublicRooms.map(group => <ConferenceRoomGroup key={group.name} group={group}/>)
                  ) : (
                    <div className={customeStyles.spinnerContainer}>
                      <Spinner/>
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
