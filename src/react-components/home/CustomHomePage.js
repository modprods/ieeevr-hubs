import React, { useContext, useEffect, useState } from "react";
import { addLocaleData } from "react-intl";
import en from "react-intl/locale-data/en";
import { usePublicRooms } from "./usePublicRooms";
import { RoomList } from "./RoomList";
import { GroupFeaturedRooms } from "../misc/GroupFeaturedRooms"
import IconFile from '../../assets/images/home/IconFile.svg';
import IconRocket from '../../assets/images/home/IconRocket.svg';
import IconPeople from '../../assets/images/home/IconPeople.svg';
import '../../assets/stylesheets/common.css';
import '../../assets/stylesheets/common_mobile.css';
import '../../assets/stylesheets/home.css';
import '../../assets/stylesheets/home_mobile.css';
import { Page } from '../layout/Page'
import { AuthContext } from "../auth/AuthContext";
import { FormattedMessage } from "react-intl";
import { createAndRedirectToNewHub } from "../../utils/phoenix-utils";
import maskEmail from "../../utils/mask-email";

addLocaleData([...en]);

export function CustomHomePage() {
  const auth = useContext(AuthContext);
  const { results: publicRooms } = usePublicRooms();
  const groupedPublicRooms = GroupFeaturedRooms(publicRooms);
  const [showHome, setShowHome] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  function openNav() {
    document.getElementById("myNav").style.width = "100%";
  }

  /* Close when someone clicks on the "x" symbol inside the overlay */
  function closeNav() {
    document.getElementById("myNav").style.width = "0%";
  }

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


  return (
    <>
    {/* Header */}
    <div class="header flex_horizontal">
        <img class="header_logo" src={"../../assets/images/Logo.svg"}/>
        <img />
        <div class="growing_div"></div>

          {auth.isSignedIn ? (
            <div>
              <span>
                <FormattedMessage id="sign-in.as" /> {maskEmail(auth.email)}
              </span>{" "}
              <a href="#" onClick={auth.signOut}>
                <FormattedMessage id="sign-in.out" />
              </a>
            </div>
          ) : (
            <button class="header_button transparent_header_button desktop_only" onClick={(e) => {
                                                                                      e.preventDefault();
                                                                                      window.location.href='/signin';
                                                                                      }}>
                Sign In
            </button>
          )}

        <button class="header_button transparent_header_button desktop_only" onClick={() => {setShowHome(false)}}>
            Help
        </button>

        <button class="header_button blue_button desktop_only" onClick={() => {setShowHome(true)}}>
            Event Home
        </button>

        <div class="mobile_only" onClick={openNav}>
          X {/* PLaceholder for icon */}
        </div>

        {/* Mobile Menu */}
        <div id="myNav" class="overlay">
          <div class="mobile_only" onClick={closeNav}>
            X {/* PLaceholder for icon */}
          </div>
          <button class="mobile_menu_item mobile_only" onClick={(e) => {
                                                                        e.preventDefault();
                                                                        window.location.href='/signin';
                                                                        closeNav();}}>
            Sign In
          </button>
          <button class="mobile_menu_item mobile_only" onClick={() => {setShowHome(false); closeNav()}}>
            Help
          </button>
          <button class="mobile_menu_item mobile_only" onClick={() => {setShowHome(true); closeNav();}}>
            Event Home
          </button>
        </div>
        {/* End of Mobile Menu */}

      </div>
      {/* End of Header */}

      {/* Main Page */}
      {showHome ?
      <Page>
        <div class="flex_vertical">

            {/* Body */}
            <div class="flex_horizontal instructions_div mobile_vertical mobile_vertically_centered">
                <div class="growing_div"></div>
                <img class="rocket_image" src={"../../assets/images/home/LargeRocket.svg"}/>
                <div class="growing_div"></div>
                <div class="flex_vertical welcome_instructions">
                    <div class="flex_vertical flex_center_vertically instructions_title">
                        <h1 class="h1_large">Welcome</h1>
                        <div class="centered_subtitle_text" style={{marginTop: '0px'}}>
                            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt
                            ut
                            <br />labore et dolore magna aliquyam erat, sed diam voluptua.
                        </div>
                    </div>
                    <div class="flex_horizontal mobile_vertical">
                        <div class="instruction_icon" style={{background: "url(" + IconFile +") no-repeat center/contain"}}></div>
                        <div class="flex_vertical">
                            <h3>Step 1. Signing In</h3>
                            <div class="instructions_text">
                                Know your unique id email address and have your email open/ready to access. For the best
                                experience possible, we recommend using a relatively new laptop or desktop computer with a
                                reliable internet connection
                            </div>
                        </div>
                    </div>
                    <div class="flex_horizontal mobile_vertical">
                        <div class="instruction_icon" style={{background: "url("+ IconRocket + ") no-repeat center/contain"}}></div>
                        <div class="flex_vertical">
                            <h3>Step 2. Entering A Room</h3>
                            <div class="instructions_text">
                                To choose a room, scroll to the bottom of the page where you will see a list of rooms and
                                how many people are in each (out of the 20 person max). Once you’ve clicked “Join”, you will
                                be asked to enter your CB Insights unique ID email address to log in. You will receive an
                                email with the subject “Your CB Inisights Sign-In Link” that will contain a login link.
                            </div>
                        </div>
                    </div>
                    <div class="flex_horizontal mobile_vertical">
                        <div class="instruction_icon" style={{background: "url(" + IconPeople + ") no-repeat center/contain"}}></div>
                        <div class="flex_vertical">
                            <h3>Step 3. Network</h3>
                            <div class="instructions_text">
                                Once inside your room, you will be asked to enter your name and choose your avatar, both of
                                which will be visible to others in the room. Once you have created a name and chosen an
                                avatar, click “Enter on Screen” You will then be asked to grant mic permissions.
                            </div>
                        </div>
                    </div>
                </div>
                <div class="growing_div"></div>
            </div>
            <div class="home_content mobile_vertically_centered">
                <h2>Keynote</h2>
                <div class="h2_subtitle">Sept. 23, 6:30-7:00 pm ET</div>
                <div class="room_collection_description">
                    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
                    <br/>invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
                </div>
            </div>
            <div class="room_list flex_horizontal">
                <RoomList rooms={groupedPublicRooms}/>
            </div>
            <div class="home_content mobile_vertically_centered">
                <h2>Networking</h2>
                <div class="h2_subtitle">Sept. 23, 6:30-7:00 pm ET</div>
                <div class="room_collection_description">
                    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
                    <br/>invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
                </div>
            </div>
            <div class="room_list flex_horizontal">
                <RoomList rooms={groupedPublicRooms}/>
            </div>
            <div class="flex_vertical">
                <h1>Need Help Accessing the VR World?</h1>
                <h1 class="h1_subtitle">Click below for full instructions.</h1>
                <button class="blue_button help_button_bottom" onClick={() => {setShowHome(false)}}>Help</button>
            </div>
            {/* End of Body */}

        </div>
      </Page> :

      <Page>
        <div class="flex_vertical">

            {/* Body */}
            <div class="flex_vertical heading_container">
                <h1 class="h1_large">Having Trouble?</h1>
                <h1 class="h1_large">We Can help.</h1>
                <div class="centered_subtitle_text">
                    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
                    <br />tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
                </div>
            </div>
            <div class="flex_vertical help_content mobile_vertically_centered">
                <div class="flex_horizontal mobile_vertical help_dotpoint_container mobile_vertically_centered">
                    <div class="help_dotpoint_num">
                        1.
                    </div>
                    <div class="flex_vertical">
                        <h2>Before You Get Started</h2>
                        <div>
                            Know your unique id email address and have your email open/ready to access.
                            For the best experience possible, we recommend using:
                            A relatively new laptop or desktop computer with a reliable internet connection
                            The latest Firefox browser.
                            While the virtual rooms work with most devices and web browsers, including Google Chrome
                            and
                            Safari, using low-powered devices such as mobile phones, tablets, and laptops (2015 and
                            older)
                            may impact your experience.
                        </div>
                    </div>
                </div>
                <div class="flex_horizontal mobile_vertical help_dotpoint_container mobile_vertically_centered">
                    <div class="help_dotpoint_num">
                        2.
                    </div>
                    <div class="flex_vertical">
                        <h2>Find A Room</h2>
                        <div>
                            You can experience commencement in any of the identical virtual rooms. Each room can hold up to 20 people. Think of these as different sections of the same auditorium. All of the rooms will see the same content, but you will only be able to interact with people in the same room as you.
                            <br />
                            <br />To choose a room, scroll to the bottom of the page where you will see a list of rooms and how many people are in each (out of the 20 person max). We encourage you to coordinate with your friends to choose a room that can fit your group so you can enjoy the experience together. Once you’ve decided on a room, click “Join” to enter.
                        </div>
                    </div>
                </div>
                <div class="flex_horizontal mobile_vertical help_dotpoint_container mobile_vertically_centered">
                    <div class="help_dotpoint_num">
                        3.
                    </div>
                    <div class="flex_vertical">
                        <h2>Logging On To Virtual Room</h2>
                        <div>
                            Once you’ve clicked “Join”, you will be asked to enter your Miami University unique ID email address to log in. You will receive an email with the subject “Your Miami University Virtual Commencement Sign-In Link” that will contain a login link. Clicking the login link will open a new browser tab/window where you should get a message saying “Email Verified”. You can then close the verification tab tab/window and navigate back to the virtual room tab and click “Enter Room”.
                            <br />
                            <br />By entering this virtual environment, you acknowledge that you have read, understood, and agreed to abide by the Virtual Commencement Code of Conduct.
                        </div>
                    </div>
                </div>
                <div class="flex_horizontal mobile_vertical help_dotpoint_container mobile_vertically_centered">
                    <div class="help_dotpoint_num">
                        4.
                    </div>
                    <div class="flex_vertical">
                        <h2>Creating A Name & Avatar</h2>
                        <div>
                            Once inside your room, you will be asked to enter your name and choose your avatar, both of which will be visible to others in the room. We recommend you use your real First and Last name to help others identify you. To see available avatar options, click “Browse Avatars” and click on your desired choice.
                        </div>
                    </div>
                </div>
                <div class="flex_horizontal mobile_vertical help_dotpoint_container mobile_vertically_centered">
                    <div class="help_dotpoint_num">
                        5.
                    </div>
                    <div class="flex_vertical">
                        <h2>Setting Up Communication</h2>
                        <div>
                            Once you have created a name and chosen an avatar, click “Enter on Screen” (or “Connect VR Headset” for VR headset users). You will then be asked to grant mic permissions. To grant mic permissions, click “Allow”, (Clicking “Block” will prevent you from using your microphone to communicate to others in the room) then click “Next”. If you have multiple microphones, this screen will allow you to choose which one to use. If you don’t know what to select, simply continue with Default. If your microphone is working, you should see a blue level indicator inside the microphone icon when you speak. Click the speaker to test your speakers or headphones. When you are done, click “Enter Now”
                        </div>
                    </div>
                </div>
                <div class="flex_horizontal mobile_vertical help_dotpoint_container mobile_vertically_centered">
                    <div class="help_dotpoint_num">
                        6.
                    </div>
                    <div class="flex_vertical">
                        <h2>Moving Around</h2>
                        <div>
                            Once you are in a virtual room, use the controls below to move around the room
                            <br />
                            <br />Laptop / Desktop Controls:
                            <br />-To walk, use WASD keyboard controls like you would a first person game. (W moves forward, A moves left, S moves backward, D moves right.)
                            <br />-To move faster, hold down SHIFT as you move.
                            <br />-To look left, right, up and down, CLICK AND DRAG using the LEFT MOUSE BUTTON.
                            <br />
                            <br />Mobile Controls:
                            <br />-To walk, use two fingers to MAKE A PINCH OPEN GESTURE
                            <br />-To look left, right, up, and down, SWIPE AROUND the screen with ONE FINGER
                        </div>
                    </div>
                </div>
                <div class="flex_horizontal mobile_vertical help_dotpoint_container mobile_vertically_centered">
                    <div class="help_dotpoint_num">
                        7.
                    </div>
                    <div class="flex_vertical">
                        <h2>Communicating With Others</h2>
                        <div>
                            Please Note: The ceremony includes a live text or audio chat feature. We recommend using the text chat feature to ensure the most accessible experience for all participants.
                            <br />
                            <br />Once inside a room, you can communicate with other individuals as if you were in a real space. To talk to others via text chat, type in the translucent text bar at the bottom of the screen and press the “ENTER KEY”. Your message will then be displayed in the main chat window to the rest of the room.
                            <br />
                            <br />To Adjust the volume of the video, hover your mouse over the middle screen and click on the “+” and “-“ buttons
                            <br />To adjust your Name and Avatar Preferences (and additional settings), click on the Menu button in the top left corner of your window.
                        </div>
                    </div>
                </div>
                <div class="flex_horizontal mobile_vertical help_dotpoint_container mobile_vertically_centered">
                    <div class="help_dotpoint_num">
                        8.
                    </div>
                    <div class="flex_vertical">
                        <h2>Changing And Leaving Rooms</h2>
                        <div>
                            To move to a different room, simply navigate back to this page, by either hitting the back button, or by going to miamioh-gradify.com, and select “Join” another room. You will not need to repeat the sign in process.
                            <br />
                            <br />To leave a room, simply close the tab or window in your browser.
                        </div>
                    </div>
                </div>
                <div class="flex_horizontal mobile_vertical help_dotpoint_container mobile_vertically_centered">
                    <div class="help_dotpoint_num">
                        9.
                    </div>
                    <div class="flex_vertical">
                        <h2>Support And Reporting Conduct</h2>
                        <div>
                            If you are having trouble, try refreshing the page and re-entering the room. If you are still having trouble, you can chat with us at subvrsive.com/miami-university or by emailing support@subvrsive.com
                            <br />
                            <br />With sign in, all users agree to abide by the Virtual Commencement Code of Conduct. Report any violations of the Code of Student Conduct to the Office of Community Standards at CommunityStandards@Miamioh.edu. This includes conduct that is defamatory, harassing or discriminatory, obscene, or is inciting or facilitating violence including threats of violence or harm and intimidation
                        </div>
                    </div>
                </div>
            </div>
            {/* End of Body */}

        </div>
      </Page>
    }
      </>
  );
}
