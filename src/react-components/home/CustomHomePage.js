import React, { useContext, useEffect, useState } from "react";
import { addLocaleData } from "react-intl";
import en from "react-intl/locale-data/en";
import { usePublicRooms } from "./usePublicRooms";
import { RoomList } from "./RoomList";
import { GroupFeaturedRooms } from "../misc/GroupFeaturedRooms"
import IconFile from '../../assets/images/home/IconFile.svg';
import IconRoom from '../../assets/images/home/IconRoom.svg';
import IconPeople from '../../assets/images/home/IconPeople.svg';
import IconUnicorn from '../../assets/images/home/IconUnicorn.svg';
import Menu from '../../assets/images/hamburger.svg'
import CloseMenu from '../../assets/images/exit_menu.svg'
import { Page } from '../layout/Page'
import { AuthContext } from "../auth/AuthContext";
import { FormattedMessage } from "react-intl";
import { createAndRedirectToNewHub } from "../../utils/phoenix-utils";
import maskEmail from "../../utils/mask-email";
import '../../assets/stylesheets/common.css';
import '../../assets/stylesheets/common_mobile.css';
import '../../assets/stylesheets/home.css';
import '../../assets/stylesheets/home_mobile.css';
import '../../assets/stylesheets/help.css';
import '../../assets/stylesheets/help_mobile.css';

addLocaleData([...en]);

export function CustomHomePage() {
  const auth = useContext(AuthContext);
  const { results: publicRooms } = usePublicRooms();
  const [groupedKeynoteRooms, groupedNetworkRooms] = GroupFeaturedRooms(publicRooms, 'keynote');

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
    <div className="header flex_horizontal">
        <img className="header_logo" src={"../../assets/images/Logo.svg"}/>
        <img />
        <div className="growing_div"></div>

        {/* Sign in functionality for Desktop */}
          {auth.isSignedIn ? (

              <button className="header_button transparent_header_button desktop_only" onClick={auth.signOut}>
                  Sign Out
              </button>

          ) : (
            <button className="header_button transparent_header_button desktop_only" onClick={(e) => {
                                                                                      e.preventDefault();
                                                                                      window.location.href='/signin';
                                                                                      }}>
                Sign In
            </button>
          )}
        {/* End of sign in functionality for Desktop */}

        <button className="header_button transparent_header_button desktop_only" onClick={() => {setShowHome(false)}}>
            Help
        </button>

        <button className="header_button blue_button desktop_only" onClick={() => {setShowHome(true)}}>
            Event Home
        </button>

        <img className="mobile_only" onClick={openNav} src={Menu}/>

        {/* Mobile Menu */}
        <div id="myNav" className="overlay">
          <img className="mobile_only" onClick={closeNav} src={CloseMenu}/>

          {/* Sign in functionality for Mobile */}
          {auth.isSignedIn ? (
            <button className="mobile_menu_item mobile_menu_only" onClick={auth.signOut}>
                Sign Out
            </button>
          ) : (
            <button className="mobile_menu_item mobile_menu_only" onClick={(e) => {
                                                                          e.preventDefault();
                                                                          window.location.href='/signin';
                                                                          closeNav();}}>
              Sign In
            </button>
          )}
          {/* End of sign in functionality for Mobile */}

          <button className="mobile_menu_item mobile_menu_only" onClick={() => {setShowHome(false); closeNav()}}>
            Help
          </button>
          <button className="mobile_menu_item mobile_menu_only" onClick={() => {setShowHome(true); closeNav();}}>
            Event Home
          </button>
        </div>
        {/* End of Mobile Menu */}


      </div>
      {/* End of Header */}

      {/* Main Page */}
      {showHome ?
      <Page>
        <div className="flex_vertical">

            {/* Body */}
            <div className="flex_horizontal instructions_div mobile_vertical mobile_vertically_centered">
                <div className="growing_div"></div>
                <img className="rocket_image" src={"../../assets/images/home/LargeRocket.svg"}/>
                <div className="growing_div"></div>
                <div className="flex_vertical welcome_instructions">
                    <div className="flex_vertical flex_center_vertically instructions_title">
                        <h1 className="h1_large">Welcome</h1>
                        <div className="centered_subtitle_text" style={{marginTop: '0px'}}>
                          The next phase in your journey to the Future of Health takes place in a virtual world.
                          With or without a 3D headset, get ready to hear from Karen DeSalvo, Chief Health Officer
                          at Google (6:30-7:00pm) and join topic-oriented meetups with other attendees (7:00-8:00pm)
                        </div>
                    </div>
                    <div className="flex_horizontal mobile_vertical">
                      <h4>HOW TO PARTICIPATE:</h4>
                    </div>
                    <div className="flex_horizontal mobile_vertical">
                        <div className="instruction_icon_file" style={{backgroundImage: "url(" + IconFile +")"}}></div>
                        <div className="flex_vertical">
                            <h3>Step 1.</h3>
                            <div className="instructions_text">
                                Begin your journey by boarding a keynote ship (listed below).
                                Look for one that hasn’t reached the 20 person capacity.
                            </div>
                        </div>
                    </div>
                    <div className="flex_horizontal mobile_vertical">
                        <div className="instruction_icon" style={{backgroundImage: "url("+ IconRoom + ")"}}></div>
                        <div className="flex_vertical">
                            <h3>Step 2.</h3>
                            <div className="instructions_text">
                                Select the “Join” button and from there you will be asked to select your name and an avatar.
                                We encourage you to use your real name and company!
                            </div>
                        </div>
                    </div>
                    <div className="flex_horizontal mobile_vertical">
                        <div className="instruction_icon" style={{backgroundImage: "url(" + IconPeople + ")"}}></div>
                        <div className="flex_vertical">
                            <h3>Step 3. Network</h3>
                            <div className="instructions_text">
                              Follow the entry screen prompts and your avatar will be dropped into the bridge of the spaceship.
                              Walk to the front of the room and tune in for the keynote address.
                              Use W-A-S-D keys or the arrow keys on your keyboard to move around.
                              Enable your microphone for proximity-based voice chat or use the text box down below.
                            </div>
                        </div>
                    </div>
                    <div className="flex_horizontal mobile_vertical">
                        <div className="instruction_icon" style={{backgroundImage: "url(" + IconUnicorn + ")"}}></div>
                        <div className="flex_vertical">
                            <h3>Step 4.</h3>
                            <div className="instructions_text">
                              After the keynote, use the back arrow in your browser to return to this page.
                              Scroll down to find the topic meetup locations and get ready to explore other
                              virtual worlds and meet and voice chat with other attendees who have similar interests.
                              You can visit different rooms by using the back button and re-entering.
                            </div>
                        </div>
                    </div>
                </div>
                <div className="growing_div"></div>
            </div>
            <div className="home_content mobile_vertically_centered">
                <h2>Keynote: Karen DeSalvo, <br/>Chief Health Officer, Google</h2>
                <div className="h2_subtitle">Sept. 23, 6:30-7:00 pm ET</div>
                <div className="room_collection_description">
                    Choose a ship for your journey and follow the instructions on screen.
                </div>
            </div>
            <div className="room_list flex_horizontal">
                <RoomList rooms={groupedKeynoteRooms}/>
            </div>
            <div className="home_content mobile_vertically_centered">
                <h2>Topic Meetups & Networking</h2>
                <div className="h2_subtitle">7:00-8:00 pm ET</div>
                <div className="room_collection_description">
                    Explore other virtual worlds and meet and voice chat with other attendees who have similar interests.
                </div>
            </div>
            <div className="room_list flex_horizontal">
                <RoomList rooms={groupedNetworkRooms}/>
            </div>
            <div className="flex_vertical">
                <h1>Need Help Accessing the VR World?</h1>
                <h1 className="h1_subtitle">Click below for full instructions.</h1>
                <button className="blue_button help_button_bottom" onClick={() => {setShowHome(false)}}>Help</button>
            </div>
            {/* End of Body */}

        </div>
      </Page> :

      <Page>
        <div className="flex_vertical">

            {/* Body */}
            <div className="flex_vertical heading_container">
                <h1 className="h1_large">Having Trouble?</h1>
                <h1 className="h1_large">We Can help.</h1>
                <div className="centered_subtitle_text">
                    Here are some help instructions to guide you through our virtual experience.
                </div>
            </div>
            <div className="flex_vertical help_content mobile_vertically_centered">
                <div className="flex_horizontal mobile_vertical help_dotpoint_container mobile_vertically_centered">
                    <div className="help_dotpoint_num">
                        1.
                    </div>
                    <div className="flex_vertical">
                        <h2>Before You Get Started</h2>
                        <div>
                            For the best experience possible, we recommend using: A relatively new laptop or desktop computer
                            with a reliable internet connection The latest Firefox browser. While the virtual rooms work with
                            most devices and web browsers, including Google Chrome and Safari, using low-powered devices such
                            as mobile phones, tablets, and laptops (2015 and older) is not recommended.
                        </div>
                    </div>
                </div>
                <div className="flex_horizontal mobile_vertical help_dotpoint_container mobile_vertically_centered">
                    <div className="help_dotpoint_num">
                        2.
                    </div>
                    <div className="flex_vertical">
                        <h2>Find A Room</h2>
                        <div>
                            You can watch the keynote in any of the rooms marked below Keynote header.
                            Each room can hold up to 20 people. All of the rooms will see the same content,
                            but you will only be able to interact with people in the same room as you. Simply hit “Join” to enter any of the rooms.
                        </div>
                    </div>
                </div>
                <div className="flex_horizontal mobile_vertical help_dotpoint_container mobile_vertically_centered">
                    <div className="help_dotpoint_num">
                        3.
                    </div>
                    <div className="flex_vertical">
                        <h2>Entering the Virtual Room</h2>
                        <div>
                          You will then be introduced to the <b>Lobby</b> of the room where you will have several options to gain access.
                          <br/><br/>
                          If you are using a VR Headset select the <b>“Enter on Stand Alone VR Headset.”</b><br/>
                          If you merely wish to spectate the room you can select <b>“Watch from Lobby”</b><br/>
                          If you are entering from a normal browser or web device you can select <b>“Enter Room”</b>
                        </div>
                    </div>
                </div>
                <div className="flex_horizontal mobile_vertical help_dotpoint_container mobile_vertically_centered">
                    <div className="help_dotpoint_num">
                        4.
                    </div>
                    <div className="flex_vertical">
                        <h2>Creating A Name & Avatar</h2>
                        <div>
                          Once inside your room, you will be asked to enter your name and choose your avatar,
                          both of which will be visible to others in the room. To see available avatar options,
                          click “Browse Avatars” and click on your desired choice. We encourage you to use your
                          real name and company to facilitate networking.
                        </div>
                    </div>
                </div>
                <div className="flex_horizontal mobile_vertical help_dotpoint_container mobile_vertically_centered">
                    <div className="help_dotpoint_num">
                        5.
                    </div>
                    <div className="flex_vertical">
                        <h2>Setting Up Communication</h2>
                        <div>
                          Once you have created a name and chosen an avatar, click on <b>“Enter on Screen”</b> (or <b>“Connect VR Headset”</b>
                          for VR headset users). You will then be asked to grant mic permissions.
                          <br/><br/>
                          To grant mic permissions, click <b>“Allow”</b> on the pop up in the left hand corner of your browser,
                          (Clicking <b>“Block”</b> will prevent you from using your microphone to communicate to others in the room).
                          <br/><br/>
                          Then click <b>“Next”</b>. If you have multiple microphones, this screen will allow you to choose
                          which one to use. If you don’t know what to select, simply continue with <b>“Default”</b>.
                          If your microphone is working, you should see a blue level indicator inside the microphone
                          icon when you speak. Click the speaker to test your speakers or headphones. When you are done, click <b>“Enter Now”</b>.
                        </div>
                    </div>
                </div>
                <div className="flex_horizontal mobile_vertical help_dotpoint_container mobile_vertically_centered">
                    <div className="help_dotpoint_num">
                        6.
                    </div>
                    <div className="flex_vertical">
                        <h2>Moving Around</h2>
                        <div>
                          Once you are in a virtual room, use the controls below to move around the room.
                          <br/><br/>
                          <b>Laptop / Desktop Controls:</b><br/>
                          -To walk, use W-A-S-D keys<br/>
                          (W moves forward, A moves left, S moves backward, D moves right.)<br/>
                          -To move faster, hold down SHIFT as you move.<br/>
                          -To look left, right, up and down, CLICK AND DRAG using the LEFT MOUSE BUTTON.
                          <br/><br/>
                          <b>Mobile Controls:</b><br/>
                          -To walk, use two fingers to MAKE A PINCH OPEN GESTURE<br/>
                          -To look left, right, up, and down, SWIPE AROUND the screen with ONE FINGER<br/>
                        </div>
                    </div>
                </div>
                <div className="flex_horizontal mobile_vertical help_dotpoint_container mobile_vertically_centered">
                    <div className="help_dotpoint_num">
                        7.
                    </div>
                    <div className="flex_vertical">
                        <h2>Communicating With Others</h2>
                        <div>
                          Once inside a room, you can communicate with other individuals as if you were in a real space.
                          To talk to others via text chat, type in the translucent text bar at the bottom of the screen
                          and press the <b>“ENTER KEY”</b>. Your message will then be displayed in the main chat window to the rest of the room.
                          <br/><br/>
                          To Adjust the volume of the video, hover your mouse over the middle screen and click on the “+” and “-“ buttons
                          <br/><br/>
                          To adjust your Name and Avatar Preferences (and additional settings),
                          click on the Menu button in the top left corner of your window.
                        </div>
                    </div>
                </div>
                <div className="flex_horizontal mobile_vertical help_dotpoint_container mobile_vertically_centered">
                    <div className="help_dotpoint_num">
                        8.
                    </div>
                    <div className="flex_vertical">
                        <h2>Changing And Leaving Rooms</h2>
                        <div>
                          To move to the Networking rooms once the Keynote is over to, simply navigate back to this page,
                          by either hitting the back button, or by going to hubs-cbinsights.com, and select “Join” another room.
                          <br/><br/>
                          To leave the room and experience simply close the tab or window in your browser.
                        </div>
                    </div>
                </div>
                <div className="flex_horizontal mobile_vertical help_dotpoint_container mobile_vertically_centered">
                    <div className="help_dotpoint_num">
                        9.
                    </div>
                    <div className="flex_vertical">
                        <h2>Support And Reporting Conduct</h2>
                        <div>
                            If you are having trouble, try refreshing the page and re-entering the room.
                            If you are still having trouble, you can chat with us at subvrsive.com/miami-university
                            or by emailing <i>events@cbinsights.com</i>
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
